import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

const initialUnitData = [
  { id: 1, code: 'PC', name: 'Per PC', baseUnit: 'N/A', operator: '*', operationValue: '1' },
  { id: 2, code: 'KG', name: 'Kilogram', baseUnit: 'N/A', operator: '*', operationValue: '1' }
];

const Unit = () => {
  const [unitData, setUnitData] = useState(initialUnitData);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);

  const [columns, setColumns] = useState([
    { key: 'code', label: 'Code', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'baseUnit', label: 'Base Unit', visible: true },
    { key: 'operator', label: 'Operator', visible: true },
    { key: 'operationValue', label: 'Operation Value', visible: true },
  ]);

  const handleColumnToggle = (columnKey) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col))
    );
  };

  const filteredUnits = unitData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? new Set(filteredUnits.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id, checked) => {
    const newSet = new Set(selectedItems);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedItems(newSet);
  };

  const handleAction = (action, id) => {
    if (action === 'Delete') {
      if (window.confirm("Are you sure you want to delete this unit?")) {
        setUnitData((prev) => prev.filter((u) => u.id !== id));
      }
    }
    setOpenActionId(null);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} unit(s)?`)) {
      setUnitData((prev) => prev.filter((u) => !selectedItems.has(u.id)));
      setSelectedItems(new Set());
    }
  };

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible !== false : true;
  };

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <TableHeaderControls
          title="Unit List"
          addLabel="+ Add Unit"
          onAdd={() => alert('Add Unit clicked')}
          extraButtons={[
            {
              label: '📁 Import Unit',
              onClick: () => alert('Import Unit clicked'),
              className: 'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors shadow-sm'
            }
          ]}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={setRecordsPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search units..."
          data={filteredUnits}
          exportFilename="Units_List"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          selectedCount={selectedItems.size}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredUnits.length && filteredUnits.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
                {isColVisible('code') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Code</th>}
                {isColVisible('name') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Name</th>}
                {isColVisible('baseUnit') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Base Unit</th>}
                {isColVisible('operator') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Operator</th>}
                {isColVisible('operationValue') && <th className="px-3 py-4 font-semibold text-gray-700 text-left">Operation Value</th>}
                <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUnits.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </td>
                  {isColVisible('code') && <td className="px-3 py-4 text-sm">{item.code}</td>}
                  {isColVisible('name') && <td className="px-3 py-4 text-sm">{item.name}</td>}
                  {isColVisible('baseUnit') && <td className="px-3 py-4 text-sm">{item.baseUnit}</td>}
                  {isColVisible('operator') && <td className="px-3 py-4 text-sm">{item.operator}</td>}
                  {isColVisible('operationValue') && <td className="px-3 py-4 text-sm">{item.operationValue}</td>}
                  <td className="px-3 py-4 relative">
                    <button
                      onClick={() => setOpenActionId(prev => (prev === item.id ? null : item.id))}
                      className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                    >
                      Action <ChevronDown className="w-4 h-4 inline ml-1" />
                    </button>
                    {openActionId === item.id && (
                      <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                        <button
                          onClick={() => handleAction('Edit', item.id)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction('Delete', item.id)}
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{unitData.length}</span> of <span className="font-medium">{unitData.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-purple-500 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Unit;