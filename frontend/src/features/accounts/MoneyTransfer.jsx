import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableFooter,
  TableHead, TableRow, Checkbox, Paper,
} from "@mui/material";
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

const MoneyTransfer = () => {
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page] = useState(0);
  const data = []; // Replace with real data when needed

  const handleRecordsChange = (event) => {
    setRecordsPerPage(Number(event.target.value));
  };

  return (
    <>
      <motion.div
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="p-4 bg-white shadow-sm rounded-lg font-sans"
          variants={uniformVariants}
        >
          {/* Control Header */}
          <div className="bg-white p-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-md text-base transition">
                + Add Money Transfer
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Records per page */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  className="border border-gray-300 text-gray-700 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none bg-white"
                  value={recordsPerPage}
                  onChange={handleRecordsChange}
                >
                  {[10, 25, 50].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span className="text-gray-600 text-sm">records per page</span>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <label htmlFor="search" className="text-sm text-gray-700">Search</label>
                <input
                  id="search"
                  type="text"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 w-full"
                  placeholder="Search transfer"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end w-full md:w-auto">
                <button className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-md text-sm">PDF</button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm">CSV</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">Print</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm">Delete</button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm">Column visibility</button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <TableContainer component={Paper} className="shadow-none">
              <Table size="small" className="min-w-full">
                <TableHead className="bg-gray-50">
                  <TableRow>
                    {["", "Date", "Reference No", "From Account", "To Account", "Amount", "Action"].map((head, idx) => (
                      <TableCell
                        key={idx}
                        className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${idx === 0 ? "w-[40px] px-2" : ""}`}
                        align={head === "Amount" ? "right" : "left"}
                      >
                        {idx === 0 ? <Checkbox /> : head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.referenceNo}</TableCell>
                        <TableCell>{item.fromAccount}</TableCell>
                        <TableCell>{item.toAccount}</TableCell>
                        <TableCell align="right">{item.amount}</TableCell>
                        <TableCell>{item.action}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>

                <TableFooter className="bg-white border-t border-gray-100">
                  <TableRow>
                    <TableCell colSpan={5} className="px-4 py-3 font-semibold text-gray-700">Total</TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-gray-700 text-right">0.00</TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>

          {/* Pagination Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 mt-4">
            <span>Showing 0 to 0 of 0 entries</span>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" disabled>&lt;</button>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-md">1</span>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" disabled>&gt;</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default MoneyTransfer;