import React, { useState, useContext, useEffect } from "react";
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ContextApi } from '../../core/ContextApi';
import { useNavigate, useParams } from "react-router-dom";
import { CustomSelect } from '../../components/common/CustomSelect';

// Defining the variants for the animation
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

const EditSale = () => {
  const [formData, setFormData] = useState({
    customer: "",
    warehouse: "",
    biller: "",
    orderTax: 0,
    orderDiscount: 0,
    shippingCost: 0,
    saleStatus: "Completed",
    paymentStatus: "Pending",
    saleNote: "",
    staffNote: "",
  });

  const { id } = useParams();
  const { products, customers, setSales } = useContext(ContextApi);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const warehouses = ['Main Warehouse', 'Secondary Warehouse', 'Backup Warehouse'];
  const billers = ['Excel communication'];
  const taxOptions = [
    { label: 'No Tax', value: 0 },
    { label: 'VAT 5%', value: 5 },
    { label: 'VAT 10%', value: 10 },
    { label: 'VAT 15%', value: 15 },
  ];

  const handleInputChange = (name, value) => {
    const numericFields = ['orderTax', 'orderDiscount', 'shippingCost'];
    const processedValue = numericFields.includes(name) ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleNativeInputChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  const addProduct = (product) => {
    if (!selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts(prev => [...prev, product]);
      setQuantities(prev => ({ ...prev, [product._id]: 1 }));
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts(prev => prev.filter(product => product._id !== id));
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setQuantities(prev => ({ ...prev, [id]: newQuantity }));
  };

  // Calculation Functions
  const calculateItems = () => {
    return selectedProducts.length;
  };

  const calculateSubtotal = (product) => {
    const quantity = quantities[product._id] || 0;
    const price = product.productPrice || 0;
    return quantity * price;
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, product) => {
      return sum + calculateSubtotal(product);
    }, 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateTotal();
    const orderTaxAmount = subtotal * ((formData.orderTax || 0) / 100);
    const finalTotal = (subtotal || 0) + (orderTaxAmount || 0) - (formData.orderDiscount || 0) + (formData.shippingCost || 0);
    return finalTotal;
  };

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setFormData({
            customer: data.customer,
            warehouse: data.warehouse,
            biller: data.biller,
            orderTax: data.orderTax,
            orderDiscount: data.orderDiscount,
            shippingCost: data.shippingCost,
            saleStatus: data.saleStatus,
            paymentStatus: data.paymentStatus,
            saleNote: data.saleNote,
            staffNote: data.staffNote,
          });

          setSelectedProducts(data.products);
          const newQuantities = {};
          data.products.forEach(p => {
            newQuantities[p._id] = p.quantity;
          });
          setQuantities(newQuantities);
        })
        .catch(err => console.error("Error fetching sale data:", err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saleData = {
        ...formData,
        products: selectedProducts.map(p => ({
          _id: p._id,
          productName: p.productName,
          quantity: quantities[p._id],
          unitPrice: p.productPrice,
          subTotal: calculateSubtotal(p),
        })),
        totalAmount: calculateGrandTotal(),
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(saleData)
      });
      const data = await res.json();
      const updatedSale = data.sale || data;
      if (setSales && updatedSale && updatedSale._id) {
         setSales(prev => prev.map(s => s._id === updatedSale._id ? updatedSale : s));
      }
      navigate('/sale/list');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // Outer layout animated with Framer Motion
    <motion.div
      className="p-7"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mx-auto p-6 bg-white rounded-lg shadow-sm"
        variants={uniformVariants}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Sale</h1>
        <p className="mb-6 text-sm text-gray-500 italic">The field labels marked with <span className="text-red-500">*</span> are required input fields.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Customer <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                options={customers.map(c => c.name)}
                placeholder="Select customer..."
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Warehouse <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                name="warehouse"
                value={formData.warehouse}
                onChange={handleInputChange}
                options={warehouses}
                placeholder="Select warehouse..."
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Biller <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                name="biller"
                value={formData.biller}
                onChange={handleInputChange}
                options={billers}
                placeholder="Select Biller..."
              />
            </div>
            {/* New Status Fields */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Sale Status
              </label>
              <CustomSelect
                name="saleStatus"
                value={formData.saleStatus}
                onChange={handleInputChange}
                options={['Completed', 'Pending', 'Canceled']}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <CustomSelect
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                options={['Pending', 'Due', 'Paid']}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Select Product</label>
            <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
              <div className="px-3 py-2 border-r">
                <span className="text-gray-400">📦</span>
              </div>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Please type product code or name..."
                className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none"
              />
            </div>

            {productSearch && (
              <div className="mt-2 border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                {products
                  .filter(p =>
                    p.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.productCode.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map(product => (
                    <div
                      key={product._id}
                      onClick={() => {
                        addProduct(product);
                        setProductSearch('');
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      {product.productName} ({product.productCode})
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="block mb-2 text-sm font-medium text-gray-700">Order Table <span className="text-red-500">*</span></h3>
            <div className="overflow-x-auto border border-gray-300 rounded-md">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left border-b border-gray-300">
                    <th className="py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="px-4 font-semibold text-gray-700">Code</th>
                    <th className="px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="px-4 font-semibold text-gray-700">Net Unit Price</th>
                    <th className="px-4 font-semibold text-gray-700">Discount</th>
                    <th className="px-4 font-semibold text-gray-700">Tax</th>
                    <th className="px-4 font-semibold text-gray-700">SubTotal</th>
                    <th className="px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="block px-2 py-1 text-gray-900">{product.productName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="block px-2 py-1 text-gray-900">{product.productCode}</span>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={quantities[product._id] || 1}
                            onChange={(e) => updateQuantity(product._id, parseInt(e.target.value))}
                            className="w-20 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="block px-2 py-1 text-gray-900">{product.productPrice}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="block px-2 py-1 text-gray-900">0</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="block px-2 py-1 text-gray-900">0</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">
                            {(calculateSubtotal(product) || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-2">
                          <div onClick={() => removeProduct(product._id)} className='flex gap-1 py-1 px-2 justify-center rounded items-center bg-red-400 text-white cursor-pointer hover:bg-red-500'>
                            <button type="button" className="text-sm">Delete</button>
                            <span><Trash2 className="w-4 h-4" /></span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-gray-500 bg-gray-50">
                        No products selected.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-gray-100 border-t border-gray-300">
                    <td colSpan="2" className="px-4 py-3 text-gray-900">Total</td>
                    <td className="px-4 py-3 text-gray-900">
                      {selectedProducts.reduce((sum, p) => sum + (quantities[p._id] || 0), 0)}
                    </td>
                    <td colSpan="2" className="px-4 py-3 text-gray-900">0.00</td>
                    <td className="px-4 py-3 text-gray-900">0.00</td>
                    <td className="px-4 py-3 text-gray-900">{(calculateTotal() || 0).toFixed(2)}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Order Tax
              </label>
              <CustomSelect
                name="orderTax"
                value={taxOptions.find(t => t.value === formData.orderTax)?.label || 'No Tax'}
                onChange={(name, label) => {
                  const opt = taxOptions.find(t => t.label === label);
                  if(opt) handleInputChange('orderTax', opt.value);
                }}
                options={taxOptions.map(t => t.label)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="orderDiscount">
                Order Discount
              </label>
              <input
                type="number"
                id="orderDiscount"
                name="orderDiscount"
                value={formData.orderDiscount}
                onChange={handleNativeInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="shippingCost">
                Shipping Cost
              </label>
              <input
                type="number"
                id="shippingCost"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleNativeInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="saleNote">
                Sale Note
              </label>
              <textarea
                id="saleNote"
                name="saleNote"
                value={formData.saleNote}
                onChange={handleNativeInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="staffNote">
                Staff Note
              </label>
              <textarea
                id="staffNote"
                name="staffNote"
                value={formData.staffNote}
                onChange={handleNativeInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Final Summary Section */}
          <div className="bg-gray-50 p-6 rounded-md mt-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Sale Summary</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm font-medium">
              <div className="text-gray-600">Items</div>
              <div className="text-right font-bold text-gray-900">{calculateItems()}</div>

              <div className="text-gray-600">Total</div>
              <div className="text-right font-bold text-gray-900">${(calculateTotal() || 0).toFixed(2)}</div>

              <div className="text-gray-600">Order Tax ({formData.orderTax}%)</div>
              <div className="text-right font-bold text-gray-900">${(calculateTotal() * (formData.orderTax / 100)).toFixed(2)}</div>

              <div className="text-gray-600">Order Discount</div>
              <div className="text-right font-bold text-gray-900">${(formData.orderDiscount || 0).toFixed(2)}</div>

              <div className="text-gray-600">Shipping Cost</div>
              <div className="text-right font-bold text-gray-900">${(formData.shippingCost || 0).toFixed(2)}</div>

              <div className="col-span-2 border-t border-gray-300 my-2"></div>

              <div className="text-gray-900 text-lg font-bold">Grand Total</div>
              <div className="text-right text-lg font-bold text-purple-600">${(calculateGrandTotal() || 0).toFixed(2)}</div>
            </div>
          </div>

          <motion.div className="flex justify-start mt-6" variants={uniformVariants}>
            <motion.button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditSale;