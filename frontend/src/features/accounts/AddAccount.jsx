import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddAccount = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    name: '',
    initialBalance: 0,
    note: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts`, {
        method: 'POST',
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

      setFormData({
        accountNo: '',
        name: '',
        initialBalance: 0,
        note: '',
      });
      alert('Account Added successfully!');
      navigate('/account/list');
    } catch (err) {
    }
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
        className="bg-white p-6 rounded-lg shadow w-full"
        variants={uniformVariants}
      >
        <h2 className="text-lg font-semibold mb-2">Add Account</h2>
        <p className="text-sm italic mb-4 text-gray-600">
          The field labels marked with <span className="text-red-500">*</span> are required input fields.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">
              Account No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Initial Balance</label>
            <input
              type="number"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddAccount;