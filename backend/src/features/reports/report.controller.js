const Sale = require('../sales/sale.model');
const Purchase = require('../purchases/purchase.model');
const Product = require('../products/product.model');
const Account = require('../accounts/account.model');
const asyncHandler = require('../../middlewares/asyncHandler');

// Example Dashboard Aggregation
const getDashboardKPIs = asyncHandler(async (req, res) => {
    // 1. Total Sales Revenue
    const sales = await Sale.find({ paymentStatus: 'Paid' });
    const totalSalesRevenue = sales.reduce((acc, sale) => acc + (sale.totalAmount || 0), 0);

    // 2. Total Purchase Cost
    const purchases = await Purchase.find({ paymentStatus: 'Paid' });
    const totalPurchaseCost = purchases.reduce((acc, p) => acc + (p.total || 0), 0);

    // 3. Low Stock Products (e.g., currentStock <= alertQuantity)
    const lowStockProducts = await Product.find({
        $expr: { $lte: ["$currentStock", "$alertQuantity"] }
    });

    // 4. Total Cash in Accounts
    const accounts = await Account.find({});
    const totalAccountBalance = accounts.reduce((acc, a) => acc + (a.currentBalance || 0), 0);

    return res.status(200).json({
        totalSalesRevenue,
        totalPurchaseCost,
        lowStockProductsCount: lowStockProducts.length,
        totalAccountBalance
    });
});

module.exports = {
    getDashboardKPIs
};
