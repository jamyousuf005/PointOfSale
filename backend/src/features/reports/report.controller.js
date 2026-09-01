const Sale = require('../sales/sale.model');
const Purchase = require('../purchases/purchase.model');
const Product = require('../products/product.model');
const Account = require('../accounts/account.model');
const SaleReturn = require('../returns/saleReturn.model');
const PurchaseReturn = require('../returns/purchaseReturn.model');
const asyncHandler = require('../../middlewares/asyncHandler');

// Example Dashboard Aggregation
const getDashboardKPIs = asyncHandler(async (req, res) => {
    // 1. Total Sales Revenue
    const sales = await Sale.find({ paymentStatus: 'Paid', userId: (req.user.tenantId || req.user._id) });
    const totalSalesRevenue = sales.reduce((acc, sale) => acc + (sale.totalAmount || 0), 0);

    // 2. Total Purchase Cost
    const purchases = await Purchase.find({ paymentStatus: 'Paid', userId: (req.user.tenantId || req.user._id) });
    const totalPurchaseCost = purchases.reduce((acc, p) => acc + (p.total || 0), 0);

    // 3. Low Stock Products (e.g., currentStock <= alertQuantity)
    const lowStockProducts = await Product.find({
        userId: (req.user.tenantId || req.user._id),
        $expr: { $lte: ["$currentStock", "$alertQuantity"] }
    });

    // 4. Total Cash in Accounts
    const accounts = await Account.find({ userId: (req.user.tenantId || req.user._id) });
    const totalAccountBalance = accounts.reduce((acc, a) => acc + (a.currentBalance || 0), 0);

    // 5. Total Sale Returns
    const saleReturns = await SaleReturn.find({ userId: (req.user.tenantId || req.user._id) });
    const totalSaleReturns = saleReturns.reduce((acc, sr) => acc + (sr.totalRefundAmount || 0), 0);

    // 6. Total Purchase Returns
    const purchaseReturns = await PurchaseReturn.find({ userId: (req.user.tenantId || req.user._id) });
    const totalPurchaseReturns = purchaseReturns.reduce((acc, pr) => acc + (pr.totalRefundAmount || 0), 0);

    const profit = totalSalesRevenue - totalPurchaseCost - totalSaleReturns + totalPurchaseReturns;

    // 7. Monthly Data for Yearly Chart
    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, () => ({ purchased: 0, sold: 0 }));

    sales.forEach(sale => {
        const date = new Date(sale.createdAt);
        if (date.getFullYear() === currentYear) {
            monthlyData[date.getMonth()].sold += (sale.totalAmount || 0);
        }
    });

    purchases.forEach(purchase => {
        const date = new Date(purchase.createdAt);
        if (date.getFullYear() === currentYear) {
            monthlyData[date.getMonth()].purchased += (purchase.total || 0);
        }
    });

    // 8. Recent Transactions
    const recentSales = await Sale.find({ userId: (req.user.tenantId || req.user._id) }).sort({ createdAt: -1 }).limit(5).lean();
    const recentPurchases = await Purchase.find({ userId: (req.user.tenantId || req.user._id) }).sort({ createdAt: -1 }).limit(5).lean();

    const recentTransactions = {
        sales: recentSales.map(s => ({
            date: new Date(s.createdAt).toLocaleDateString('en-GB'),
            reference: 'SALE-' + s._id.toString().slice(-6),
            customer: s.customer || 'Walk-in',
            status: s.saleStatus || 'Completed',
            grandTotal: s.totalAmount || 0
        })),
        purchases: recentPurchases.map(p => ({
            date: new Date(p.createdAt).toLocaleDateString('en-GB'),
            reference: 'PUR-' + p._id.toString().slice(-6),
            customer: p.supplier || 'N/A',
            status: p.purchaseStatus || 'Completed',
            grandTotal: p.total || 0
        }))
    };

    // 9. Best Sellers
    // const currentMonth = new Date().getMonth();
    // const bestSellersMonthMap = {};
    // const bestSellersYearMap = {};

    const currentMonth = new Date().getMonth();
    const bestSellersMonthMap = {};
    const bestSellersYearMap = {};

    sales.forEach(sale => {
        const date = new Date(sale.createdAt);
        const isCurrentYear = date.getFullYear() === currentYear;
        const isCurrentMonth = isCurrentYear && date.getMonth() === currentMonth;

        if (sale.products && isCurrentYear) {
            sale.products.forEach(item => {
                const id = item.productId ? item.productId.toString() : item.productName;
                const name = item.productName || 'Unknown';
                const code = item.productCode || '';

                if (!bestSellersYearMap[id]) {
                    bestSellersYearMap[id] = { id, name, code, qty: 0, total: 0 };
                }
                bestSellersYearMap[id].qty += (item.quantity || 0);
                bestSellersYearMap[id].total += (item.quantity || 0) * (item.netUnitPrice || 0);

                if (isCurrentMonth) {
                    if (!bestSellersMonthMap[id]) {
                        bestSellersMonthMap[id] = { id, name, code, qty: 0, total: 0 };
                    }
                    bestSellersMonthMap[id].qty += (item.quantity || 0);
                    bestSellersMonthMap[id].total += (item.quantity || 0) * (item.netUnitPrice || 0);
                }
            });
        }
    });

    const bestSellersMonthQty = Object.values(bestSellersMonthMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const bestSellersYearQty = Object.values(bestSellersYearMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const bestSellersYearPrice = Object.values(bestSellersYearMap).sort((a, b) => b.total - a.total).slice(0, 5);

    return res.status(200).json({
        totalSalesRevenue,
        totalPurchaseCost,
        lowStockProductsCount: lowStockProducts.length,
        totalAccountBalance,
        totalSaleReturns,
        totalPurchaseReturns,
        profit,
        monthlyData,
        recentTransactions,
        bestSellersMonthQty,
        bestSellersYearQty,
        bestSellersYearPrice
    });
});

const getPaymentReport = asyncHandler(async (req, res) => {
    // Collect all paid entities
    const sales = await Sale.find({ paymentStatus: 'Paid', userId: (req.user.tenantId || req.user._id) }).lean();
    const purchases = await Purchase.find({ paymentStatus: 'Paid', userId: (req.user.tenantId || req.user._id) }).lean();
    const saleReturns = await SaleReturn.find({ refundStatus: 'Paid', userId: (req.user.tenantId || req.user._id) }).lean();
    const purchaseReturns = await PurchaseReturn.find({ refundStatus: 'Paid', userId: (req.user.tenantId || req.user._id) }).lean();

    const report = [];

    sales.forEach(s => {
        report.push({
            id: s._id,
            date: s.createdAt,
            paymentReference: 'PAY-' + s._id.toString().slice(-6),
            saleReference: 'SALE-' + s._id.toString().slice(-6),
            purchaseReference: '',
            paidBy: s.accountId ? 'Account Transfer' : 'Cash',
            amount: s.totalAmount || 0,
            createdBy: s.biller || 'System',
            type: 'Sale (Received)'
        });
    });

    purchases.forEach(p => {
        report.push({
            id: p._id,
            date: p.createdAt,
            paymentReference: 'PAY-' + p._id.toString().slice(-6),
            saleReference: '',
            purchaseReference: 'PUR-' + p._id.toString().slice(-6),
            paidBy: p.accountId ? 'Account Transfer' : 'Cash',
            amount: -(p.total || 0), // Negative because we paid
            createdBy: 'System',
            type: 'Purchase (Sent)'
        });
    });

    saleReturns.forEach(sr => {
        report.push({
            id: sr._id,
            date: sr.createdAt,
            paymentReference: 'REF-' + sr._id.toString().slice(-6),
            saleReference: 'SALE-RET-' + sr._id.toString().slice(-6),
            purchaseReference: '',
            paidBy: sr.accountId ? 'Account Transfer' : 'Cash',
            amount: -(sr.totalRefundAmount || 0), // Negative because we refunded customer
            createdBy: sr.biller || 'System',
            type: 'Sale Return (Refunded)'
        });
    });

    purchaseReturns.forEach(pr => {
        report.push({
            id: pr._id,
            date: pr.createdAt,
            paymentReference: 'REF-' + pr._id.toString().slice(-6),
            saleReference: '',
            purchaseReference: 'PUR-RET-' + pr._id.toString().slice(-6),
            paidBy: pr.accountId ? 'Account Transfer' : 'Cash',
            amount: pr.totalRefundAmount || 0, // Positive because we got refund from supplier
            createdBy: 'System',
            type: 'Purchase Return (Received)'
        });
    });

    // Sort by date descending
    report.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(report);
});

const getProductReport = asyncHandler(async (req, res) => {
    const products = await Product.find({ userId: (req.user.tenantId || req.user._id) }).lean();
    const sales = await Sale.find({ userId: (req.user.tenantId || req.user._id) }).lean();
    const purchases = await Purchase.find({ userId: (req.user.tenantId || req.user._id) }).lean();

    const productMap = {};

    products.forEach(p => {
        productMap[p._id.toString()] = {
            id: p._id,
            name: p.productName,
            purchasedAmount: 0,
            purchasedQty: 0,
            soldAmount: 0,
            soldQty: 0,
            profit: 0,
            inStock: p.currentStock || 0
        };
    });

    purchases.forEach(purchase => {
        if (purchase.products) {
            purchase.products.forEach(item => {
                const id = item.productId.toString();
                if (productMap[id]) {
                    productMap[id].purchasedQty += item.quantity || 0;
                    productMap[id].purchasedAmount += (item.quantity || 0) * (item.netUnitCost || 0);
                }
            });
        }
    });

    sales.forEach(sale => {
        if (sale.products) {
            sale.products.forEach(item => {
                const id = item.productId.toString();
                if (productMap[id]) {
                    productMap[id].soldQty += item.quantity || 0;
                    productMap[id].soldAmount += (item.quantity || 0) * (item.netUnitPrice || 0);
                }
            });
        }
    });

    const report = Object.values(productMap).map(p => {
        p.profit = p.soldAmount - (p.soldQty * (p.purchasedQty > 0 ? p.purchasedAmount / p.purchasedQty : 0));
        return p;
    });

    res.json(report);
});

const getPurchaseReport = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find({ userId: (req.user.tenantId || req.user._id) }).sort({ createdAt: -1 }).lean();

    const report = purchases.map(p => ({
        id: p._id,
        date: p.createdAt,
        reference: 'PUR-' + p._id.toString().slice(-6),
        supplier: p.supplier || 'N/A',
        purchaseStatus: p.status || 'Completed',
        paymentStatus: p.paymentStatus || 'Pending',
        grandTotal: p.total || 0,
        paid: p.paymentStatus === 'Paid' ? p.total : 0,
        due: p.paymentStatus === 'Paid' ? 0 : p.total
    }));

    res.json(report);
});

const getSaleReport = asyncHandler(async (req, res) => {
    const sales = await Sale.find({ userId: (req.user.tenantId || req.user._id) }).sort({ createdAt: -1 }).lean();

    const report = sales.map(s => ({
        id: s._id,
        date: s.createdAt,
        reference: 'SALE-' + s._id.toString().slice(-6),
        customer: s.customer || 'N/A',
        saleStatus: s.saleStatus || 'Completed',
        paymentStatus: s.paymentStatus || 'Pending',
        grandTotal: s.totalAmount || 0,
        paid: s.paymentStatus === 'Paid' ? s.totalAmount : 0,
        due: s.paymentStatus === 'Paid' ? 0 : s.totalAmount
    }));

    res.json(report);
});

module.exports = {
    getDashboardKPIs,
    getPaymentReport,
    getProductReport,
    getPurchaseReport,
    getSaleReport
};
