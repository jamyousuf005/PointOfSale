import { useState } from 'react';
import { motion } from 'framer-motion';

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

function ImportSaleForm() {
  const [formData, setFormData] = useState({
    customer: '',
    warehouse: '',
    biller: '',
    csvFile: null,
    orderTax: 'No Tax',
    orderDiscount: '',
    shippingCost: '',
    attachDocument: null,
    saleStatus: 'Completed',
    saleNote: '',
    staffNote: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    // Outer layout animated with Framer Motion
    <motion.div
      className='p-6'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-7xl mx-auto p-6 rounded-lg shadow-sm bg-white"
        variants={uniformVariants}
      >
        <h1 className="text-xl font-semibold mb-4">Import Sale</h1>
        <p className="mb-4 text-sm text-gray-600">The field labels marked with * are required input fields.</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Customer, Warehouse, Biller */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Customer */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="customer">
                Customer *
              </label>
              <select
                id="customer"
                name="customer"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.customer}
                onChange={handleChange}
                required
              >
                <option value="">Select customer...</option>
                {/* Add options here */}
              </select>
            </div>
            {/* Warehouse */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="warehouse">
                Warehouse *
              </label>
              <select
                id="warehouse"
                name="warehouse"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.warehouse}
                onChange={handleChange}
                required
              >
                <option value="">Select warehouse...</option>
                {/* Add options here */}
              </select>
            </div>
            {/* Biller */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="biller">
                Biller *
              </label>
              <select
                id="biller"
                name="biller"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.biller}
                onChange={handleChange}
                required
              >
                <option value="">Select Biller...</option>
                {/* Add options here */}
              </select>
            </div>
          </div>

          {/* Upload CSV and Download Button */}
          <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
            {/* Upload CSV File */}
            <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch
             md:items-center">
              <div className="flex-1">
                <label className="block mb-1 font-medium" htmlFor="csvFile">
                  Upload CSV File *
                </label>
                <input
                  type="file"
                  id="csvFile"
                  name="csvFile"
                  className="border border-gray-300 rounded p-2 w-full md:w-auto"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                className="mt-2 md:mt-6 md:ml-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full md:w-auto"
                onClick={() => {
                  // Implement download sample file logic
                }}
              >
                Download Sample File
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Order Tax */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="orderTax">
                Order Tax
              </label>
              <select
                id="orderTax"
                name="orderTax"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.orderTax}
                onChange={handleChange}
              >
                <option>No Tax</option>
                {/* Add other options if needed */}
              </select>
            </div>
            {/* Order Discount */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="orderDiscount">
                Order Discount
              </label>
              <input
                type="text"
                id="orderDiscount"
                name="orderDiscount"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.orderDiscount}
                onChange={handleChange}
              />
            </div>
            {/* Shipping Cost */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="shippingCost">
                Shipping Cost
              </label>
              <input
                type="text"
                id="shippingCost"
                name="shippingCost"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.shippingCost}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Attach Document, Sale Status */}
          <div className="grid md:grid-cols-2 gap-4 items-start">
            {/* Attach Document */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="attachDocument">
                Attach Document
              </label>
              <input
                type="file"
                id="attachDocument"
                name="attachDocument"
                className="w-full border border-gray-300 rounded p-2"
                onChange={handleChange}
              />
            </div>
            {/* Sale Status */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="saleStatus">
                Sale Status *
              </label>
              <select
                id="saleStatus"
                name="saleStatus"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.saleStatus}
                onChange={handleChange}
                required
              >
                <option>Completed</option>
                {/* Add other options if needed */}
              </select>
            </div>
          </div>

          {/* Sale Note and Staff Note */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Sale Note */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="saleNote">
                Sale Note
              </label>
              <textarea
                id="saleNote"
                name="saleNote"
                className="w-full border border-gray-300 rounded p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.saleNote}
                onChange={handleChange}
              />
            </div>
            {/* Staff Note */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="staffNote">
                Staff Note
              </label>
              <textarea
                id="staffNote"
                name="staffNote"
                className="w-full border border-gray-300 rounded p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.staffNote}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default ImportSaleForm;