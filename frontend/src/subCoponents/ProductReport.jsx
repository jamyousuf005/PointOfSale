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

const ProductReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const productData = [
    {
      id: 1,
      name: 'Dell 3330',
      purchasedAmount: 154000.00,
      purchasedQty: 7,
      soldAmount: 22000.00,
      soldQty: 1,
      profit: 0.00,
      inStock: 6
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(productData.map(item => item.id)));
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

  const totals = productData.reduce((acc, item) => ({
    purchasedAmount: acc.purchasedAmount + item.purchasedAmount,
    purchasedQty: acc.purchasedQty + item.purchasedQty,
    soldAmount: acc.soldAmount + item.soldAmount,
    soldQty: acc.soldQty + item.soldQty,
    profit: acc.profit + item.profit,
    inStock: acc.inStock + item.inStock
  }), {
    purchasedAmount: 0,
    purchasedQty: 0,
    soldAmount: 0,
    soldQty: 0,
    profit: 0,
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
      <motion.div className='bg-white rounded-lg shadow-sm overflow-hidden' variants={uniformVariants}>
        <div>
          {/* Header */}
          <div className="bg-white mb-4 sm:mb-6">
            <div className="px-4 sm:px-6 py-4 border-gray-200">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">Product Report</h1>
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

          {/* Controls */}
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
          <div className="bg-white shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {productData.map((item) => (
                <div key={item.id} className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-blue-600">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">Stock: {item.inStock}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Purchased:</span>
                      <div className="font-medium">${item.purchasedAmount.toFixed(2)} (Qty: {item.purchasedQty})</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Sold:</span>
                      <div className="font-medium">${item.soldAmount.toFixed(2)} (Qty: {item.soldQty})</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Profit:</span>
                      <div className="font-medium">${item.profit.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Total Card */}
              <div className="bg-gray-50 p-4 font-medium">
                <div className="text-lg mb-3">Total</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Purchased:</span>
                    <div className="font-semibold">${totals.purchasedAmount.toFixed(2)} (Qty: {totals.purchasedQty})</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sold:</span>
                    <div className="font-semibold">${totals.soldAmount.toFixed(2)} (Qty: {totals.soldQty})</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Profit:</span>
                    <div className="font-semibold">${totals.profit.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">In Stock:</span>
                    <div className="font-semibold">{totals.inStock}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === productData.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchased Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchased Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sold Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sold Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      In Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productData.map((item) => (
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
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.purchasedAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.purchasedQty}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.soldAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.soldQty}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.profit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.inStock}
                      </td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {totals.purchasedAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {totals.purchasedQty}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {totals.soldAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {totals.soldQty}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {totals.profit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {totals.inStock}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductReport;