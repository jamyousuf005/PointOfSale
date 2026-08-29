import React, { useState, useEffect } from 'react';
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

const CategoryModal = ({ isOpen, onClose, onSave, editingCategory }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    parentCategory: 'N/A',
    image: null,
    productCount: 0,
    stockQty: 0,
    stockWorthPrice: 0,
    stockWorthCost: 0,
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryName: editingCategory.categoryName || '',
        parentCategory: editingCategory.parentCategory || 'N/A',
        image: null,
        productCount: editingCategory.productCount || 0,
        stockQty: editingCategory.stockQty || 0,
        stockWorthPrice: editingCategory.stockWorthPrice || 0,
        stockWorthCost: editingCategory.stockWorthCost || 0,
      });
    } else {
      setFormData({
        categoryName: '',
        parentCategory: 'N/A',
        image: null,
        productCount: 0,
        stockQty: 0,
        stockWorthPrice: 0,
        stockWorthCost: 0,
      });
    }
  }, [editingCategory, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingCategory ? editingCategory.id : null);
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
          <h2 className="text-xl font-semibold mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name *</label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Category</label>
              <input
                type="text"
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700"># Products</label>
                <input
                  type="number"
                  name="productCount"
                  value={formData.productCount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Qty</label>
                <input
                  type="number"
                  name="stockQty"
                  value={formData.stockQty}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Worth Price (PKR)</label>
                <input
                  type="number"
                  name="stockWorthPrice"
                  value={formData.stockWorthPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Worth Cost (PKR)</label>
                <input
                  type="number"
                  name="stockWorthCost"
                  value={formData.stockWorthCost}
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
                {editingCategory ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'image', label: 'Image', visible: true },
    { key: 'categoryName', label: 'Category', visible: true },
    { key: 'parentCategory', label: 'Parent Category', visible: true },
    { key: 'productCount', label: '# Products', visible: true },
    { key: 'stockQty', label: 'Stock Qty', visible: true },
    { key: 'stockWorth', label: 'Worth (Price / Cost)', visible: true },
  ]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredCategories = categories.filter(cat =>
    (cat.categoryName && cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cat.parentCategory && cat.parentCategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev =>
      prev.length === filteredCategories.length ? [] : filteredCategories.map(c => c.id)
    );
  };

  const handleDelete = async (rowId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/categories/${rowId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          setCategories((prev) => prev.filter((c) => c.id !== rowId));
        }
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} category(ies)?`)) {
      for (const id of selectedRows) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setCategories((prev) => prev.filter((c) => !selectedRows.includes(c.id)));
      setSelectedRows([]);
    }
  };

  const handleSaveCategory = async (formData, editId) => {
    const data = new FormData();
    data.append('categoryName', formData.categoryName);
    data.append('parentCategory', formData.parentCategory);
    data.append('productCount', formData.productCount);
    data.append('stockQty', formData.stockQty);
    data.append('stockWorthPrice', formData.stockWorthPrice);
    data.append('stockWorthCost', formData.stockWorthCost);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const url = editId 
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/categories/${editId}` 
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/categories`;
      
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });

      if (res.ok) {
        fetchCategories();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible !== false : true;
  };

  return (
    <motion.div 
      className='p-6 bg-gray-100 min-h-screen'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="w-full bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Category List"
          addLabel="+ Add Category"
          onAdd={() => { setEditingCategory(null); setIsModalOpen(true); }}
          extraButtons={[
            {
              label: '📁 Import Category',
              onClick: () => alert('Import Category clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search category..."
          data={filteredCategories}
          exportFilename="Category_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table */}
        <div className="bg-white shadow-sm overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredCategories.length && filteredCategories.length > 0}
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  {isColVisible('image') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Image</th>}
                  {isColVisible('categoryName') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Category</th>}
                  {isColVisible('parentCategory') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Parent Category</th>}
                  {isColVisible('productCount') && <th className="px-3 py-4 text-left font-semibold text-gray-700"># Products</th>}
                  {isColVisible('stockQty') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Stock Qty</th>}
                  {isColVisible('stockWorth') && <th className="px-3 py-4 text-left font-semibold text-gray-700">Worth (Price / Cost)</th>}
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(cat.id)}
                        onChange={() => toggleRowSelection(cat.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    {isColVisible('image') && (
                      <td className="px-3 py-4">
                        {cat.image ? (
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/uploads/${cat.image}`}
                            alt={cat.categoryName}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                            No Img
                          </div>
                        )}
                      </td>
                    )}
                    {isColVisible('categoryName') && <td className="px-3 py-4 text-sm font-medium text-gray-900">{cat.categoryName}</td>}
                    {isColVisible('parentCategory') && <td className="px-3 py-4 text-sm text-gray-600">{cat.parentCategory}</td>}
                    {isColVisible('productCount') && <td className="px-3 py-4 text-sm text-gray-600">{cat.productCount}</td>}
                    {isColVisible('stockQty') && <td className="px-3 py-4 text-sm text-gray-600">{cat.stockQty}</td>}
                    {isColVisible('stockWorth') && (
                      <td className="px-3 py-4 text-sm text-gray-600">
                        <span className="block">PKR {(cat.stockWorthPrice || 0).toLocaleString()}</span>
                        <span className="block text-gray-400 text-xs">/ PKR {(cat.stockWorthCost || 0).toLocaleString()}</span>
                      </td>
                    )}
                    <td className="px-3 py-4 relative">
                      <button
                        onClick={() => setOpenActionId(prev => (prev === cat.id ? null : cat.id))}
                        className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                      >
                        Action
                      </button>
                      {openActionId === cat.id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                          <button
                            onClick={() => { setEditingCategory(cat); setIsModalOpen(true); setOpenActionId(null); }}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No categories found matching your search.
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredCategories.length > 0 ? 1 : 0}</span> to{' '}
                <span className="font-medium">{filteredCategories.length}</span> of{' '}
                <span className="font-medium">{filteredCategories.length}</span> results
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
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />
    </motion.div>
  );
};

export default Category;