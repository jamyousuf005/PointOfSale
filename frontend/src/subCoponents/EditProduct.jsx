import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, RefreshCw, HelpCircle } from 'lucide-react';
import DragDropImageUpload from '../components/DragDropUpload';
import { useNavigate, useParams } from 'react-router-dom';
import { ContextApi } from '../components/ContextApi';
import { motion } from 'framer-motion';

// Define the animation variants for the outer container.
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

// Define animation variants for the inner content.
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


export default function EditProduct() {
  const [formData, setFormData] = useState({
    productType: 'Standard',
    productName: '',
    productCode: '',
    barcode: 'Code 128',
    brand: '',
    category: '',
    productUnit: '',
    saleUnit: 'Nothing selected',
    purchaseUnit: 'Nothing selected',
    productCost: '',
    productPrice: '',
    alertQuantity: '',
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

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(err => console.error("Error fetching product:", err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      setFormData(data)
      console.log(formData)
    } catch (err) {
      console.error('Error:', err);
    }

    const requiredFields = [
      'productName',
      'productCode',
      'category',
      'productUnit',
      'productCost',
      'productPrice',
    ];

    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required.';
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    }
    navigate('/product/list')



    // setFormData({
    //   productType: 'Standard',
    //   productName: '',
    //   productCode: '',
    //   barcode: 'Code 128',
    //   brand: '',
    //   category: '',
    //   productUnit: '',
    //   saleUnit: 'Nothing selected',
    //   purchaseUnit: 'Nothing selected',
    //   productCost: '',
    //   productPrice: '',
    //   alertQuantity: '',
    //   productTax: 'No Tax',
    //   taxMethod: 'Exclusive',
    //   featured: false,
    //   hasWarehousePrice: false,
    //   warehousePrices: {},
    //   hasVariant: false,
    //   variantString: '',
    //   variantList: [],
    //   hasPromotion: false,
    //   promotionPrice: '',
    //   promotionStart: '',
    //   promotionEnd: '',
    //   description: ''
    // });

    setErrors({});
    alert('Form submitted!');


  };


  const validateField = (name, value) => {
    const requiredFields = ['productName', 'productCode', 'category', 'productUnit', 'productCost', 'productPrice'];
    if (requiredFields.includes(name) && (!value || value.trim() === '')) {
      setErrors(prev => ({ ...prev, [name]: 'This field is required.' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const CustomSelect = ({ value, onChange, options, placeholder, name, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasError = errors[name];


    const brandData = [
      { id: 1, name: 'Dell', hasImage: true },
      { id: 2, name: 'Club Special', image: null, hasImage: false },
      { id: 3, name: 'Mac', image: null, hasImage: true },
      { id: 4, name: 'HP', image: null, hasImage: true },
      { id: 5, name: 'Oppo', image: null, hasImage: true },
      { id: 6, name: 'Vivo', image: null, hasImage: true },
    ];


    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 text-left bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${hasError ? 'border-red-500' : 'border-gray-300'
            }`}
        >
          <span className={value === placeholder || !value ? 'text-gray-400' : 'text-gray-900'}>
            {value || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(name, option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    // Apply the container variants to the outermost div
    <motion.div 
      className='p-7 '
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit}>
        {/* Apply the uniform variants to the main content div */}
        <motion.div 
          className="mx-auto p-6 bg-white rounded-lg shadow-sm"
          variants={uniformVariants}
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Product</h1>

          <p className="text-sm text-gray-500 mb-6">
            The field labels marked with <span className="text-red-500">*</span> are required input fields.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.productType}
                onChange={handleInputChange}
                options={['Standard', 'Digital', 'Service']}
                name="productType"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productName ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
              )}
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
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none"
                >
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              {errors.productCode && (
                <p className="text-red-500 text-sm mt-1">{errors.productCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode Symbology <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.barcode}
                onChange={handleInputChange}
                options={['Code 128', 'Code 39', 'EAN-13', 'UPC-A']}
                name="barcode"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <CustomSelect
                value={formData.brand}
                onChange={handleInputChange}
                options={['Dell', 'Club Special', 'Mac', 'Hp', 'Oppo', 'Vivo']}
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
                options={['Electronics', 'Clothing', 'Food', 'Books']}
                placeholder="Select Category..."
                name="category"
                required
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Unit <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.productUnit}
                onChange={handleInputChange}
                options={['Kilogram', 'Per PC']}
                placeholder="Select Product Unit..."
                name="productUnit"
                required
              />
              {errors.productUnit && (
                <p className="text-red-500 text-sm mt-1">{errors.productUnit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale Unit</label>
              <CustomSelect
                value={formData.saleUnit}
                onChange={handleInputChange}
                options={['Piece', 'Kg', 'Liter', 'Meter']}
                name="saleUnit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Unit</label>
              <CustomSelect
                value={formData.purchaseUnit}
                onChange={handleInputChange}
                options={['Piece', 'Kg', 'Liter', 'Meter']}
                name="purchaseUnit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Cost <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.productCost}
                onChange={(e) => handleInputChange('productCost', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productCost ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.productCost && (
                <p className="text-red-500 text-sm mt-1">{errors.productCost}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.productPrice}
                onChange={(e) => handleInputChange('productPrice', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.productPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>
              )}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Tax</label>
              <CustomSelect
                value={formData.productTax}
                onChange={handleInputChange}
                options={['No Tax', '5%', '10%', '15%', '20%']}
                name="productTax"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 md:flex items-center">
                Tax Method
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
              </label>
              <CustomSelect
                value={formData.taxMethod}
                onChange={handleInputChange}
                options={['Exclusive', 'Inclusive']}
                name="taxMethod"
              />
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
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
          </div>

          <div> <DragDropImageUpload /> </div>

          <div className='mt-6'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description..."
            />
          </div>

          <div>
            {/* --- Extended Product Options --- */}
            <div className="space-y-6 mt-10">
              {/* Warehouse Pricing */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasWarehousePrice}
                    onChange={(e) =>
                      handleInputChange('hasWarehousePrice', e.target.checked)
                    }
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <span className="font-semibold text-gray-700">
                    This product has different price for different warehouse
                  </span>
                </label>

                {formData.hasWarehousePrice && (
                  <div className="mt-4 space-y-4">
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
                  </div>
                )}
              </div>

              {/* Variants */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasVariant}
                    onChange={(e) =>
                      handleInputChange('hasVariant', e.target.checked)
                    }
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <span className="font-semibold text-gray-700">
                    This product has variant
                  </span>
                </label>

                {formData.hasVariant && (
                  <>
                    <input
                      type="text"
                      placeholder="Enter variant separated by comma"
                      value={formData.variantString}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('variantString', value);
                        handleInputChange('variantList', value.split(',').map(v => v.trim()).filter(Boolean));
                      }}
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                    {formData.variantList?.length > 0 && (
                      <div className="mt-4 overflow-x-auto">
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
                              <tr key={index} className="text-center">
                                <td className="p-2 border">{variant}</td>
                                <td className="p-2 border">VRT-{index + 1}</td>
                                <td className="p-2 border">0.00</td>
                                <td className="p-2 border">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedList = [...formData.variantList];
                                      updatedList.splice(index, 1);
                                      handleInputChange('variantList', updatedList);
                                      handleInputChange('variantString', updatedList.join(', '));
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Promotional Price */}
              <div>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className='mt-4'>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
            >
              Submit
            </button>
          </div>
        </motion.div>


      </form>
    </motion.div>
  );
}