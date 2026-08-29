import React, { useState, useEffect, useContext } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableFooter,
  TableHead, TableRow, Checkbox, Paper, Modal, Box, Typography,
  TextField, Button, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import { motion } from 'framer-motion';
import { ContextApi } from "../../core/ContextApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const uniformVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(2px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } }
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const MoneyTransfer = () => {
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [transfers, setTransfers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { accounts } = useContext(ContextApi);

  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: ''
  });

  const fetchTransfers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/money-transfers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setTransfers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setFormData({ fromAccount: '', toAccount: '', amount: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/money-transfers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        handleClose();
        fetchTransfers();
      } else {
        alert('Failed to record transfer');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="p-4 bg-white shadow-sm rounded-lg font-sans" variants={uniformVariants}>
          
          <div className="bg-white p-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button 
                onClick={handleOpen}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-md text-base transition">
                + Add Money Transfer Log
              </button>
            </div>
            
            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto mt-4">
              <TableContainer component={Paper} className="shadow-none">
                <Table size="small" className="min-w-full">
                  <TableHead className="bg-gray-50">
                    <TableRow>
                      {["Date", "Reference No", "From Account", "To Account", "Amount"].map((head, idx) => (
                        <TableCell key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                    {transfers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No transfer logs available
                        </TableCell>
                      </TableRow>
                    ) : (
                      transfers.map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.referenceNo}</TableCell>
                          <TableCell>{item.fromAccount}</TableCell>
                          <TableCell>{item.toAccount}</TableCell>
                          <TableCell className="font-semibold text-green-600">${item.amount}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* Custom Tailwind Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-[oklch(0.55_0.29_299.73)] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                Log Money Transfer
              </h2>
              <button onClick={handleClose} className="text-white hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Account <span className="text-red-500">*</span></label>
                <select
                  name="fromAccount"
                  value={formData.fromAccount}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[oklch(0.55_0.29_299.73)] focus:border-[oklch(0.55_0.29_299.73)] outline-none transition-all bg-gray-50 hover:bg-white"
                >
                  <option value="" disabled>Select Source Account</option>
                  {accounts?.map(acc => (
                    <option key={acc._id} value={acc.name || acc.accountName}>{acc.name || acc.accountName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Account <span className="text-red-500">*</span></label>
                <select
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[oklch(0.55_0.29_299.73)] focus:border-[oklch(0.55_0.29_299.73)] outline-none transition-all bg-gray-50 hover:bg-white"
                >
                  <option value="" disabled>Select Destination Account</option>
                  {accounts?.map(acc => (
                    <option key={acc._id} value={acc.name || acc.accountName}>{acc.name || acc.accountName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-[oklch(0.55_0.29_299.73)] focus:border-[oklch(0.55_0.29_299.73)] outline-none transition-all bg-gray-50 hover:bg-white"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[oklch(0.55_0.29_299.73)] rounded-lg hover:bg-[oklch(0.50_0.29_299.73)] focus:ring-4 focus:ring-[oklch(0.70_0.29_299.73)] transition-all shadow-sm"
                >
                  Record Transfer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MoneyTransfer;