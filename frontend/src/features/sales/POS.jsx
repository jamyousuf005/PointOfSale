import React, { useState, useContext } from 'react';
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
  const { laptop, accounts } = useContext(ContextApi);
  const [selectedCustomer, setSelectedCustomer] = useState('Select customer...');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [activeTab, setActiveTab] = useState('Category');
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [coupon, setCoupon] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);

  const products = [
    {
      id: 1,
      name: 'Dell 3330',
      image: laptop,
      price: 18500.00
    }
  ];

  const brandData = [
    { id: 1, name: 'Dell', image: dell, hasImage: true },
    { id: 2, name: 'Club Special', image: null, hasImage: false },
    { id: 3, name: 'Mac', image: mac, hasImage: true },
    { id: 4, name: 'HP', image: hp, hasImage: true },
    { id: 5, name: 'Oppo', image: oppo, hasImage: true },
    { id: 6, name: 'Vivo', image: vivo, hasImage: true },
  ];
  
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
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setQuantities(prev => ({
        ...prev,
        [product.id]: (prev[product.id] || 1) + 1
      }));
    } else {
      setCartItems(prev => [...prev, product]);
      setQuantities(prev => ({
        ...prev,
        [product.id]: 1
      }));
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
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
      const quantity = quantities[item.id] || 1;
      return total + (item.price * quantity);
    }, 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + tax + shipping - discount - coupon;
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      return total + (quantities[item.id] || 1);
    }, 0);
  };

  const customers = [
    {
      id: 1,
      group: "Regular Customer",
      name: "Kamal udin Memon",
      company: "Teacher",
      email: "",
      phone: "03133006400",
      tax: "",
      address: "Badurabad Colony Dadu, Dadu ,Pakistan",
      balance: "0.00",
    },
    {
      id: 2,
      group: "Regular Customer",
      name: "Farhan Mallah",
      company: "ELDC Dadu",
      email: "",
      phone: "03103635188",
      tax: "0",
      address: "ELDC Dado Road Dadu, Dadu ,Pakistan",
      balance: "0.00",
    },
    {
      id: 3,
      group: "Regular Customer",
      name: "Muhammad Saleem Mangi",
      company: "advocate",
      email: "",
      phone: "03003238348",
      tax: "",
      address: "Wapda Colony Moro, Moro ,Pakistan",
      balance: "0.00",
    },
  ];

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
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-48">
                    <option>Excel Communication</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-48">
                    <option>Manzoor Ahmed (Excel Com)</option>
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-44"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option>Select customer...</option>
                    {customers.map((customer) => <option key={customer.id}> {customer.name} </option>)}
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 max-w-44"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    <option value="">Select account...</option>
                    {accounts?.map((acc) => <option key={acc._id} value={acc._id}>{acc.accountName}</option>)}
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
                            <tr key={item.id} className="border-b">
                              <td className="py-2 pr-2 max-w-20 truncate">{item.name}</td>
                              <td className="py-2 pr-2">${item.price.toFixed(2)}</td>
                              <td className="py-2 pr-2">
                                <div className="flex items-center space-x-1">
                                  <button 
                                    onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) - 1)}
                                    className="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-gray-300 flex items-center justify-center"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-xs">{quantities[item.id] || 1}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) + 1)}
                                    className="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-gray-300 flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="py-2">${((quantities[item.id] || 1) * item.price).toFixed(2)}</td>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
                      {activeTab === 'Category' ? products.map((product) => (
                        <div
                          key={product.id}
                          className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => addToCart(product)}
                        >
                          <div className=" bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <div className="w-12 h-8 lg:w-16 lg:h-12">
                              <img src={product.image} alt="" />
                            </div>
                          </div>
                          <h3 className="text-xs lg:text-sm font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                          <p className="text-xs text-gray-500">{product.code}</p>
                        </div>
                      )) : ' '}

                      {activeTab === 'Brand' ? brandData.map((brands) => (
                        <div className='flex flex-col items-center' key={brands.id} > 
                          <div> <img className='w-14' src={brands.image} alt="" /></div>
                          <div className='flex'> <h1> {brands.name} </h1></div>
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