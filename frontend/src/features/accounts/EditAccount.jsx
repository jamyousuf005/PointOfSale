import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ContextApi } from '../../core/ContextApi';

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

export default function EditAccount() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    name: '',
    initialBalance: 0,
    note: '',
  });

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { setAccounts } = React.useContext(ContextApi);

  const requiredFields = ['accountNumber', 'name'];

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      const value = formData[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = 'This field is required.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((err) => console.error('error fetching data', err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      
      const updatedAccount = data.account || data;
      if (setAccounts && updatedAccount && updatedAccount._id) {
        setAccounts(prev => prev.map(acc => acc._id === updatedAccount._id ? updatedAccount : acc));
      }

      setFormData(updatedAccount);
      alert('Account Updated successfully!');
      navigate('/account/list');
    } catch (err) {
      console.error(err);
      alert('Failed to update account. Please try again.');
    }
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
            Edit Account
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
                Account No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Balance
              </label>
              <input
                type="number"
                value={formData.initialBalance}
                onChange={(e) => handleInputChange('initialBalance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>

          <motion.div className="mt-6" variants={uniformVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter note..."
            />
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