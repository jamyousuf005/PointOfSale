import React, { useState } from "react";

const AddCustomer= () => {
  const [customerData, setCustomerData] = useState({
    customerGroup: "Regular Customer",
    name: "",
    companyName: "",
    email: "",
    phone: "",
    taxNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addUser: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Customer Data Submitted:", customerData);
    // Add your form handling logic here
  };

  return (
    <div className="p-6">
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Add Customer</h2>
      <p className="text-sm italic text-gray-500 mb-6">
        The field labels marked with * are required input fields.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Group */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Customer Group *
          </label>
          <select
            name="customerGroup"
            value={customerData.customerGroup}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option>Regular Customer</option>
            <option>Premium Customer</option>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            value={customerData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={customerData.companyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            value={customerData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={customerData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Tax Number */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Tax Number</label>
          <input
            type="text"
            name="taxNumber"
            value={customerData.taxNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Address *</label>
          <input
            type="text"
            name="address"
            value={customerData.address}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">City *</label>
          <input
            type="text"
            name="city"
            value={customerData.city}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* State */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            name="state"
            value={customerData.state}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={customerData.postalCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={customerData.country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Add User Checkbox */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="addUser"
            checked={customerData.addUser}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">Add User</label>
        </div>
      </form>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        className="mt-6 bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition"
      >
        Submit
      </button>
    </div>
    </div>
  );
};

export default AddCustomer;
