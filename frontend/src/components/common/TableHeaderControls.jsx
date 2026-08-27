import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { exportToCSV, printTable } from '../../core/exportUtils';

export default function TableHeaderControls({
  title = 'Module',
  addLabel,
  onAdd,
  extraButtons = [],
  recordsPerPage = '10',
  onRecordsPerPageChange,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  data = [],
  exportFilename = 'export',
  columns = [],
  onColumnToggle,
  selectedCount = 0,
  onBulkDelete,
}) {
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowColumnDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    exportToCSV(data, exportFilename || `${title}_Export`);
  };

  const handlePrint = () => {
    printTable(title, columns, data);
  };

  return (
    <div className="sm:p-4 mb-4">
      {/* Top Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {onAdd && addLabel && (
          <button
            type="button"
            onClick={onAdd}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors shadow-sm"
          >
            {addLabel}
          </button>
        )}
        {extraButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.onClick}
            className={
              btn.className ||
              'bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex items-center gap-1 transition-colors shadow-sm'
            }
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Control Bar: Records per page, Search input, Export action buttons */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Records per page */}
        <div className="flex items-center gap-2">
          <select
            className="border border-purple-300 text-purple-700 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={recordsPerPage}
            onChange={(e) => onRecordsPerPageChange && onRecordsPerPageChange(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-gray-600 text-sm">records per page</span>
        </div>

        {/* Live Search Input */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-64 transition-all"
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Export & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap relative">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition-colors"
            title="Export PDF"
          >
            PDF
          </button>
          
          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition-colors"
            title="Export CSV"
          >
            CSV
          </button>
          
          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1.5 rounded-md text-sm transition-colors"
            title="Print Table"
          >
            Print
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (selectedCount === 0) {
                alert('Please select items using checkboxes first.');
                return;
              }
              if (onBulkDelete) onBulkDelete();
            }}
            className={`${
              selectedCount > 0
                ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                : 'bg-red-400 cursor-not-allowed opacity-75'
            } text-white font-medium px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1`}
            title={selectedCount > 0 ? `Delete ${selectedCount} selected` : 'Select items to delete'}
          >
            Delete {selectedCount > 0 && `(${selectedCount})`}
          </button>

          {/* Column Visibility Dropdown */}
          {columns && columns.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Column Visibility
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {showColumnDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-30 p-2 text-sm">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1 border-b mb-1 uppercase tracking-wider">
                    Toggle Columns
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {columns.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer select-none text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={col.visible !== false}
                          onChange={() => onColumnToggle && onColumnToggle(col.key)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                        />
                        <span className="truncate">{col.label || col.key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
