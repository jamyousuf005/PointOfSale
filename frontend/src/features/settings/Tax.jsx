import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const TaxModal = ({ isOpen, onClose, onSave, editingTax }) => {
  const [formData, setFormData] = useState({
    name: '',
    rate: 0
  });

  useEffect(() => {
    if (editingTax) {
      setFormData({
        name: editingTax.name || '',
        rate: editingTax.rate || 0
      });
    } else {
      setFormData({
        name: '',
        rate: 0
      });
    }
  }, [editingTax, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingTax ? editingTax.id || editingTax._id : null);
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
          <h2 className="text-xl font-semibold mb-4">{editingTax ? 'Edit Tax' : 'Add Tax'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. VAT"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Rate (%) *</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. 15"
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
                {editingTax ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Tax = () => {
  const [taxData, setTaxData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'name', label: 'Name', visible: true },
    { key: 'rate', label: 'Rate (%)', visible: true },
  ]);

  const fetchTaxes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/taxes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTaxData(data.map(t => ({ ...t, id: t._id })));
      }
    } catch (err) {
      console.error('Error fetching taxes:', err);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredTaxes = taxData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? new Set(filteredTaxes.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id, checked) => {
    const newSet = new Set(selectedItems);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedItems(newSet);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tax?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/taxes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          fetchTaxes();
        }
      } catch (err) {
        console.error('Error deleting tax:', err);
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} tax rate(s)?`)) {
      for (let id of selectedItems) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/taxes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setSelectedItems(new Set());
      fetchTaxes();
    }
  };

  const handleSaveTax = async (formData, editId) => {
    try {
      const url = editId 
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/taxes/${editId}` 
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/taxes`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: formData.name, rate: Number(formData.rate) })
      });

      if (res.ok) {
        fetchTaxes();
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error saving tax');
      }
    } catch (err) {
      console.error('Error saving tax:', err);
    }
  };

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible !== false : true;
  };

  return (
    <motion.div
      className="p-6 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6 overflow-hidden"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Tax List"
          addLabel="+ Add Tax"
          onAdd={() => { setEditingTax(null); setIsModalOpen(true); }}
          extraButtons={[
            {
              label: '📁 Import Tax',
              onClick: () => alert('Import Tax clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search taxes..."
          data={filteredTaxes}
          exportFilename="Taxes_List"
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
                    checked={selectedItems.size === filteredTaxes.length && filteredTaxes.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {isColVisible('name') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>}
                {isColVisible('rate') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Rate (%)</th>}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTaxes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredTaxes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {isColVisible('name') && <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>}
                    {isColVisible('rate') && <td className="px-6 py-4 text-sm text-gray-900">{item.rate}%</td>}
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
                            onClick={() => { setEditingTax(item); setIsModalOpen(true); setOpenActionId(null); }}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">Showing {filteredTaxes.length > 0 ? 1 : 0} to {filteredTaxes.length} of {filteredTaxes.length} entries</div>
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
      <TaxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTax}
        editingTax={editingTax}
      />
    </motion.div>
  );
};

export default Tax;