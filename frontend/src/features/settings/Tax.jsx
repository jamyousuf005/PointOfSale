import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
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

const initialTaxData = [
  { id: 1, name: "VAT 5%", rate: 5 },
  { id: 2, name: "GST 10%", rate: 10 },
];

const Tax = () => {
  const [taxData, setTaxData] = useState(initialTaxData);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const [columns, setColumns] = useState([
    { key: 'name', label: 'Name', visible: true },
    { key: 'rate', label: 'Rate (%)', visible: true },
  ]);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredTaxes = taxData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? new Set(filteredTaxes.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id, checked) => {
    const newSet = new Set(selectedItems);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedItems(newSet);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} tax rate(s)?`)) {
      setTaxData((prev) => prev.filter((t) => !selectedItems.has(t.id)));
      setSelectedItems(new Set());
    }
  };

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible !== false : true;
  };

  return (
    <motion.div
      className="p-6 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6 overflow-hidden"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Tax List"
          addLabel="+ Add Tax"
          onAdd={() => alert('Add Tax clicked')}
          extraButtons={[
            {
              label: '📁 Import Tax',
              onClick: () => alert('Import Tax clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search taxes..."
          data={filteredTaxes}
          exportFilename="Taxes_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedItems.size}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredTaxes.length && filteredTaxes.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {isColVisible('name') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>}
                {isColVisible('rate') && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Rate (%)</th>}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTaxes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredTaxes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {isColVisible('name') && <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>}
                    {isColVisible('rate') && <td className="px-6 py-4 text-sm text-gray-900">{item.rate}%</td>}
                    <td className="px-6 py-4">
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 border border-purple-300">
                        Action
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-white border-t border-gray-200">
              <tr>
                <td colSpan="1" className="px-6 py-3 text-sm font-semibold text-gray-700">Total</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-700">0.00</td>
                <td colSpan="2" className="px-6 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">Showing 0 to 0 of 0 entries</div>
            <div className="flex items-center gap-1">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded" disabled>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm font-medium">1</button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded" disabled>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Tax;