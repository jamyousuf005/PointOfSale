import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TableHeaderControls from '../../components/common/TableHeaderControls';
import { ContextApi } from '../../core/ContextApi';

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

const CustomerList = () => {
  const navigate = useNavigate();
  const { customers, setCustomers } = React.useContext(ContextApi);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState("10");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);
  const role = localStorage.getItem('role') || 'Cashier';

  const [columns, setColumns] = useState([
    { key: 'group', label: 'Customer Group', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'company', label: 'Company', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'tax', label: 'Tax', visible: true },
    { key: 'address', label: 'Address', visible: true },
    { key: 'balance', label: 'Balance', visible: true },
  ]);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredCustomers = (customers || []).filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows((prev) =>
      prev.length === filteredCustomers.length && filteredCustomers.length > 0
        ? []
        : filteredCustomers.map((c) => c.id)
    );
  };

  const handleAction = async (action, rowId) => {
    if (action === 'Delete') {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/customers/${rowId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
             throw new Error('Failed to delete customer');
          }
          setCustomers((prev) => prev.filter((c) => c.id !== rowId));
        } catch (error) {
          console.error(error);
          alert('Error deleting customer');
        }
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} customer(s)?`)) {
      setCustomers((prev) => prev.filter((c) => !selectedRows.includes(c.id)));
      setSelectedRows([]);
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
        className="w-full bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Customer List"
          addLabel={role !== 'Cashier' ? "+ Add Customer" : undefined}
          onAdd={() => navigate('/customer/add')}
          extraButtons={role !== 'Cashier' ? [
            {
              label: '📁 Import Customer',
              onClick: () => alert('Import Customer clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors shadow-sm'
            }
          ] : []}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search customers..."
          data={filteredCustomers}
          exportFilename="Customers_List"
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
                      checked={
                        selectedRows.length === filteredCustomers.length && filteredCustomers.length > 0
                      }
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  {isColVisible('group') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Customer Group</th>}
                  {isColVisible('name') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Name</th>}
                  {isColVisible('company') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Company</th>}
                  {isColVisible('email') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Email</th>}
                  {isColVisible('phone') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Phone</th>}
                  {isColVisible('tax') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Tax</th>}
                  {isColVisible('address') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Address</th>}
                  {isColVisible('balance') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Balance</th>}
                  {role !== 'Cashier' && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(customer.id)}
                        onChange={() => toggleRowSelection(customer.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    {isColVisible('group') && <td className="px-3 py-4 text-sm">{customer.group}</td>}
                    {isColVisible('name') && <td className="px-3 py-4 text-sm">{customer.name}</td>}
                    {isColVisible('company') && <td className="px-3 py-4 text-sm">{customer.company}</td>}
                    {isColVisible('email') && <td className="px-3 py-4 text-sm">{customer.email || 'N/A'}</td>}
                    {isColVisible('phone') && <td className="px-3 py-4 text-sm">{customer.phone}</td>}
                    {isColVisible('tax') && <td className="px-3 py-4 text-sm">{customer.tax || 'N/A'}</td>}
                    {isColVisible('address') && <td className="px-3 py-4 text-sm">{customer.address}</td>}
                    {isColVisible('balance') && <td className="px-3 py-4 text-sm">{customer.balance}</td>}
                    {role !== 'Cashier' && (
                      <td className="px-3 py-4 relative">
                        <button
                          onClick={() => setOpenActionId(prev => prev === customer.id ? null : customer.id)}
                          className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                        >
                          Action <ChevronDown className="w-4 h-4 inline ml-1" />
                        </button>
                        {openActionId === customer.id && (
                          <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                            <button
                              onClick={() => handleAction('View', customer.id)}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleAction('Edit', customer.id)}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAction('Delete', customer.id)}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredCustomers.length}</span> of{" "}
                <span className="font-medium">{filteredCustomers.length}</span> results
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
    )
}

export default CustomerList;