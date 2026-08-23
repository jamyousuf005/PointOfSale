import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../../core/ContextApi';
import { motion } from 'framer-motion';

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

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null); 
  
  const {products,setProducts}=useContext(ContextApi)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.error('Error fetching products:', err));
  }, [setProducts]);

  const navigate = useNavigate()

  const filteredProducts = products.filter(product =>
    (product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.productCode?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev =>
      prev.length === filteredProducts.length ? [] : filteredProducts.map(p => p._id)
    );
  };
  
  const handleEdit = (action, rowId) => {
    if (action === 'Edit') {
      navigate(`/product/edit/${rowId}`);
    }
  };

  const handleDelete = async (action, rowId) => {
    if (action === 'Delete') {
      const confirmDelete = window.confirm("Are you sure you want to delete this product");
      if (!confirmDelete) return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${rowId}`, {
        method: "DELETE",
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setProducts((prev) => prev.filter(p => p._id !== rowId));
      } else {
        console.error('Failed to delete product:', res.status, res.statusText);
        const errorData = await res.json();
        console.error("Server error message:", errorData.msg);
      }
    } catch (err) {
      console.error("Network or other error:", err);
    }
    setOpenActionId(null);
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
        <motion.div className="sm:p-4" variants={uniformVariants}>
          {/* Top Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => navigate('/product/add')} className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base">
              + Add Product
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1">
              📁 Import Product
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
                placeholder="Search products..."
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
        </motion.div>

        <div className="bg-white shadow-md overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Image</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Brand</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Quantity</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Unit</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Price</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(product._id)}
                        onChange={() => toggleRowSelection(product._id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-3 py-4">
                      {/* <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded"
                    /> */}
                    </td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">{product.productName}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{product.productCode}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{product.brand}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.alertQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.alertQuantity}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">{product.productUnit}</td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">
                      ${parseFloat(product.productPrice).toLocaleString()}
                    </td>
                    <td className="px-3 py-4 relative">
                      <button
                        onClick={() => setOpenActionId(prev => (prev === product._id ? null : product._id))}
                        className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                      >
                        Action
                      </button>
                      {openActionId === product._id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                          <button
                            onClick={() => handleEdit('Edit', product._id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('Delete', product._id)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found matching your search.
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredProducts.length}</span> of{' '}
                <span className="font-medium">{filteredProducts.length}</span> results
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

export default ProductList;