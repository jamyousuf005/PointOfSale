import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const customers = [
  {
    id: 1,
    group: "Regular Customer",
    name: "Kamal udin Memon",
    company: "Teacher",
    email: "",
    phone: "03133006400",
    tax: "",
    address: "Badurabad Colony Dadu, Dadu ,Pakistan",
    balance: "0.00",
  },
  {
    id: 2,
    group: "Regular Customer",
    name: "Farhan Mallah",
    company: "ELDC Dadu",
    email: "",
    phone: "03103635188",
    tax: "0",
    address: "ELDC Dado Road Dadu, Dadu ,Pakistan",
    balance: "0.00",
  },
  {
    id: 3,
    group: "Regular Customer",
    name: "Muhammad Saleem Mangi",
    company: "advocate",
    email: "",
    phone: "03003238348",
    tax: "",
    address: "Wapda Colony Moro, Moro ,Pakistan",
    balance: "0.00",
  },
];

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState("10");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows((prev) =>
      prev.length === filteredCustomers.length ? [] : filteredCustomers.map((c) => c.id)
    );
  };

  const handleAction = (action, rowId) => {
    console.log(`${action} for row ${rowId}`);
    setOpenActionId(null);
  };

  return (
    <div className="p-6">
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        {/* Header Controls */}
        <div className="sm:p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-md text-sm sm:text-base">
              + Add Customer
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm sm:text-base">
              Import Customer
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
                placeholder="Search customers..."
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button className="bg-rose-400 hover:bg-rose-500 text-white px-3 py-1 rounded-md text-sm">PDF</button>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">CSV</button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Print</button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm">Column Visibility</button>
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
                      checked={
                        selectedRows.length === filteredCustomers.length && filteredCustomers.length > 0
                      }
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Customer Group</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Name</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Company</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Email</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Phone</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Tax</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Address</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Balance</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(customer.id)}
                        onChange={() => toggleRowSelection(customer.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-3 py-4 text-sm">{customer.group}</td>
                    <td className="px-3 py-4 text-sm">{customer.name}</td>
                    <td className="px-3 py-4 text-sm">{customer.company}</td>
                    <td className="px-3 py-4 text-sm">{customer.email}</td>
                    <td className="px-3 py-4 text-sm">{customer.phone}</td>
                    <td className="px-3 py-4 text-sm">{customer.tax}</td>
                    <td className="px-3 py-4 text-sm">{customer.address}</td>
                    <td className="px-3 py-4 text-sm">{customer.balance}</td>
                    <td className="px-3 py-4 relative">
                      <button
                        onClick={() => setOpenActionId(prev => prev === customer.id ? null : customer.id)}
                        className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                      >
                        Action <ChevronDown className="w-4 h-4 inline ml-1" />
                      </button>
                      {openActionId === customer.id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                          <button
                            onClick={() => handleAction('View', customer.id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleAction('Edit', customer.id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction('Delete', customer.id)}
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
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredCustomers.length}</span> of{" "}
                <span className="font-medium">{filteredCustomers.length}</span> results
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

export default CustomerList;
