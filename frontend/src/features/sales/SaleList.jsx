import React, { useContext, useState, useEffect } from 'react';
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

const SaleList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'createdAt', label: 'Date', visible: true },
    { key: '_id', label: 'Reference', visible: true },
    { key: 'biller', label: 'Biller', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'saleStatus', label: 'Sale Status', visible: true },
    { key: 'paymentStatus', label: 'Payment Status', visible: true },
    { key: 'grandTotal', label: 'Grand Total', visible: true },
    { key: 'paid', label: 'Paid', visible: true },
    { key: 'due', label: 'Due', visible: true },
  ]);

  const { products, sales, setSales } = useContext(ContextApi);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((res) => res.json())
    .then((data) => setSales(data || []))
    .catch((err) => console.error(err));
  }, [setSales]);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredSales = (sales || []).filter(sale =>
    (sale._id && sale._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sale.customer && sale.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sale.biller && sale.biller.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev =>
      prev.length === filteredSales.length ? [] : filteredSales.map(s => s._id)
    );
  };

  const handleEdit = (action, rowId) => {
    if (action === 'Edit') {
      navigate(`/sale/edit/${rowId}`);
    }
  };

  const handleDelete = async (action, rowId) => {
    if (action === 'Delete') {
      const confirmDelete = window.confirm("Are you sure you want to delete this sale?");
      if (!confirmDelete) return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/${rowId}`, {
        method: "DELETE",
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setSales((prev) => prev.filter(p => p._id !== rowId));
      }
    } catch (err) {
      console.error(err);
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected sale(s)?`)) return;
    for (const id of selectedRows) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
    setSales((prev) => prev.filter(s => !selectedRows.includes(s._id)));
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
          title="Sale List"
          addLabel="+ Add Sale"
          onAdd={() => navigate('/sale/add')}
          extraButtons={[
            {
              label: '📁 Import Sale',
              onClick: () => alert('Import Sale clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search sales..."
          data={filteredSales}
          exportFilename="Sales_List"
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
                      checked={selectedRows.length === filteredSales.length && filteredSales.length > 0}
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  {isColVisible('createdAt') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Date</th>}
                  {isColVisible('_id') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Reference</th>}
                  {isColVisible('biller') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Biller</th>}
                  {isColVisible('customer') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Customer</th>}
                  {isColVisible('saleStatus') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Sale Status</th>}
                  {isColVisible('paymentStatus') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Payment Status</th>}
                  {isColVisible('grandTotal') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Grand Total</th>}
                  {isColVisible('paid') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Paid</th>}
                  {isColVisible('due') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Due</th>}
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.map((sale) => {
                  const grandTotal = (sale.products || []).reduce((acc, product) => acc + (Number(product.subTotal) || 0), 0);
                  return (
                    <tr key={sale._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(sale._id)}
                          onChange={() => toggleRowSelection(sale._id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </td>
                      {isColVisible('createdAt') && <td className="px-3 py-4 text-sm">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}</td>}
                      {isColVisible('_id') && <td className="px-3 py-4 text-sm">{sale._id}</td>}
                      {isColVisible('biller') && <td className="px-3 py-4 text-sm">{sale.biller}</td>}
                      {isColVisible('customer') && <td className="px-3 py-4 text-sm">{sale.customer}</td>}
                      {isColVisible('saleStatus') && (
                        <td className="px-3 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {sale.saleStatus}
                          </span>
                        </td>
                      )}
                      {isColVisible('paymentStatus') && (
                        <td className="px-3 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {sale.paymentStatus}
                          </span>
                        </td>
                      )}
                      {isColVisible('grandTotal') && <td className="px-3 py-4 text-sm font-medium text-gray-900">${grandTotal}</td>}
                      {isColVisible('paid') && <td className="px-3 py-4 text-sm text-gray-600">${sale.paid}</td>}
                      {isColVisible('due') && <td className="px-3 py-4 text-sm text-gray-600">${sale.due}</td>}
                    <td className="px-3 py-4 relative">
                      <button
                        onClick={() => setOpenActionId(prev => (prev === sale._id ? null : sale._id))}
                        className="px-3 w-22 flex items-center py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                      >
                        Action <ChevronDown className="w-4 h-4 inline ml-1" />
                      </button>
                      {openActionId === sale._id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                          <button
                            onClick={()=>handleEdit('Edit',sale._id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('Delete', sale._id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredSales.length}</span> of <span className="font-medium">{filteredSales.length}</span> results
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

export default SaleList;