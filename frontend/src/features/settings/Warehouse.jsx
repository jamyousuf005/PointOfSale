import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from 'react-icons/io';
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

const WarehouseModal = ({ isOpen, onClose, onSave, editingWarehouse, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (editingWarehouse) {
      setFormData({
        name: editingWarehouse.name || '',
        email: editingWarehouse.email || '',
        phone: editingWarehouse.phone || '',
        address: editingWarehouse.address || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [editingWarehouse, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingWarehouse ? editingWarehouse.id || editingWarehouse._id : null);
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
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-xl font-semibold text-gray-800">{editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition"
            >
              <IoIosClose size={28} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g. Main Store"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g. warehouse@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g. 555-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g. 123 Storage St."
              />
            </div>
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingWarehouse ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Warehouse = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState([
    { key: 'name', label: 'Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'address', label: 'Address', visible: true },
  ]);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/warehouses`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWarehouseData(data.map(w => ({ ...w, id: w._id })));
      }
    } catch (err) {
      console.error('Error fetching warehouses:', err);
      toast.error('Failed to load warehouses.');
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredWarehouses = warehouseData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? new Set(filteredWarehouses.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id, checked) => {
    const newSet = new Set(selectedItems);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedItems(newSet);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/warehouses/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          toast.success('Warehouse deleted successfully.');
          fetchWarehouses();
        } else {
          toast.error('Failed to delete warehouse.');
        }
      } catch (err) {
        console.error('Error deleting warehouse:', err);
        toast.error('Failed to delete warehouse.');
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} warehouse(s)?`)) {
      for (let id of selectedItems) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/warehouses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setSelectedItems(new Set());
      fetchWarehouses();
      toast.success('Warehouses deleted successfully.');
    }
  };

  const handleSaveWarehouse = async (formData, editId) => {
    setLoading(true);
    try {
      const url = editId 
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/warehouses/${editId}` 
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/warehouses`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Warehouse ${editId ? 'updated' : 'added'} successfully.`);
        fetchWarehouses();
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Error saving warehouse');
      }
    } catch (err) {
      console.error('Error saving warehouse:', err);
      toast.error('Error saving warehouse.');
    } finally {
      setLoading(false);
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
        className="bg-white rounded-lg shadow-sm p-6 overflow-hidden"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Warehouse List"
          addLabel="+ Add Warehouse"
          onAdd={() => { setEditingWarehouse(null); setIsModalOpen(true); }}
          extraButtons={[
            {
              label: '📁 Import Warehouse',
              onClick: () => alert('Import Warehouse clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search warehouses..."
          data={filteredWarehouses}
          exportFilename="Warehouses_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedItems.size}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredWarehouses.length && filteredWarehouses.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                </th>
                {isColVisible('name') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>}
                {isColVisible('email') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>}
                {isColVisible('phone') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>}
                {isColVisible('address') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Address</th>}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredWarehouses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    No warehouses found.
                  </td>
                </tr>
              ) : (
                filteredWarehouses.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                    </td>
                    {isColVisible('name') && <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>}
                    {isColVisible('email') && <td className="px-6 py-4 text-sm text-gray-900">{item.email}</td>}
                    {isColVisible('phone') && <td className="px-6 py-4 text-sm text-gray-900">{item.phone}</td>}
                    {isColVisible('address') && <td className="px-6 py-4 text-sm text-gray-900">{item.address}</td>}
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() => setOpenActionId(prev => (prev === item.id ? null : item.id))}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 border border-purple-300"
                      >
                        Action
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {openActionId === item.id && (
                        <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                          <button
                            onClick={() => { setEditingWarehouse(item); setIsModalOpen(true); setOpenActionId(null); }}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {filteredWarehouses.length > 0 ? 1 : 0} to {filteredWarehouses.length} of {filteredWarehouses.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded" disabled>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm font-medium">1</button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded" disabled>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWarehouse}
        editingWarehouse={editingWarehouse}
        loading={loading}
      />
    </motion.div>
  );
};

export default Warehouse;
