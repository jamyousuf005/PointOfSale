import React, { useState } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../../core/ContextApi';
import { CustomSelect } from '../../components/common/CustomSelect';

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

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function AddCustomer() {
  const [customerData, setCustomerData] = useState({
    customerGroup: "Regular Customer",
    name: "",
    companyName: "",
    email: "",
    phone: "",
    taxNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addUser: false,
  });

  const [errors, setErrors] = useState({});
  const { setCustomers } = React.useContext(ContextApi);
  const navigate = useNavigate();

  const requiredFields = ['name', 'phone', 'address', 'city'];

  const handleInputChange = (name, value) => {
    setCustomerData((prev) => ({ ...prev, [name]: value }));

    if (requiredFields.includes(name) && (!value || value.toString().trim() === '')) {
      setErrors((prev) => ({ ...prev, [name]: 'This field is required.' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    requiredFields.forEach((field) => {
      const value = customerData[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = 'This field is required.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newCustomer = {
      id: Date.now(), // Generate a fake ID for frontend functionality
      group: customerData.customerGroup,
      name: customerData.name,
      company: customerData.companyName,
      email: customerData.email,
      phone: customerData.phone,
      tax: customerData.taxNumber,
      address: `${customerData.address}, ${customerData.city}, ${customerData.state}, ${customerData.country}`,
      balance: "0.00",
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    
    setCustomerData({
      customerGroup: "Regular Customer",
      name: "",
      companyName: "",
      email: "",
      phone: "",
      taxNumber: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      addUser: false,
    });
    alert('Customer Added successfully!');
    navigate('/customer/list');
  };

  return (
    <motion.div
      className="p-7"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit}>
        <motion.div
          className="mx-auto p-6 bg-white rounded-lg shadow-sm"
          variants={uniformVariants}
        >
          <motion.h1
            className="text-2xl font-semibold text-gray-900 mb-6"
            variants={uniformVariants}
          >
            Add Customer
          </motion.h1>
          <motion.p
            className="text-sm text-gray-500 mb-6"
            variants={uniformVariants}
          >
            The field labels marked with <span className="text-red-500">*</span> are required input fields.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={gridVariants}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Group <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                name="customerGroup"
                value={customerData.customerGroup}
                onChange={handleInputChange}
                options={['Regular Customer', 'Premium Customer']}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={customerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={customerData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@example.com"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Number</label>
              <input
                type="text"
                name="taxNumber"
                value={customerData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={customerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={customerData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                name="state"
                value={customerData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={customerData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={customerData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 mt-2 lg:mt-8">
              <input
                type="checkbox"
                name="addUser"
                id="addUser"
                checked={customerData.addUser}
                onChange={(e) => handleInputChange('addUser', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="addUser" className="text-sm font-medium text-gray-700">Add User</label>
            </div>
          </motion.div>

          <motion.div className="mt-6" variants={uniformVariants}>
            <motion.button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
}