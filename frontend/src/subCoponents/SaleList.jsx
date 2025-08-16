import React, { useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../components/ContextApi';

const SaleList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

 const {products,sales,setSales}=useContext(ContextApi)

  const filteredSales = sales.filter(sale =>
    sale._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev =>
      prev.length === filteredSales.length ? [] : filteredSales.map(s => s.id)
    );
  };

  const handleEdit = (action,rowId)=>{
       if(action==='Edit'){
        navigate(`/sale/edit/${rowId}`)
       }
  }

const handleDelete = async (action, rowId) => {
    if (action === 'Delete') {
      const confirmDelete = window.confirm("Are you sure you want to delete this purchase")
      if (!confirmDelete) return;
    }
    try {
      const res = await fetch(`http://localhost:8001/api/sales/${rowId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSales((prev) => prev.filter(p => p._id !== rowId))
        console.log("sale deleted")
      } else {
        console.log('failed to delete')
      }
    } catch (err) {
      console.log(err)
    }
    setOpenActionId(null)
  };

  const navigate = useNavigate()

  return (
    <div className='p-6'>
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        {/* Header Controls */}
        <div className="sm:p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
            onClick={()=>navigate('/sale/add')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base">
              + Add Sale
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1">
              📁 Import Sale
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex items-center gap-2">
              <select
                className="border border-purple-300 text-purple-700 rounded-md px-2 py-1 text-sm"
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(e.target.value)}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-gray-600 text-sm">records per page</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 ring-purple-300"
                placeholder="Search sales..."
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button className="bg-rose-400 hover:bg-rose-500 text-white px-2 sm:px-3 py-1 rounded-md text-sm">PDF</button>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-md text-sm">CSV</button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-md text-sm">Print</button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md text-sm">Delete</button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-md text-sm">Column Visibility</button>
            </div>
          </div>
        </div>

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
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Date</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Reference</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Biller</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Customer</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Sale Status</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Payment Status</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Grand Total</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Paid</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Due</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              

                {filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(sale._id)}
                        onChange={() => toggleRowSelection(sale._id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-3 py-4 text-sm">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-3 py-4 text-sm">{sale._id}</td>
                    <td className="px-3 py-4 text-sm">{sale.biller}</td>
                    <td className="px-3 py-4 text-sm">{sale.customer}</td>
                    <td className="px-3 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {sale.saleStatus}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">{sale.products.reduce((acc, product) => acc + product.subTotal, 0)}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{sale.paid}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{sale.due}</td>
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
                ))}

               
                
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
      </div>
    </div>
  );
};

export default SaleList;
