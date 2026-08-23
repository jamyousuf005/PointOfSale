import { useContext, useEffect, useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { ContextApi } from '../../core/ContextApi';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define the animation variants for the outer container.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Define animation variants for the inner content.
const uniformVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(2px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const EditPurchases = () => {
    const { products, setProducts, customers } = useContext(ContextApi);
    const { id } = useParams();

    const [formData, setFormData] = useState({
        warehouse: '',
        supplier: '',
        purchaseStatus: 'Received',
        orderTax: 0,
        discount: 0,
        shippingCost: 0,
        note: '',
    });

    const [productSearch, setProductSearch] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the specific purchase data to edit
        if (id) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                } 
            })
            .then(res => res.json())
            .then(data => {
                setFormData({
                    warehouse: data.warehouse,
                    supplier: data.supplier,
                    purchaseStatus: data.purchaseStatus,
                    orderTax: data.orderTax,
                    discount: data.discount,
                    shippingCost: data.shippingCost,
                    note: data.note,
                });
                setProducts(data.products);
            })
            .catch(err => console.error("Error fetching purchase:", err));
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => setAllProducts(data))
        .catch(err => console.error("Error fetching all products:", err));
    }, [id]);

    const warehouses = ['Main Warehouse', 'Secondary Warehouse', 'Backup Warehouse'];
    const purchaseStatusOptions = ['Received', 'Pending', 'Ordered'];
    const taxOptions = [
        { label: 'No Tax', value: 0 },
        { label: 'VAT 5%', value: 5 },
        { label: 'VAT 10%', value: 10 },
        { label: 'VAT 15%', value: 15 },
    ];

    const handleInputChange = (field, value) => {
        const numericFields = ['orderTax', 'discount', 'shippingCost'];
        const processedValue = numericFields.includes(field) ? Number(value) : value;

        setFormData(prev => ({
            ...prev,
            [field]: processedValue
        }));
    };

    const addProduct = (product) => {
        // Find if the product already exists in the cart
        const existingProduct = products.find(p => p.productCode === product.productCode);

        if (existingProduct) {
            // If exists, just update the quantity
            setProducts(prev => prev.map(p =>
                p.productCode === product.productCode
                    ? { ...p, quantity: p.quantity + 1 }
                    : p
            ));
        } else {
            // If new, add it to the products list with initial quantity
            const newProduct = {
                ...product,
                _id: product._id, // Use the real database ID
                quantity: 1,
                discount: 0, // Individual product discount (if applicable)
                tax: 0,      // Individual product tax (if applicable)
                subTotal: (parseFloat(product.productCost) || 0) * 1,
            };
            setProducts(prev => [...prev, newProduct]);
        }
        setProductSearch('');
    };

    const updateProductDetails = (productId, field, value) => {
        setProducts(prev => prev.map(p => {
            if (p._id === productId) {
                let updatedProduct = { ...p, [field]: parseFloat(value) || 0 };

                // Recalculate subTotal based on updated values
                const cost = parseFloat(updatedProduct.productCost) || 0;
                const quantity = parseFloat(updatedProduct.quantity) || 0;
                const taxRate = parseFloat(formData.orderTax) || 0;
                const itemDiscount = parseFloat(updatedProduct.discount) || 0;

                const priceAfterDiscount = (cost * quantity) - itemDiscount;
                const taxAmount = priceAfterDiscount * (taxRate / 100);
                const newSubTotal = priceAfterDiscount + taxAmount;

                return { ...updatedProduct, subTotal: newSubTotal };
            }
            return p;
        }));
    };

    const removeProduct = (idToRemove) => {
        setProducts(prev => prev.filter(product => product._id !== idToRemove));
    };

    const calculateGrandTotal = () => {
        const productTotal = (products || []).reduce((sum, product) => sum + (parseFloat(product.subTotal) || 0), 0);
        const orderDiscount = parseFloat(formData.discount) || 0;
        const shippingCost = parseFloat(formData.shippingCost) || 0;
        const orderTaxRate = parseFloat(formData.orderTax) || 0;

        const totalBeforeTax = productTotal - orderDiscount + shippingCost;
        const taxAmount = totalBeforeTax * (orderTaxRate / 100);

        return totalBeforeTax + taxAmount;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.warehouse) {
            alert('Please select a warehouse');
            return;
        }

        const submissionData = {
            ...formData,
            products: products.map(({ _id, ...product }) => ({ ...product, tax: formData.orderTax, discount: formData.discount, subTotal: calculateSubTotalForProduct(product) })),
            total: calculateGrandTotal(),
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(submissionData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Server error:', errorData);
                throw new Error('Failed to update purchase.');
            }

            const updatedPurchase = await res.json();

            navigate('/purchase/list');

        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const calculateSubTotalForProduct = (product) => {
        const cost = parseFloat(product.productCost) || 0;
        const quantity = parseFloat(product.quantity) || 0;
        const orderTaxRate = parseFloat(formData.orderTax) || 0;
        const orderDiscount = parseFloat(formData.discount) || 0;

        const totalCost = cost * quantity;
        const discountAmount = totalCost * (orderDiscount / 100);
        const subtotalBeforeTax = totalCost - discountAmount;
        const taxAmount = subtotalBeforeTax * (orderTaxRate / 100);

        return subtotalBeforeTax + taxAmount;
    };

    const filteredProducts = allProducts.filter(p =>
        productSearch.trim() !== '' && (
            p.productCode.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.productName.toLowerCase().includes(productSearch.toLowerCase())
        )
    );

    return (
        // Apply outer container variants
        <motion.div 
            className='p-6'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Apply inner uniform variants */}
            <motion.div 
                className="p-6 bg-white rounded-lg shadow-sm"
                variants={uniformVariants}
            >
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Purchase</h1>
                <div className="space-y-6">
                    <p className="text-sm text-gray-500 italic">
                        The field labels marked with * are required input fields.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Warehouse <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.warehouse}
                                    onChange={(e) => handleInputChange('warehouse', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                    required
                                >
                                    <option value="">Select warehouse...</option>
                                    {warehouses.map(warehouse => (
                                        <option key={warehouse} value={warehouse}>{warehouse}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supplier
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.supplier}
                                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="">Select supplier...</option>
                                    {customers.map(cus => (
                                        <option key={cus.id} value={cus.name}>{cus.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Purchase Status
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.purchaseStatus}
                                    onChange={(e) => handleInputChange('purchaseStatus', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    {purchaseStatusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Product
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Type product name or code..."
                                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400">📦</span>
                            </span>
                            {productSearch && filteredProducts.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredProducts.map((product) => (
                                        <li
                                            key={product._id}
                                            onClick={() => addProduct(product)}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {product.productName} ({product.productCode})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Table <span className="text-red-500">*</span>
                        </label>
                        <div className="overflow-x-auto border border-gray-300 rounded-md">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Code</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Net Unit Cost</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SubTotal</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(products || []).map((product) => (
                                        <tr key={product._id}>
                                            <td className="px-4 py-3">{product.productName}</td>
                                            <td className="px-4 py-3">{product.productCode}</td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    value={product.quantity}
                                                    onChange={(e) => updateProductDetails(product._id, 'quantity', e.target.value)}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                                                    min="1"
                                                />
                                            </td>
                                            <td className="px-4 py-3">{product.productCost}</td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-gray-900">
                                                    {calculateSubTotalForProduct(product).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduct(product._id)}
                                                    className='flex items-center gap-1 py-1 px-2 rounded bg-red-400 text-white hover:bg-red-500'
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Order Tax</label>
                            <div className="relative">
                                <select
                                    value={formData.orderTax}
                                    onChange={(e) => handleInputChange('orderTax', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none bg-white"
                                >
                                    {taxOptions.map(tax => (
                                        <option key={tax.label} value={tax.value}>{tax.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                            <input
                                type="number"
                                value={formData.discount}
                                onChange={(e) => handleInputChange('discount', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                min="0" step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
                            <input
                                type="number"
                                value={formData.shippingCost}
                                onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                min="0" step="0.01"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => handleInputChange('note', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Enter any additional notes..."
                        />
                    </div>
                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-700"
                        >
                            Submit
                        </button>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">
                                Grand Total: ${calculateGrandTotal().toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EditPurchases;