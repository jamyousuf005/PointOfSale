import React, { useContext, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../../core/ContextApi';
import { motion } from 'framer-motion';
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

const PurchaseList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'createdAt', label: 'Date', visible: true },
    { key: '_id', label: 'Reference', visible: true },
    { key: 'supplier', label: 'Supplier', visible: true },
    { key: 'purchaseStatus', label: 'Purchase Status', visible: true },
    { key: 'total', label: 'Grand Total', visible: true },
    { key: 'paid', label: 'Paid', visible: true },
    { key: 'due', label: 'Due', visible: true },
    { key: 'paymentStatus', label: 'Payment Status', visible: true },
  ]);

  const { purchases, setPurchases } = useContext(ContextApi);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((res) => res.json())
    .then((data) => setPurchases(data.showAllPurchases || []))
    .catch((err) => console.error('error fetching api', err));
  }, [setPurchases]);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredPurchases = (purchases || []).filter(purchase =>
    (purchase.supplier && purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (purchase.warehouse && purchase.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (purchase._id && purchase._id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev =>
      prev.length === filteredPurchases.length ? [] : filteredPurchases.map(p => p._id)
    );
  };

  const handleEdit = (action, rowId) => {
    if (action === 'Edit') {
      navigate(`/purchase/edit/${rowId}`);
    }
  };

  const handleDelete = async (action, rowId) => {
    if (action === 'Delete') {
      const confirmDelete = window.confirm("Are you sure you want to delete this purchase?");
      if (!confirmDelete) return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase/${rowId}`, {
        method: "DELETE",
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`      
        }
      });

      if (res.ok) {
        setPurchases((prev) => prev.filter(p => p._id !== rowId));
      }
    } catch (err) {
      console.error(err);
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected purchase(s)?`)) return;
    for (const id of selectedRows) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
    setPurchases((prev) => prev.filter(p => !selectedRows.includes(p._id)));
    setSelectedRows([]);
  };

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible !== false : true;
  };

  return (
    <motion.div
      className='p-6'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="w-full bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Purchase List"
          addLabel="+ Add Purchase"
          onAdd={() => navigate('/purchase/add')}
          extraButtons={[
            {
              label: '📁 Import Purchase',
              onClick: () => alert('Import Purchase clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search purchases..."
          data={filteredPurchases}
          exportFilename="Purchases_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />

        <div className="bg-white shadow-md overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredPurchases.length && filteredPurchases.length > 0}
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  {isColVisible('createdAt') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Date</th>}
                  {isColVisible('_id') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Reference</th>}
                  {isColVisible('supplier') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Supplier</th>}
                  {isColVisible('purchaseStatus') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Purchase Status</th>}
                  {isColVisible('total') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Grand Total</th>}
                  {isColVisible('paid') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Paid</th>}
                  {isColVisible('due') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Due</th>}
                  {isColVisible('paymentStatus') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Payment Status</th>}
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(purchase._id)}
                        onChange={() => toggleRowSelection(purchase._id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    {isColVisible('createdAt') && <td className="px-3 py-4 text-sm text-gray-900">{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'N/A'}</td>}
                    {isColVisible('_id') && <td className="px-3 py-4 text-sm text-gray-900">{purchase._id}</td>}
                    {isColVisible('supplier') && <td className="px-3 py-4 text-sm text-gray-900">{purchase.supplier}</td>}
                    {isColVisible('purchaseStatus') && (
                      <td className="px-3 py-4 text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {purchase.purchaseStatus}
                        </span>
                      </td>
                    )}
                    {isColVisible('total') && <td className="px-3 py-4 text-sm font-medium text-gray-900">${purchase.total}</td>}
                    {isColVisible('paid') && <td className="px-3 py-4 text-sm text-gray-600">${purchase.paid}</td>}
                    {isColVisible('due') && <td className="px-3 py-4 text-sm font-medium text-gray-900">${purchase.due}</td>}
                    {isColVisible('paymentStatus') && (
                      <td className="px-3 py-4 text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {purchase.paymentStatus}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-4 relative ">
                      <button
                        onClick={() => setOpenActionId(prev => (prev === purchase._id ? null : purchase._id))}
                        className="w-22 px-1 h-8 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                      >
                        Action <ChevronDown className="w-4 h-4 inline ml-1" />
                      </button>
                      {openActionId === purchase._id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleEdit('Edit', purchase._id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('Delete', purchase._id)}
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

          {filteredPurchases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No purchases found matching your search.
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredPurchases.length}</span> of{' '}
                <span className="font-medium">{filteredPurchases.length}</span> results
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

export default PurchaseList;