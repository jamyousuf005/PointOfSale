import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ChevronDown, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);
  const navigate = useNavigate();

  const [columns, setColumns] = useState([
    { key: 'name', label: 'Name', visible: true },
    { key: 'company', label: 'Company', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'address', label: 'Address', visible: true },
  ]);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/suppliers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.map(s => ({ ...s, id: s._id })));
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      toast.error('Failed to load suppliers.');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredSuppliers = suppliers.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? new Set(filteredSuppliers.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id, checked) => {
    const newSet = new Set(selectedItems);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedItems(newSet);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/suppliers/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          toast.success('Supplier deleted successfully.');
          fetchSuppliers();
        } else {
          toast.error('Failed to delete supplier.');
        }
      } catch (err) {
        console.error('Error deleting supplier:', err);
        toast.error('Failed to delete supplier.');
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} supplier(s)?`)) {
      for (let id of selectedItems) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/suppliers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setSelectedItems(new Set());
      fetchSuppliers();
      toast.success('Suppliers deleted successfully.');
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
          title="Supplier List"
          addLabel="+ Add Supplier"
          onAdd={() => navigate('/supplier/add')}
          extraButtons={[
            {
              label: '📁 Import Suppliers',
              onClick: () => alert('Import Suppliers clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search suppliers..."
          data={filteredSuppliers}
          exportFilename="Suppliers_List"
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
                    checked={selectedItems.size === filteredSuppliers.length && filteredSuppliers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                </th>
                {isColVisible('name') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>}
                {isColVisible('company') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Company</th>}
                {isColVisible('email') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>}
                {isColVisible('phone') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>}
                {isColVisible('address') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Address</th>}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((item) => (
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
                    {isColVisible('company') && <td className="px-6 py-4 text-sm text-gray-900">{item.company}</td>}
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
              Showing {filteredSuppliers.length > 0 ? 1 : 0} to {filteredSuppliers.length} of {filteredSuppliers.length} entries
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
    </motion.div>
  );
};

export default SupplierList;
