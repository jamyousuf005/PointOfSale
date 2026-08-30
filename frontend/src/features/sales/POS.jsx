import React, { useState, useContext, useEffect } from 'react';
import { Search, Plus, Edit3, ChevronDown, Download } from 'lucide-react'; // Added ChevronDown and Download for consistency, though not directly used in visible components here.
import { motion } from 'framer-motion'; // Import motion
import dell from '../../assets/dell.png';
import hp from '../../assets/hp.png';
import mac from '../../assets/mac.png';
import oppo from '../../assets/oppo.png';
import vivo from '../../assets/vivo.png';
import { ContextApi } from '../../core/ContextApi';


// Variants from the other components
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

const POS = () => {
  const { laptop } = useContext(ContextApi);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedBiller, setSelectedBiller] = useState('');
  
  const [searchProduct, setSearchProduct] = useState('');
  const [activeTab, setActiveTab] = useState('Category');
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [coupon, setCoupon] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);

  const [selectedBrand, setSelectedBrand] = useState(null);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setProducts(Array.isArray(data) ? data : (data.products || [])))
    .catch(err => { console.error(err); setProducts([]); });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
        const arr = data.showAllcustomers || data;
        setCustomers(Array.isArray(arr) ? arr : []);
    })
    .catch(err => { console.error(err); setCustomers([]); });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/warehouses`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setWarehouses(Array.isArray(data) ? data : []))
    .catch(err => { console.error(err); setWarehouses([]); });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAccounts(Array.isArray(data) ? data : []))
    .catch(err => { console.error(err); setAccounts([]); });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/employees`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
        const arr = data.employees || data;
        setEmployees(Array.isArray(arr) ? arr : []);
    })
    .catch(err => { console.error(err); setEmployees([]); });
  }, []);

  // Compute unique brands and categories for tabs from products
  const brandData = Array.from(new Set((Array.isArray(products) ? products : []).map(p => p.brand).filter(Boolean))).map(brand => ({ name: brand, image: null, hasImage: false }));
  
  const paymentMethods = [
    { name: 'Card', icon: '💳', color: 'bg-blue-500' },
    { name: 'Cash', icon: '💵', color: 'bg-teal-500' },
    { name: 'Paypal', icon: '🅿️', color: 'bg-indigo-600' },
    { name: 'Draft', icon: '📝', color: 'bg-orange-500' },
    { name: 'Cheque', icon: '💰', color: 'bg-pink-500' },
    { name: 'GiftCard', icon: '🎁', color: 'bg-purple-600' },
    { name: 'Deposit', icon: '🏦', color: 'bg-red-500' },
    { name: 'Cancel', icon: '❌', color: 'bg-red-600' },
    { name: 'Recent transaction', icon: '🕒', color: 'bg-yellow-500' }
  ];

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem) {
      setQuantities(prev => ({
        ...prev,
        [product._id]: (prev[product._id] || 1) + 1
      }));
    } else {
      setCartItems(prev => [...prev, product]);
      setQuantities(prev => ({
        ...prev,
        [product._id]: 1
      }));
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item._id !== productId));
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      });
    } else {
      setQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = quantities[item._id] || 1;
      return total + (item.productPrice * quantity);
    }, 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * (discount / 100) + coupon; // Coupon is absolute, discount is %? Or both absolute? Let's use both as absolute to match AddPurchase logic.
    return subtotal + tax + shipping - discount - coupon;
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      return total + (quantities[item._id] || 1);
    }, 0);
  };

  const handlePayment = async (method) => {
    if (method === 'Cancel') {
      setCartItems([]);
      setQuantities({});
      setCoupon(0);
      setDiscount(0);
      setTax(0);
      setShipping(0);
      return;
    }
    
    if (method === 'Recent transaction') {
      return;
    }

    if (!selectedWarehouse) { alert('Please select a warehouse'); return; }
    if (!selectedCustomer) { alert('Please select a customer'); return; }
    if (!selectedBiller) { alert('Please select a biller'); return; }
    if (cartItems.length === 0) { alert('Cart is empty'); return; }

    const submissionData = {
      warehouse: selectedWarehouse,
      customer: selectedCustomer,
      biller: selectedBiller,
      saleStatus: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: method,
      accountId: selectedAccount,
      totalAmount: calculateGrandTotal(),
      products: cartItems.map(item => ({
          productId: item._id,
          productName: item.productName,
          productCode: item.productCode,
          productCost: item.productCost,
          quantity: quantities[item._id] || 1,
          discount: 0,
          tax: 0,
          subTotal: (quantities[item._id] || 1) * item.productPrice
      })),
      orderTax: tax,
      discount: discount + coupon,
      shippingCost: shipping,
      Note: ''
    };

    if (!submissionData.accountId) {
      delete submissionData.accountId;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submissionData)
      });
      if (!res.ok) throw new Error('Failed to submit sale');
      
      alert(`Sale completed successfully via ${method}!`);
      
      // Clear Cart
      setCartItems([]);
      setQuantities({});
      setCoupon(0);
      setDiscount(0);
      setTax(0);
      setShipping(0);
    } catch (err) {
      console.error(err);
      alert('Error submitting sale');
    }
  };

  return (
    <motion.div 
      className='p-6'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-white rounded-lg shadow-sm"
        variants={uniformVariants}
      >
        <motion.div className="ml-0 transition-all duration-300" variants={uniformVariants}>
          <div className="p-4 lg:p-6 max-w-full">
            <div className="bg-white w-full md:justify-around flex items-center rounded shadow-sm mb-4 p-4">
              <div className="w-full flex-col items-center">
                <div className="w-full flex items-center space-x-2 space-y-2 flex-wrap">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-48"
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                  >
                    <option value="">Select warehouse...</option>
                    {warehouses.map((w, idx) => <option key={idx} value={w.name}>{w.name}</option>)}
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-48"
                    value={selectedBiller}
                    onChange={(e) => setSelectedBiller(e.target.value)}
                  >
                    <option value="">Select biller...</option>
                    {employees.map((emp) => <option key={emp._id} value={emp.name}>{emp.name}</option>)}
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-44"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">Select customer...</option>
                    {customers.map((customer) => <option key={customer._id} value={customer.name}> {customer.name} </option>)}
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-44"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    <option value="">Select account...</option>
                    {accounts?.map((acc) => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                  </select>
                  <button className="p-2 mb-2 border border-gray-300 rounded-md hover:bg-gray-50 flex-shrink-0">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content - Proper responsive layout */}
            <motion.div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6" variants={uniformVariants}>
              {/* Left Panel - Cart (Takes 4 columns on xl screens) */}
              <motion.div className="xl:col-span-4 order-2 xl:order-1" variants={uniformVariants}>
                <div className="bg-white rounded-lg shadow-sm">
                  {/* Search */}
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Scan/Search product by name/code"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Cart Items - Responsive table */}
                  <div className="p-3 lg:p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs lg:text-sm">
                        <thead>
                          <tr className="text-gray-600 border-b">
                            <th className="text-left pb-2 pr-2">Product</th>
                            <th className="text-left pb-2 pr-2">Price</th>
                            <th className="text-left pb-2 pr-2">Qty</th>
                            <th className="text-left pb-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item._id} className="border-b">
                              <td className="py-2 pr-2 max-w-20 truncate">{item.productName || 'Unknown'}</td>
                              <td className="py-2 pr-2">${(item.productPrice || 0).toFixed(2)}</td>
                              <td className="py-2 pr-2">
                                <div className="flex items-center space-x-1">
                                  <button 
                                    onClick={() => updateQuantity(item._id, (quantities[item._id] || 1) - 1)}
                                    className="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-gray-300 flex items-center justify-center"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-xs">{quantities[item._id] || 1}</span>
                                  <button 
                                    onClick={() => updateQuantity(item._id, (quantities[item._id] || 1) + 1)}
                                    className="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-gray-300 flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="py-2">${((quantities[item._id] || 1) * (item.productPrice || 0)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals - Better mobile layout */}
                  <div className="p-4 border-t space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Items</span>
                        <span>{getTotalItems()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <span>Discount</span>
                          <Edit3 className="h-3 w-3 text-blue-500 cursor-pointer" />
                        </div>
                        <input 
                          type="number" 
                          className="w-16 text-right border border-gray-300 rounded px-1 py-0.5 text-xs"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <span>Coupon</span>
                          <Edit3 className="h-3 w-3 text-blue-500 cursor-pointer" />
                        </div>
                        <input 
                          type="number" 
                          className="w-16 text-right border border-gray-300 rounded px-1 py-0.5 text-xs"
                          value={coupon}
                          onChange={(e) => setCoupon(Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <span>Tax</span>
                          <Edit3 className="h-3 w-3 text-blue-500 cursor-pointer" />
                        </div>
                        <input 
                          type="number" 
                          className="w-16 text-right border border-gray-300 rounded px-1 py-0.5 text-xs"
                          value={tax}
                          onChange={(e) => setTax(Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <span>Shipping</span>
                          <Edit3 className="h-3 w-3 text-blue-500 cursor-pointer" />
                        </div>
                        <input 
                          type="number" 
                          className="w-16 text-right border border-gray-300 rounded px-1 py-0.5 text-xs"
                          value={shipping}
                          onChange={(e) => setShipping(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="bg-purple-100 p-4 rounded-b-lg">
                    <div className="text-center text-lg font-semibold text-purple-700">
                      Grand Total ${calculateGrandTotal().toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Payment Methods - Better responsive grid */}
                <motion.div className="w-full mt-4" variants={uniformVariants}>
                  <div className="md:w-full md:flex md:justify-between grid grid-cols-3
                    lg:grid-cols-3 
                    xl:grid-cols-3 gap-5">
                    {paymentMethods.map((method, index) => (
                      <button
                        key={index}
                        onClick={() => handlePayment(method.name)}
                        className={`${method.color} text-white p-3 rounded font-bold
                          hover:opacity-90 transition-opacity flex items-center justify-center space-x-1`}
                      >
                        <span className="text-xs">{method.icon}</span>
                        <span className="text-xs hidden sm:inline truncate">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Panel - Products (Takes 8 columns on xl screens) */}
              <motion.div className="xl:col-span-8 order-1 xl:order-2" variants={uniformVariants}>
                <div className="bg-white rounded-lg shadow-sm">
                  {/* Tabs */}
                  <div className="flex border-b">
                    {['Category', 'Brand', 'Featured'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-4 text-sm font-medium ${
                          activeTab === tab
                            ? tab === 'Category' ? 'bg-purple-500 text-white' :
                              tab === 'Brand' ? 'bg-teal-500 text-white' :
                              'bg-red-500 text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid - Better responsive columns */}
                  <div className="p-4 lg:p-6">
                    {selectedBrand && activeTab === 'Category' && (
                      <div className="mb-4 flex items-center justify-between bg-teal-50 p-3 rounded-lg border border-teal-200">
                        <span className="text-sm font-medium text-teal-800">Showing products for Brand: {selectedBrand}</span>
                        <button onClick={() => setSelectedBrand(null)} className="text-xs bg-white text-teal-600 px-3 py-1 rounded border border-teal-300 hover:bg-teal-100">Clear Filter</button>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
                      {activeTab === 'Category' ? (Array.isArray(products) ? products : [])
                        .filter(p => !selectedBrand || p.brand === selectedBrand)
                        .filter(p => !searchProduct || p.productName?.toLowerCase().includes(searchProduct.toLowerCase()) || p.productCode?.toLowerCase().includes(searchProduct.toLowerCase()))
                        .map((product) => (
                        <div
                          key={product._id}
                          className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => addToCart(product)}
                        >
                          <div className=" bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <div className="w-12 h-8 lg:w-16 lg:h-12 overflow-hidden flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_BACKEND_URL}/${product.image.replace(/\\/g, '/')}`} alt={product.productName} className="object-contain w-full h-full" />
                              ) : (
                                <span className="text-gray-400 text-xs">No image</span>
                              )}
                            </div>
                          </div>
                          <h3 className="text-xs lg:text-sm font-medium text-gray-900 mb-1 truncate">{product.productName || 'Unknown'}</h3>
                          <p className="text-xs text-gray-500">{product.productCode || 'N/A'}</p>
                          <p className="text-xs font-semibold text-purple-600 mt-1">${(product.productPrice || 0).toFixed(2)}</p>
                        </div>
                      )) : ' '}

                      {activeTab === 'Brand' ? brandData.map((brands, i) => (
                        <div 
                          className='flex flex-col items-center p-4 border rounded-lg hover:shadow-md cursor-pointer transition-colors hover:bg-teal-50' 
                          key={i} 
                          onClick={() => {
                            setSelectedBrand(brands.name);
                            setActiveTab('Category');
                          }}
                        > 
                          <div className='flex'> <h1 className="font-semibold text-gray-700"> {brands.name} </h1></div>
                        </div>         
                      )) : ''}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-end">
                      <nav className="flex items-center space-x-1">
                        <button className="px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600">
                          1
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default POS;