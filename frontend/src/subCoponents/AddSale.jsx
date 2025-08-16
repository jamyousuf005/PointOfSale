import React, { useState, useContext } from "react";
import { Trash2 } from 'lucide-react';

import { ContextApi } from "../components/ContextApi";

const AddSale = () => {
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

  const { products, customers } = useContext(ContextApi);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const warehouses = ['Main Warehouse', 'Secondary Warehouse', 'Backup Warehouse'];
  const taxOptions = [
    { label: 'No Tax', value: 0 },
    { label: 'VAT 5%', value: 5 },
    { label: 'VAT 10%', value: 10 },
    { label: 'VAT 15%', value: 15 },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['orderTax', 'orderDiscount', 'shippingCost'];
    const processedValue = numericFields.includes(name) ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
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
    const orderTaxAmount = subtotal * (formData.orderTax / 100);
    const finalTotal = subtotal + orderTaxAmount - formData.orderDiscount + formData.shippingCost;
    return finalTotal;
  };

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

      const res = await fetch(`http://localhost:8001/api/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
      alert('Sales form submitted')
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 rounded-lg shadow-md bg-white">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4">Add Sale</h1>
          <p className="mb-4 text-sm text-gray-600">The field labels marked with * are required input fields.</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="customer">
                  Customer *
                </label>
                <select
                  id="customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select customer...</option>
                  {customers.map(cus => (
                    <option key={cus.id} value={cus.name}>{cus.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="warehouse">
                  Warehouse *
                </label>
                <select
                  id="warehouse"
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select warehouse...</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse} value={warehouse}>{warehouse}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="biller">
                  Biller *
                </label>
                <select
                  id="biller"
                  name="biller"
                  value={formData.biller}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Biller...</option>
                  <option value="Excel communication">Excel communication</option>
                </select>
              </div>
              {/* New Status Fields */}
              <div>
                <label className="block mb-1 font-medium" htmlFor="saleStatus">
                  Sale Status
                </label>
                <select
                  id="saleStatus"
                  name="saleStatus"
                  value={formData.saleStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="paymentStatus">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Due">Due</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Select Product</label>
              <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
                <div className="px-3 py-2 border-r">
                  <div className="w-6 h-6 bg-gray-300"></div>
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
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {product.productName} ({product.productCode})
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Order Table *</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="text-left bg-gray-100 border-b border-gray-300">
                      <th className="py-2 px-2 border border-gray-300">Name</th>
                      <th className="px-2 border border-gray-300">Code</th>
                      <th className="px-2 border border-gray-300">Quantity</th>
                      <th className="px-2 border border-gray-300">Net Unit Price</th>
                      <th className="px-2 border border-gray-300">Discount</th>
                      <th className="px-2 border border-gray-300">Tax</th>
                      <th className="px-2 border border-gray-300">SubTotal</th>
                      <th className="px-2 border border-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.length > 0 ? (
                      selectedProducts.map((product) => (
                        <tr key={product._id}>
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
                              className="w-20 p-1 border rounded"
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
                              {calculateSubtotal(product).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-2">
                            <div onClick={() => removeProduct(product._id)} className='flex gap-1 py-1 justify-center rounded items-center bg-red-400 cursor-pointer'>
                              <button type="button">Delete</button>
                              <span><Trash2 className="w-4 h-4" /></span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-gray-500">
                          No products selected.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold bg-gray-100 border-t border-gray-300 text-center">
                      <td colSpan="2" className="px-2 py-2 border border-gray-300 text-left">Total</td>
                      <td className="px-2 border border-gray-300">
                        {selectedProducts.reduce((sum, p) => sum + (quantities[p._id] || 0), 0)}
                      </td>
                      <td colSpan="2" className="px-2 border border-gray-300">0.00</td>
                      <td className="px-2 border border-gray-300">0.00</td>
                      <td className="px-2 border border-gray-300">{calculateTotal().toFixed(2)}</td>
                      <td className="px-2 border border-gray-300"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="orderTax">
                  Order Tax
                </label>
                <select
                  id="orderTax"
                  name="orderTax"
                  value={formData.orderTax}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {taxOptions.map(tax => (
                    <option key={tax.value} value={tax.value}>{tax.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="orderDiscount">
                  Order Discount
                </label>
                <input
                  type="number"
                  id="orderDiscount"
                  name="orderDiscount"
                  value={formData.orderDiscount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="shippingCost">
                  Shipping Cost
                </label>
                <input
                  type="number"
                  id="shippingCost"
                  name="shippingCost"
                  value={formData.shippingCost}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="saleNote">
                  Sale Note
                </label>
                <textarea
                  id="saleNote"
                  name="saleNote"
                  value={formData.saleNote}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="staffNote">
                  Staff Note
                </label>
                <textarea
                  id="staffNote"
                  name="staffNote"
                  value={formData.staffNote}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Final Summary Section */}
            <div className="bg-gray-100 p-4 rounded-md mt-6 border border-gray-300">
              <h3 className="text-lg font-semibold mb-2">Sale Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                <div className="col-span-1 text-gray-700">Items</div>
                <div className="col-span-1 text-right font-bold">{calculateItems()}</div>

                <div className="col-span-1 text-gray-700">Total</div>
                <div className="col-span-1 text-right font-bold">{calculateTotal().toFixed(2)}</div>
                
                <div className="col-span-1 text-gray-700">Order Tax ({formData.orderTax}%)</div>
                <div className="col-span-1 text-right font-bold">{(calculateTotal() * (formData.orderTax / 100)).toFixed(2)}</div>
                
                <div className="col-span-1 text-gray-700">Order Discount</div>
                <div className="col-span-1 text-right font-bold">{formData.orderDiscount.toFixed(2)}</div>
                
                <div className="col-span-1 text-gray-700">Shipping Cost</div>
                <div className="col-span-1 text-right font-bold">{formData.shippingCost.toFixed(2)}</div>

                <div className="col-span-2 border-t border-gray-400 my-2"></div>
                
                <div className="col-span-1 text-gray-900 text-lg">Grand Total</div>
                <div className="col-span-1 text-right text-lg font-bold text-purple-600">{calculateGrandTotal().toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddSale;