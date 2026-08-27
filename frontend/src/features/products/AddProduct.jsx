import React, { useState } from 'react';
import { ChevronDown, RefreshCw, HelpCircle } from 'lucide-react';
import DragDropImageUpload from '../../core/DragDropUpload';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../../components/common/CustomSelect';

// Variants from the Category component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const uniformVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(2px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function AddProductForm() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    productType: 'Standard',
    productName: '',
    productCode: '',
    barcode: 'Code 128',
    brand: '',
    category: '',
    productUnit: '',
    saleUnit: '',
    purchaseUnit: '',
    productCost: 0,
    productPrice: 0,
    alertQuantity: 0,
    productTax: 'No Tax',
    taxMethod: 'Exclusive',
    featured: false,
    description: '',
    hasWarehousePrice: false,
    warehousePrices: {},
    hasVariant: false,
    variantString: '',
    variantList: [],
    hasPromotion: false,
    promotionPrice: '',
    promotionStart: '',
    promotionEnd: '',
  });

  const brandOptions = ['Dell', 'Club Special', 'Mac', 'HP', 'Oppo', 'Vivo'];
  const categoryOptions = ['Electronics', 'Clothing', 'Food', 'Books'];
  const productUnitOptions = ['Kilogram', 'Per PC'];
  const salePurchaseUnitOptions = ['Piece', 'Kg', 'Liter', 'Meter'];
  const productTaxOptions = ['No Tax', '5%', '10%', '15%', '20%'];
  const barcodeOptions = ['Code 128', 'Code 39', 'EAN-13', 'UPC-A'];
  const productTypeOptions = ['Standard', 'Digital', 'Service'];
  const taxMethodOptions = ['Exclusive', 'Inclusive'];

  const [errors, setErrors] = useState({});

  const requiredFields = [
    'productName',
    'productCode',
    'barcode',
    'category',
    'productUnit',
    'purchaseUnit',
    'productCost',
    'productPrice',
    'productTax',
    'productType',
  ];

  const validateForm = () => {
    let newErrors = {};
    requiredFields.forEach((field) => {
      const value = formData[field];
      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        value === 0
      ) {
        newErrors[field] = 'This field is required.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        if (typeof formData[key] === 'object') {
          payload.append(key, JSON.stringify(formData[key]));
        } else {
          payload.append(key, formData[key]);
        }
      }
    }

    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw new Error('Network response was not ok');
      }

      alert('Product added successfully!');
      navigate('/product/list');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit form. Please try again.');
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (requiredFields.includes(name) && (!value || value.toString().trim() === '' || value === 'Nothing selected')) {
      setErrors((prev) => ({ ...prev, [name]: 'This field is required.' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      className="p-7"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit}>
        <motion.div
          className="mx-auto p-6 bg-white rounded-lg shadow-sm"
          variants={uniformVariants}
        >
          <motion.h1
            className="text-2xl font-semibold text-gray-900 mb-6"
            variants={uniformVariants}
          >
            Add Product
          </motion.h1>
          <motion.p
            className="text-sm text-gray-500 mb-6"
            variants={uniformVariants}
          >
            The field labels marked with <span className="text-red-500">*</span> are required input
            fields.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={gridVariants}
          >
            {/* Input fields with no individual motion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.productType}
                onChange={handleInputChange}
                options={productTypeOptions}
                name="productType"
                placeholder="Select Product Type..."
                hasError={!!errors.productType}
              />
              {errors.productType && <p className="text-red-500 text-sm mt-1">{errors.productType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.productName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Code <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.productCode}
                  onChange={(e) => handleInputChange('productCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
             
              </div>
              {errors.productCode && <p className="text-red-500 text-sm mt-1">{errors.productCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode Symbology <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.barcode}
                onChange={handleInputChange}
                options={barcodeOptions}
                name="barcode"
                placeholder="Select Barcode..."
                hasError={!!errors.barcode}
              />
              {errors.barcode && <p className="text-red-500 text-sm mt-1">{errors.barcode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <CustomSelect
                value={formData.brand}
                onChange={handleInputChange}
                options={brandOptions}
                placeholder="Select Brand..."
                name="brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.category}
                onChange={handleInputChange}
                options={categoryOptions}
                placeholder="Select Category..."
                name="category"
                hasError={!!errors.category}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Unit <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.productUnit}
                onChange={handleInputChange}
                options={productUnitOptions}
                placeholder="Select Product Unit..."
                name="productUnit"
                hasError={!!errors.productUnit}
              />
              {errors.productUnit && <p className="text-red-500 text-sm mt-1">{errors.productUnit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale Unit</label>
              <CustomSelect
                value={formData.saleUnit}
                onChange={handleInputChange}
                options={salePurchaseUnitOptions}
                name="saleUnit"
                placeholder="Select Sale Unit..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Unit <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.purchaseUnit}
                onChange={handleInputChange}
                options={salePurchaseUnitOptions}
                name="purchaseUnit"
                placeholder="Select Purchase Unit..."
                hasError={!!errors.purchaseUnit}
              />
              {errors.purchaseUnit && <p className="text-red-500 text-sm mt-1">{errors.purchaseUnit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Cost <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.productCost}
                onChange={(e) => handleInputChange('productCost', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.productCost ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.productCost && <p className="text-red-500 text-sm mt-1">{errors.productCost}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.productPrice}
                onChange={(e) => handleInputChange('productPrice', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.productPrice ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.productPrice && <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert Quantity</label>
              <input
                type="number"
                value={formData.alertQuantity}
                onChange={(e) => handleInputChange('alertQuantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Tax <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.productTax}
                onChange={handleInputChange}
                options={productTaxOptions}
                name="productTax"
                hasError={!!errors.productTax}
              />
              {errors.productTax && <p className="text-red-500 text-sm mt-1">{errors.productTax}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 md:flex items-center">
                Tax Method
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
              </label>
              <CustomSelect
                value={formData.taxMethod}
                onChange={handleInputChange}
                options={taxMethodOptions}
                name="taxMethod"
              />
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="featured"
                  checked={!!formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured
                  </label>
                  <p className="text-sm text-gray-500 italic">
                    Featured product will be displayed in POS
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={uniformVariants}>
            <DragDropImageUpload value={imageFile} onChange={(file) => setImageFile(file)} />
          </motion.div>

          <motion.div className="mt-6" variants={uniformVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description..."
            />
          </motion.div>

          <motion.div variants={uniformVariants}>
            <div className="space-y-6 mt-10">
              <motion.div variants={uniformVariants}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasWarehousePrice}
                    onChange={(e) => handleInputChange('hasWarehousePrice', e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <span className="font-semibold text-gray-700">
                    This product has a different price for different warehouses
                  </span>
                </label>

                {formData.hasWarehousePrice && (
                  <motion.div
                    className="mt-4 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <label className="text-gray-700">Excel Communication</label>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={formData.warehousePrices?.['Excel Communication'] || ''}
                        onChange={(e) => {
                          const updatedPrices = {
                            ...formData.warehousePrices,
                            ['Excel Communication']: e.target.value,
                          };
                          handleInputChange('warehousePrices', updatedPrices);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 w-full"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={uniformVariants}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasVariant}
                    onChange={(e) => handleInputChange('hasVariant', e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <span className="font-semibold text-gray-700">This product has a variant</span>
                </label>

                {formData.hasVariant && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="text"
                      placeholder="Enter variant separated by a comma (e.g., Red, Blue, Green)"
                      value={formData.variantString}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('variantString', value);
                        handleInputChange(
                          'variantList',
                          value.split(',').map((v) => v.trim()).filter(Boolean)
                        );
                      }}
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                    {formData.variantList?.length > 0 && (
                      <motion.div
                        className="mt-4 overflow-x-auto"
                        initial={{ opacity: 0, scaleY: 0.8 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <table className="w-full text-sm border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="p-2 border">Name</th>
                              <th className="p-2 border">Item Code</th>
                              <th className="p-2 border">Additional Price</th>
                              <th className="p-2 border"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.variantList.map((variant, index) => (
                              <motion.tr key={index} className="text-center" variants={itemVariants}>
                                <td className="p-2 border">{variant}</td>
                                <td className="p-2 border">VRT-{index + 1}</td>
                                <td className="p-2 border">0.00</td>
                                <td className="p-2 border">
                                  <motion.button
                                    type="button"
                                    onClick={() => {
                                      const updatedList = [...formData.variantList];
                                      updatedList.splice(index, 1);
                                      handleInputChange('variantList', updatedList);
                                      handleInputChange('variantString', updatedList.join(', '));
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    🗑️
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={uniformVariants}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasPromotion}
                    onChange={(e) => handleInputChange('hasPromotion', e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <span className="font-semibold text-gray-700">Add Promotional Price</span>
                </label>

                {formData.hasPromotion && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <input
                      type="number"
                      placeholder="Promotional Price"
                      value={formData.promotionPrice || ''}
                      onChange={(e) => handleInputChange('promotionPrice', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input
                      type="date"
                      value={formData.promotionStart || ''}
                      onChange={(e) => handleInputChange('promotionStart', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input
                      type="date"
                      value={formData.promotionEnd || ''}
                      onChange={(e) => handleInputChange('promotionEnd', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="mt-4" variants={uniformVariants}>
            <motion.button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
}