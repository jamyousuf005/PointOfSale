import React, { useState } from 'react';
import { ChevronDown, Info, Download } from 'lucide-react';
import { motion } from 'framer-motion';

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

const ImportPurchaseForm = () => {
  const [formData, setFormData] = useState({
    warehouse: '',
    supplier: '',
    purchaseStatus: 'Received',
    attachedDocument: null,
    csvFile: null,
    orderTax: 'No Tax',
    discount: '',
    shippingCost: '',
    note: ''
  });

  const [errors, setErrors] = useState({});

  const warehouses = ['Main Warehouse', 'Secondary Warehouse', 'Backup Warehouse'];
  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];
  const statusOptions = ['Received', 'Pending', 'Ordered'];
  const taxOptions = ['No Tax', 'VAT 5%', 'VAT 10%', 'VAT 15%'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    
    // Clear error when file is selected
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.warehouse) {
      newErrors.warehouse = 'Warehouse is required';
    }
    
    if (!formData.csvFile) {
      newErrors.csvFile = 'CSV file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDownloadSample = () => {
    // Create sample CSV content
    const sampleData = [
      ['product_code', 'quantity', 'purchase_unit', 'product_cost', 'discount', 'tax_name'],
      ['PROD001', '10', 'pieces', '25.50', '2.00', 'VAT 5%'],
      ['PROD002', '5', 'kg', '15.75', '1.50', 'VAT 10%'],
      ['PROD003', '20', 'units', '8.25', '0.00', 'No Tax']
    ];
    
    // Convert to CSV string
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'purchase_import_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Import form submitted:', submissionData);
    alert('Purchase import submitted successfully!');
    
    // Reset form
    setFormData({
      warehouse: '',
      supplier: '',
      purchaseStatus: 'Received',
      attachedDocument: null,
      csvFile: null,
      orderTax: 'No Tax',
      discount: '',
      shippingCost: '',
      note: ''
    });
    setErrors({});
  };

  return (
    <motion.div 
      className='p-6'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="p-6 bg-white rounded-lg shadow-lg"
        variants={uniformVariants}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Import Purchase</h1>
        
        <div className="space-y-6">
          {/* Required fields notice */}
          <p className="text-sm text-gray-500 italic">
            The field labels marked with * are required input fields.
          </p>

          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.warehouse}
                  onChange={(e) => handleInputChange('warehouse', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white ${
                    errors.warehouse ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select warehouse...</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse} value={warehouse}>{warehouse}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.warehouse && (
                <p className="mt-1 text-sm text-red-600">{errors.warehouse}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <div className="relative">
                <select
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">Select supplier...</option>
                  {suppliers.map(supplier => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Second Row */}
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
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Document
                <Info className="inline w-4 h-4 ml-1 text-gray-400" />
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('attachedDocument', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
          </div>

          {/* CSV Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('csvFile', e.target.files[0])}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                  errors.csvFile ? 'border-red-500' : 'border-gray-300'
                }`}
                accept=".csv"
              />
              {errors.csvFile && (
                <p className="mt-1 text-sm text-red-600">{errors.csvFile}</p>
              )}
              <div className="mt-2 text-sm text-gray-600">
                <p>The correct column order is (product_code, quantity, purchase_unit, product_cost, discount, tax_name) and you must follow this. All columns are required</p>
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={handleDownloadSample}
                className="w-full flex items-center justify-center px-4 py-2
                  bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample File
              </button>
            </div>
          </div>

          {/* Third Row - Tax, Discount, Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Tax
              </label>
              <div className="relative">
                <select
                  value={formData.orderTax}
                  onChange={(e) => handleInputChange('orderTax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  {taxOptions.map(tax => (
                    <option key={tax} value={tax}>{tax}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Cost
              </label>
              <input
                type="number"
                value={formData.shippingCost}
                onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any additional notes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </div>

          {/* File Upload Info */}
          {formData.csvFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    CSV file selected: {formData.csvFile.name}
                  </p>
                  <p className="text-sm text-green-700">
                    File size: {(formData.csvFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImportPurchaseForm;