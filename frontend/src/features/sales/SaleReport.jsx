import React, { useState } from 'react';
import { ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

const SaleReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [saleData, setSaleData] = useState([]);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reports/products`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSaleData(data);
      })
      .catch(err => console.error("Error fetching sale report:", err));
  }, []);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(saleData.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const totals = saleData.reduce((acc, item) => ({
    soldAmount: acc.soldAmount + item.soldAmount,
    soldQty: acc.soldQty + item.soldQty,
    inStock: acc.inStock + item.inStock
  }), {
    soldAmount: 0,
    soldQty: 0,
    inStock: 0
  });

  return (
    // Outer layout animated with Framer Motion
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        variants={uniformVariants}
      >
        <div className="bg-white mb-4 sm:mb-6">
          <div className="px-4 sm:px-6 py-4 border-gray-200">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">Sale Report</h1>
          </div>

          {/* Date and Warehouse Selection */}
          <div className="px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Choose Your Date</label>
                <div className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600 text-center sm:text-left">
                  1988-04-18 To 2025-07-3
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Choose Warehouse</label>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                    <option>All Warehouse</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto">
              Submit
            </button>
          </div>
        </div>

        <div className="bg-white mb-4 sm:mb-6">
          <div className="px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value={recordsPerPage}
                    onChange={(e) => setRecordsPerPage(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">records per page</span>
              </div>

              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="bg-red-400 hover:bg-red-500 text-white px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors">
                PDF
              </button>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors">
                CSV
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors">
                Print
              </button>
              <div className="relative">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1">
                  <span className="hidden sm:inline">Column visibility</span>
                  <span className="sm:hidden">Columns</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === saleData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {saleData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ${item.soldAmount?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.soldQty?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.inStock?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                <td className="px-6 py-4 text-sm text-gray-900">{totals.soldAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{totals.soldQty}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{totals.inStock}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow-sm mt-4 sm:mt-6">
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Showing 1 - 1 (1)
            </div>

            <div className="flex items-center justify-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium">
                1
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SaleReport;