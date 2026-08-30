import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
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

const UnitModal = ({ isOpen, onClose, onSave, editingUnit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    baseUnit: 'N/A',
    operator: '*',
    operationValue: 1
  });

  useEffect(() => {
    if (editingUnit) {
      setFormData({
        code: editingUnit.code || '',
        name: editingUnit.name || '',
        baseUnit: editingUnit.baseUnit || 'N/A',
        operator: editingUnit.operator || '*',
        operationValue: editingUnit.operationValue || 1
      });
    } else {
      setFormData({
        code: '',
        name: '',
        baseUnit: 'N/A',
        operator: '*',
        operationValue: 1
      });
    }
  }, [editingUnit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingUnit ? editingUnit.id || editingUnit._id : null);
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
          <h2 className="text-xl font-semibold mb-4">{editingUnit ? 'Edit Unit' : 'Add Unit'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. pc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. Piece"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Unit</label>
              <input
                type="text"
                name="baseUnit"
                value={formData.baseUnit}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="N/A"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Operator</label>
                <select
                  name="operator"
                  value={formData.operator}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="*">*</option>
                  <option value="/">/</option>
                  <option value="+">+</option>
                  <option value="-">-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Operation Value</label>
                <input
                  type="number"
                  name="operationValue"
                  value={formData.operationValue}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
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
                {editingUnit ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Unit = () => {
  const [unitData, setUnitData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'code', label: 'Code', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'baseUnit', label: 'Base Unit', visible: true },
    { key: 'operator', label: 'Operator', visible: true },
    { key: 'operationValue', label: 'Operation Value', visible: true },
  ]);

  const fetchUnits = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/units`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        // ensure each has an id property
        setUnitData(data.map(u => ({ ...u, id: u._id })));
      }
    } catch (err) {
      console.error('Error fetching units:', err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredUnits = unitData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? new Set(filteredUnits.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id, checked) => {
    const newSet = new Set(selectedItems);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedItems(newSet);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/units/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          fetchUnits();
        }
      } catch (err) {
        console.error('Error deleting unit:', err);
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} unit(s)?`)) {
      for (let id of selectedItems) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/units/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setSelectedItems(new Set());
      fetchUnits();
    }
  };

  const handleSaveUnit = async (formData, editId) => {
    try {
      const url = editId 
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/units/${editId}` 
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/units`;
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
        fetchUnits();
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error saving unit');
      }
    } catch (err) {
      console.error('Error saving unit:', err);
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
          title="Unit List"
          addLabel="+ Add Unit"
          onAdd={() => { setEditingUnit(null); setIsModalOpen(true); }}
          extraButtons={[
            {
              label: '📁 Import Unit',
              onClick: () => alert('Import Unit clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search units..."
          data={filteredUnits}
          exportFilename="Units_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedItems.size}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredUnits.length && filteredUnits.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
                {isColVisible('code') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Code</th>}
                {isColVisible('name') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Name</th>}
                {isColVisible('baseUnit') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Base Unit</th>}
                {isColVisible('operator') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Operator</th>}
                {isColVisible('operationValue') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Operation Value</th>}
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUnits.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </td>
                  {isColVisible('code') && <td className="px-3 py-4 text-sm">{item.code}</td>}
                  {isColVisible('name') && <td className="px-3 py-4 text-sm">{item.name}</td>}
                  {isColVisible('baseUnit') && <td className="px-3 py-4 text-sm">{item.baseUnit}</td>}
                  {isColVisible('operator') && <td className="px-3 py-4 text-sm">{item.operator}</td>}
                  {isColVisible('operationValue') && <td className="px-3 py-4 text-sm">{item.operationValue}</td>}
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
                          onClick={() => { setEditingUnit(item); setIsModalOpen(true); setOpenActionId(null); }}
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
              Showing <span className="font-medium">{filteredUnits.length > 0 ? 1 : 0}</span> to <span className="font-medium">{filteredUnits.length}</span> of <span className="font-medium">{filteredUnits.length}</span> results
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
      <UnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUnit}
        editingUnit={editingUnit}
      />
    </motion.div>
  );
};

export default Unit;