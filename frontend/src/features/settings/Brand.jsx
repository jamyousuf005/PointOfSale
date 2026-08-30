import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TableHeaderControls from '../../components/common/TableHeaderControls';

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

const BrandModal = ({ isOpen, onClose, onSave, editingBrand }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });

  useEffect(() => {
    if (editingBrand) {
      setFormData({
        name: editingBrand.name || '',
        image: null
      });
    } else {
      setFormData({
        name: '',
        image: null
      });
    }
  }, [editingBrand, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingBrand ? editingBrand.id || editingBrand._id : null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. Dell"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {editingBrand ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'image', label: 'Image', visible: true },
    { key: 'name', label: 'Brand Name', visible: true },
  ]);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/brands`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBrands(data.map(b => ({ ...b, id: b._id })));
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

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

  const handleDelete = async (rowId) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/brands/${rowId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) fetchBrands();
      } catch (err) {
        console.error('Error deleting brand:', err);
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} brand(s)?`)) {
      for (const id of selectedItems) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/brands/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setSelectedItems([]);
      fetchBrands();
    }
  };

  const handleSaveBrand = async (formData, editId) => {
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const url = editId 
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/brands/${editId}` 
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/brands`;
      
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });

      if (res.ok) {
        fetchBrands();
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error saving brand');
      }
    } catch (err) {
      console.error('Error saving brand:', err);
    }
  };

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible !== false : true;
  };

  return (
    <motion.div
      className="p-6 bg-gray-100 min-h-screen"
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
          onAdd={() => { setEditingBrand(null); setIsModalOpen(true); }}
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
                        <img 
                          src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/uploads/${item.image}`} 
                          alt={item.name} 
                          className="w-12 h-12 object-contain rounded" 
                        />
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
                          onClick={() => { setEditingBrand(item); setIsModalOpen(true); setOpenActionId(null); }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
              Showing <span className="font-medium">{filteredBrands.length > 0 ? 1 : 0}</span> to{' '}
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
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBrand}
        editingBrand={editingBrand}
      />
    </motion.div>
  );
};

export default Brand; 