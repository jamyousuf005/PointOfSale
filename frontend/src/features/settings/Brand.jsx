import React, { useState } from 'react';
import { ChevronDown, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import TableHeaderControls from '../../components/common/TableHeaderControls';
import dell from '../../assets/dell.png';
import hp from '../../assets/hp.png';
import mac from '../../assets/mac.png';
import oppo from '../../assets/oppo.png';
import vivo from '../../assets/vivo.png';

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

const initialBrands = [
  { id: 1, name: 'Dell', image: dell, hasImage: true },
  { id: 2, name: 'Club Special', image: null, hasImage: false },
  { id: 3, name: 'Mac', image: mac, hasImage: true },
  { id: 4, name: 'HP', image: hp, hasImage: true },
  { id: 5, name: 'Oppo', image: oppo, hasImage: true },
  { id: 6, name: 'Vivo', image: vivo, hasImage: true },
];

const Brand = () => {
  const [brands, setBrands] = useState(initialBrands);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'image', label: 'Image', visible: true },
    { key: 'name', label: 'Brand Name', visible: true },
  ]);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredBrands = brands.filter((item) =>
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
    if (action === 'Delete') {
      if (window.confirm("Are you sure you want to delete this brand?")) {
        setBrands((prev) => prev.filter((b) => b.id !== rowId));
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} brand(s)?`)) {
      setBrands((prev) => prev.filter((b) => !selectedItems.includes(b.id)));
      setSelectedItems([]);
    }
  };

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible !== false : true;
  };

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Brand List"
          addLabel="+ Add Brand"
          onAdd={() => alert('Add Brand clicked')}
          extraButtons={[
            {
              label: '📁 Import Brand',
              onClick: () => alert('Import Brand clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search brands..."
          data={filteredBrands}
          exportFilename="Brands_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedItems.length}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredBrands.length && filteredBrands.length > 0}
                    onChange={toggleAllRows}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                  />
                </th>
                {isColVisible('image') && <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">Image</th>}
                {isColVisible('name') && <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">Brand Name</th>}
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
                  {isColVisible('image') && (
                    <td className="px-3 py-3">
                      {item.hasImage ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                      )}
                    </td>
                  )}
                  {isColVisible('name') && <td className="px-3 py-3 text-sm text-gray-700">{item.name}</td>}
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