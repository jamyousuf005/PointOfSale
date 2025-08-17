import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Upload } from 'lucide-react';
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

const Unit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);

  const unitData = [
    { id: 1, code: 'PC', name: 'Per PC', baseUnit: 'N/A', operator: '*', operationValue: '1' },
    { id: 2, code: 'KG', name: 'Kilogram', baseUnit: 'N/A', operator: '*', operationValue: '1' }
  ];

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? new Set(unitData.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id, checked) => {
    const newSet = new Set(selectedItems);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedItems(newSet);
  };

  const handleAction = (action, id) => {
    console.log(`${action} for row ${id}`);
    setOpenActionId(null);
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
        {/* Header */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 py-2 rounded-md text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Unit
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 py-2 rounded-md text-sm flex items-center gap-1">
            <Upload className="w-4 h-4" /> Import Unit
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-4">
          <div className="flex items-center gap-2">
            <select
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(e.target.value)}
              className="border border-purple-300 text-purple-700 rounded-md px-2 py-1 text-sm"
            >
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-gray-600 text-sm">records per page</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 ring-purple-300"
              placeholder="Search units..."
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="bg-rose-400 hover:bg-rose-500 text-white px-3 py-1 rounded-md text-sm">PDF</button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">CSV</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Print</button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm">Column Visibility</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === unitData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Code</th>
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Name</th>
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Base Unit</th>
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Operator</th>
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Operation Value</th>
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unitData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-3 py-4 text-sm">{item.code}</td>
                  <td className="px-3 py-4 text-sm">{item.name}</td>
                  <td className="px-3 py-4 text-sm">{item.baseUnit}</td>
                  <td className="px-3 py-4 text-sm">{item.operator}</td>
                  <td className="px-3 py-4 text-sm">{item.operationValue}</td>
                  <td className="px-3 py-4 relative">
                    <button
                      onClick={() => setOpenActionId(prev => (prev === item.id ? null : item.id))}
                      className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                    >
                      Action <ChevronDown className="w-4 h-4 inline ml-1" />
                    </button>
                    {openActionId === item.id && (
                      <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                        <button
                          onClick={() => handleAction('Edit', item.id)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction('Delete', item.id)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{unitData.length}</span> of <span className="font-medium">{unitData.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-purple-500 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Unit;