import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const EditAccount = () => {

  const [formData, setFormData] = useState({
    accountNumber: '',
    name: '',
    initialBalance: 0,
    note: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
      setFormData(data);
      alert('Account Updated successfully!');
      navigate('/account/list');
    } catch (err) {
    }
  };

  return (
    <div className='p-6'>
      <motion.div
        className="bg-white p-6 rounded-lg shadow w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-2">Edit Account</h2>
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
    </div>
  );
};

export default EditAccount;