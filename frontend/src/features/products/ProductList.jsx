import React, { useState, useContext, useEffect } from 'react';
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

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null); 
  
  const [columns, setColumns] = useState([
    { key: 'image', label: 'Image', visible: true },
    { key: 'productName', label: 'Name', visible: true },
    { key: 'productCode', label: 'Code', visible: true },
    { key: 'brand', label: 'Brand', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'alertQuantity', label: 'Quantity', visible: true },
    { key: 'productUnit', label: 'Unit', visible: true },
    { key: 'productPrice', label: 'Price', visible: true },
  ]);

  const {products, setProducts} = useContext(ContextApi);
  const navigate = useNavigate();

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

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product =>
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
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
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
      }
    } catch (err) {
      console.error("Network or other error:", err);
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected product(s)?`)) return;
    for (const id of selectedRows) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
    setProducts((prev) => prev.filter(p => !selectedRows.includes(p._id)));
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
          title="Product List"
          addLabel="+ Add Product"
          onAdd={() => navigate('/product/add')}
          extraButtons={[
            {
              label: '📁 Import Product',
              onClick: () => alert('Import feature clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search products..."
          data={filteredProducts}
          exportFilename="Products_List"
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
                      checked={selectedRows.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  {isColVisible('image') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Image</th>}
                  {isColVisible('productName') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Name</th>}
                  {isColVisible('productCode') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Code</th>}
                  {isColVisible('brand') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Brand</th>}
                  {isColVisible('category') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Category</th>}
                  {isColVisible('alertQuantity') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Quantity</th>}
                  {isColVisible('productUnit') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Unit</th>}
                  {isColVisible('productPrice') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Price</th>}
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
                    {isColVisible('image') && (
                      <td className="px-3 py-4">
                        {product.image ? (
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/uploads/${product.image}`}
                            alt={product.productName}
                            className="w-12 h-12 object-cover rounded-md border shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-400 font-medium">
                            No Img
                          </div>
                        )}
                      </td>
                    )}
                    {isColVisible('productName') && <td className="px-3 py-4 text-sm font-medium text-gray-900">{product.productName}</td>}
                    {isColVisible('productCode') && <td className="px-3 py-4 text-sm text-gray-600">{product.productCode}</td>}
                    {isColVisible('brand') && <td className="px-3 py-4 text-sm text-gray-600">{product.brand}</td>}
                    {isColVisible('category') && <td className="px-3 py-4 text-sm text-gray-600">{product.category}</td>}
                    {isColVisible('alertQuantity') && (
                      <td className="px-3 py-4 text-sm text-gray-600">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.alertQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.alertQuantity}
                        </span>
                      </td>
                    )}
                    {isColVisible('productUnit') && <td className="px-3 py-4 text-sm text-gray-600">{product.productUnit}</td>}
                    {isColVisible('productPrice') && (
                      <td className="px-3 py-4 text-sm font-medium text-gray-900">
                        ${parseFloat(product.productPrice || 0).toLocaleString()}
                      </td>
                    )}
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