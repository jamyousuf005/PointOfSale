import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CustomSelect } from '../../components/common/CustomSelect';

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

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    systemTitle: 'Excel Communication',
    systemLogo: null,
    currency: 'Pakistani Rupee',
    currencyPosition: 'Prefix',
    timeZone: '',
    staffAccess: 'All Records',
    invoiceFormat: 'Standard',
    dateFormat: '',
    developedBy: 'Excel Communication'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNativeInputChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      systemLogo: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset form to empty/default values
    setFormData({
      systemTitle: '',
      systemLogo: null,
      currency: '',
      currencyPosition: 'Prefix',
      timeZone: '',
      staffAccess: '',
      invoiceFormat: '',
      dateFormat: '',
      developedBy: ''
    });
    
    // Reset file input
    const fileInput = document.getElementById('systemLogo');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    // Apply the container variants to the outermost div
    <motion.div 
      className="p-7"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Apply the uniform variants to the main content div */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">General Setting</h1>
        
        <p className="text-sm text-gray-500 italic mb-6">
          The field labels marked with <span className="text-red-500">*</span> are required input fields.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* System Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="systemTitle"
                  value={formData.systemTitle}
                  onChange={handleNativeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  options={['Pakistani Rupee', 'US Dollar', 'Euro']}
                  placeholder="Select Currency"
                />
              </div>

              {/* Time Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <CustomSelect
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleInputChange}
                  options={['Asia/Karachi', 'UTC', 'America/New_York']}
                  placeholder="Select TimeZone..."
                />
              </div>

              {/* Invoice Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Format <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  name="invoiceFormat"
                  value={formData.invoiceFormat}
                  onChange={handleInputChange}
                  options={['Standard', 'Detailed', 'Simple']}
                  placeholder="Select Format"
                />
              </div>

              {/* Developed By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Developed By
                </label>
                <input
                  type="text"
                  name="developedBy"
                  value={formData.developedBy}
                  onChange={handleNativeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* System Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Logo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="systemLogo"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*"
                  required
                />
              </div>

              {/* Currency Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Position <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currencyPosition"
                      value="Prefix"
                      checked={formData.currencyPosition === 'Prefix'}
                      onChange={handleNativeInputChange}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Prefix</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currencyPosition"
                      value="Suffix"
                      checked={formData.currencyPosition === 'Suffix'}
                      onChange={handleNativeInputChange}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Suffix</span>
                  </label>
                </div>
              </div>

              {/* Staff Access */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Access <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  name="staffAccess"
                  value={formData.staffAccess}
                  onChange={handleInputChange}
                  options={['All Records', 'Own Records', 'Limited Access']}
                  placeholder="Select Access Level"
                />
              </div>

              {/* Date Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleInputChange}
                  options={['dd-mm-yyyy', 'mm-dd-yyyy', 'yyyy-mm-dd']}
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
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

export default GeneralSettings;