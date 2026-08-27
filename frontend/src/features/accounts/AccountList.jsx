import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../../core/ContextApi';
import { motion } from 'framer-motion';
import TableHeaderControls from '../../components/common/TableHeaderControls';

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

const ActionMenu = ({ onEdit, onDelete, isOpen, toggleMenu }) => {
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleMenu}
        className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors flex items-center"
      >
        Action <ChevronDown className="w-4 h-4 inline ml-1" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
          <button
            onClick={onEdit}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const CustomToggleSwitch = ({ isChecked, onToggle }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={isChecked}
      onChange={onToggle}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
  </label>
);

const AccountList = () => {
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);
  
  const [columns, setColumns] = useState([
    { key: 'accountNumber', label: 'Account No', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'initialBalance', label: 'Initial Balance', visible: true },
    { key: 'isDefault', label: 'Default', visible: true },
    { key: 'note', label: 'Note', visible: true },
  ]);
    
  const {accounts,setAccounts}=useContext(ContextApi)
  const navigate = useNavigate();

  const handleDefaultToggle = (id) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => ({
        ...account,
        isDefault: account._id === id ? !account.isDefault : false,
      }))
    );
  };

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredAccounts = (accounts || []).filter(
    (account) =>
      (account.accountNumber && account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (account.name && account.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (account.note && account.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleAllRows = () => {
    setSelectedRows((prev) =>
      prev.length === filteredAccounts.length ? [] : filteredAccounts.map((a) => a._id)
    );
  };

  const totalInitialBalance = filteredAccounts.reduce((sum, row) => sum + (Number(row.initialBalance) || 0), 0);

  const handleEdit = (id) => {
    navigate(`/account/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts/${id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setAccounts((prev) => prev.filter(p => p._id !== id));
      }
    } catch(err) {
      console.error(err);
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected account(s)?`)) return;
    for (const id of selectedRows) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
    setAccounts((prev) => prev.filter((a) => !selectedRows.includes(a._id)));
    setSelectedRows([]);
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
        className="w-full bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        {/* Reusable Header Controls */}
        <TableHeaderControls
          title="Account List"
          addLabel="+ Add Account"
          onAdd={() => navigate('/account/add')}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search accounts..."
          data={filteredAccounts}
          exportFilename="Accounts_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table Section */}
        <div className="bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredAccounts.length && filteredAccounts.length > 0}
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  {isColVisible('accountNumber') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Account No</th>}
                  {isColVisible('name') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Name</th>}
                  {isColVisible('initialBalance') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Initial Balance</th>}
                  {isColVisible('isDefault') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Default</th>}
                  {isColVisible('note') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Note</th>}
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(account._id)}
                        onChange={() => toggleRowSelection(account._id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    {isColVisible('accountNumber') && <td className="px-3 py-4 text-sm font-medium text-gray-800">{account.accountNumber}</td>}
                    {isColVisible('name') && <td className="px-3 py-4 text-sm text-gray-700">{account.name}</td>}
                    {isColVisible('initialBalance') && <td className="px-3 py-4 text-sm text-gray-700">{account.initialBalance}</td>}
                    {isColVisible('isDefault') && (
                      <td className="px-3 py-4">
                        <CustomToggleSwitch
                          isChecked={account.isDefault}
                          onToggle={() => handleDefaultToggle(account._id)}
                        />
                      </td>
                    )}
                    {isColVisible('note') && <td className="px-3 py-4 text-sm text-gray-700">{account.note || 'N/A'}</td>}
                    <td className="px-3 py-4 relative">
                      <ActionMenu
                        isOpen={openActionId === account._id}
                        toggleMenu={() => setOpenActionId(prev => (prev === account._id ? null : account._id))}
                        onEdit={() => handleEdit(account._id)}
                        onDelete={() => handleDelete(account._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Totals */}
          <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-lg font-semibold text-gray-800">{totalInitialBalance.toFixed(2)}</span>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredAccounts.length}</span> of{' '}
                <span className="font-medium">{filteredAccounts.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-purple-500 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccountList;