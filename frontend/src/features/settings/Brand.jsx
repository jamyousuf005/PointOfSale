import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Upload, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import dell from '../../assets/dell.png';
import hp from '../../assets/hp.png';
import mac from '../../assets/mac.png';
import oppo from '../../assets/oppo.png';
import vivo from '../../assets/vivo.png';


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


const Brand = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const brandData = [
    { id: 1, name: 'Dell', image: dell, hasImage: true },
    { id: 2, name: 'Club Special', image: null, hasImage: false },
    { id: 3, name: 'Mac', image: mac, hasImage: true },
    { id: 4, name: 'HP', image: hp, hasImage: true },
    { id: 5, name: 'Oppo', image: oppo, hasImage: true },
    { id: 6, name: 'Vivo', image: vivo, hasImage: true },
  ];
  

  const filteredBrands = brandData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedItems.length === filteredBrands.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredBrands.map((i) => i.id));
    }
  };

  const handleAction = (action, rowId) => {
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
        {/* Top Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Brand
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <select
              className="border border-purple-300 text-purple-700 rounded-md px-2 py-1 text-sm"
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(e.target.value)}
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
              placeholder="Search brands..."
              className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 ring-purple-300"
            />
          </div>

          <div className="flex flex-wrap gap-2">
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
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredBrands.length}
                    onChange={toggleAllRows}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                  />
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">Brand Name</th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBrands.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleRow(item.id)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    {item.hasImage ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                    ) : (
                      <span className="text-xs text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">{item.name}</td>
                  <td className="px-3 py-3 relative">
                    <button
                      onClick={() =>
                        setOpenActionId((prev) => (prev === item.id ? null : item.id))
                      }
                      className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50"
                    >
                      Action <ChevronDown className="w-4 h-4 inline ml-1" />
                    </button>
                    {openActionId === item.id && (
                      <div className="absolute mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
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
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredBrands.length}</span> of{' '}
              <span className="font-medium">{filteredBrands.length}</span> results
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

export default Brand; 