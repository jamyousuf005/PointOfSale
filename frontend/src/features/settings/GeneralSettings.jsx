import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Apply the uniform variants to the main content div */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <h1 className="text-xl font-medium text-gray-900 mb-6">General Setting</h1>
        
        <p className="text-sm text-blue-500 italic mb-6">
          The field labels marked with * are required input fields.
        </p>

        <div onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* System Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.systemTitle}
                  onChange={(e) => handleInputChange('systemTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  >
                    <option value="">Select Currency</option>
                    <option value="Pakistani Rupee">Pakistani Rupee</option>
                    <option value="US Dollar">US Dollar</option>
                    <option value="Euro">Euro</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Time Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <div className="relative">
                  <select
                    value={formData.timeZone}
                    onChange={(e) => handleInputChange('timeZone', e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-500"
                  >
                    <option value="">Select TimeZone...</option>
                    <option value="Asia/Karachi">Asia/Karachi</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Invoice Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Format <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.invoiceFormat}
                    onChange={(e) => handleInputChange('invoiceFormat', e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  >
                    <option value="">Select Format</option>
                    <option value="Standard">Standard</option>
                    <option value="Detailed">Detailed</option>
                    <option value="Simple">Simple</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Developed By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Developed By
                </label>
                <input
                  type="text"
                  value={formData.developedBy}
                  onChange={(e) => handleInputChange('developedBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
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
                      onChange={(e) => handleInputChange('currencyPosition', e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Prefix</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currencyPosition"
                      value="Suffix"
                      checked={formData.currencyPosition === 'Suffix'}
                      onChange={(e) => handleInputChange('currencyPosition', e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
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
                <div className="relative">
                  <select
                    value={formData.staffAccess}
                    onChange={(e) => handleInputChange('staffAccess', e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  >
                    <option value="">Select Access Level</option>
                    <option value="All Records">All Records</option>
                    <option value="Own Records">Own Records</option>
                    <option value="Limited Access">Limited Access</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Date Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-500"
                    required
                  >
                    <option value="">dd-mm-yyy</option>
                    <option value="dd-mm-yyyy">dd-mm-yyyy</option>
                    <option value="mm-dd-yyyy">mm-dd-yyyy</option>
                    <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GeneralSettings;