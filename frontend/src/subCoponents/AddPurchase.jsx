import { useContext, useState } from 'react';
import { ChevronDown, Trash2} from 'lucide-react';
import { ContextApi } from '../components/ContextApi';
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

const AddPurchase = () => {
  const [formData, setFormData] = useState({
    warehouse: '',
    supplier: '',
    purchaseStatus: 'Received',
    orderTax: 0,
    discount: 0,
    shippingCost:0,
    note: '',
  });

  const { products, setProducts, customers } = useContext(ContextApi);
  const [productSearch, setProductSearch] = useState('');

  const warehouses = ['Main Warehouse', 'Secondary Warehouse', 'Backup Warehouse'];

  const taxOptions = [
    { label: 'No Tax', value: 0 },
    { label: 'VAT 5%', value: 5 },
    { label: 'VAT 10%', value: 10 },
    { label: 'VAT 15%', value: 15 },
  ];

  const handleInputChange = (field, value) => {
    const numericFields=['orderTax','discount','shippingCost'];
    const processedValue  = numericFields.includes(field) ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const addProduct = (product) => {
    const quantity = parseFloat(product.alertQuantity) || 1;
    const cost = parseFloat(product.productCost) || 0;
    const discount = parseFloat(product.discount) || 0;
    const tax = parseFloat(product.productTax) || 0;

    const subTotal = quantity * cost * (1 - discount / 100) + tax;

    setProducts(prev => [...prev, { ...product, subTotal }]);
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const calculateTotal = () => {
    const productTotal = products.reduce((sum, product) => sum + (parseFloat(product.subTotal) || 0), 0);
    const shippingCost = parseFloat(formData.shippingCost) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return productTotal + shippingCost - discount;
  };

  const handleSubmit = async () => {
    if (!formData.warehouse) {
      alert('Please select a warehouse');
      return;
    }

    const submissionData = {
      ...formData,
      products,
      total: calculateTotal()
    };
    console.log('Form submitted:', submissionData);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase`, {
        method: 'POST',
        headers: { 
          'Content-type': 'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body : JSON.stringify(submissionData)
      });

      const data = await res.json();

    } catch (err) {
      console.log(err);
    }

    alert('Purchase order submitted successfully!');
  };

  return (
    <motion.div 
      className='p-6'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="p-6 bg-white rounded-lg shadow-sm"
        variants={uniformVariants}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add Purchase</h1>

        <div className="space-y-6">
          <p className="text-sm text-gray-500 italic">
            The field labels marked with * are required input fields.
          </p>

          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.warehouse}
                  onChange={(e) => handleInputChange('warehouse', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select warehouse...</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse} value={warehouse}>{warehouse}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <div className="relative">
                <select
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">Select supplier...</option>
                  {customers.map(cus => (
                    <option key={cus.id} value={cus.name}>{cus.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Status
              </label>
              <div className="relative">
                <select
                  value={formData.purchaseStatus}
                  onChange={(e) => handleInputChange('purchaseStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="Received">Received</option>
                  <option value="Pending">Pending</option>
                  <option value="Ordered">Ordered</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <div className="md:flex flex-wrap items-center space-x-2">
              
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Please type product code and select..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => {
                  const foundProduct = products.find(p =>
                    p.productName.toLowerCase().includes(productSearch.toLocaleLowerCase())
                  );
                  if (foundProduct) {
                    addProduct(foundProduct);
                    setProductSearch('');
                  }
                }}
                type="button"
                className="px-4 py-2 md:m-t0 mt-2 bg-purple-500 font-bold text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </div>

          {/* Order Table */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Table <span className="text-red-500">*</span>
            </label>
            <div className="overflow-x-auto border border-gray-300 rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Net Unit Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Discount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tax</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SubTotal</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(products||[]).filter((product) => {
                    return productSearch.trim() !== '' && product.productName.toLowerCase().includes(productSearch.toLowerCase());
                  }).map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-3">
                        <span className="block px-2 py-1 text-gray-900">{product.productName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="block px-2 py-1 text-gray-900">{product.productCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="block px-2 py-1 text-gray-900">{product.alertQuantity}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="block px-2 py-1 text-gray-900">{product.productCost}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="block px-2 py-1 text-gray-900">{product.discount}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="block px-2 py-1 text-gray-900">{product.productTax}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {product.subTotal ? product.subTotal.toFixed(2) : '0.00'}
                        </span>
                      </td>
                      <td className="px-2">
                        <div onClick={removeProduct} className='flex gap-1 py-1 justify-center rounded items-center bg-red-400'>
                          <button> Delete </button>
                          <span> <Trash2 className="w-4 h-4" /></span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-gray-50 font-medium">
                    <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {products.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0)}
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {products.reduce((sum, p) => sum + (parseFloat(p.discount) || 0), 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {products.reduce((sum, p) => sum + (parseFloat(p.tax) || 0), 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {products.reduce((sum, p) => sum + (parseFloat(p.subTotal) || 0), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Tax
              </label>
              <div className="relative">
                <select
                  value={formData.orderTax}
                  onChange={(e) => handleInputChange('orderTax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  {taxOptions.map(tax => (
                    <option key={tax.label} value={tax.value}>{tax.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Cost
              </label>
              <input
                type="number"
                value={formData.shippingCost}
                onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any additional notes..."
            />
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-900">
                Grand Total: ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddPurchase; 