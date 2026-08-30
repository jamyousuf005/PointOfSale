import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const DashboardWidgets = ({ recentTransactions = { sales: [], purchases: [] }, bestSellersMonthQty = [] }) => {
  const [activeTab, setActiveTab] = React.useState("Sale");

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#8478D8',
      color: theme.palette.common.white,
      fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function createData(date, reference, customer, status, grandTotal) {
    return { date, reference, customer, status, grandTotal };
  }

  const dataMap = {
    Sale: recentTransactions.sales || [],
    Purchase: recentTransactions.purchases || [],
    Quotation: [],
    Payment: [],
  };

  const tabs = ["Sale", "Purchase", "Quotation", "Payment"];

  return (
    <div className='w-full p-4 bg-gray-100'>
      <div className='flex flex-col lg:flex-row w-full gap-5'>
        {/* Left Widget: Transactions */}
        <div className='bg-white w-full lg:w-[60%] shadow-xl rounded-xl'>
          <div className='flex justify-between items-center px-5 pt-4'>
            <h2 className='text-lg font-semibold text-gray-700'>Recent Transaction</h2>
            <span className='text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium'>Latest 5</span>
          </div>

          {/* Tabs */}
          <div className='border-b border-gray-200 px-5 mt-2'>
            <ul className='flex gap-6 text-sm font-medium text-purple-600'>
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={`pb-2 cursor-pointer ${
                    activeTab === tab
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-700 hover:text-purple-500'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className='shadow-none' sx={{ backgroundColor: 'white' }}>
            <Table
              sx={{
                minWidth: 700,
                borderBottom: 'none',
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                },
              }}
              aria-label="recent transaction table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Reference</StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Grand Total</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataMap[activeTab].length > 0 ? (
                  dataMap[activeTab].map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{row.date}</StyledTableCell>
                      <StyledTableCell>{row.reference}</StyledTableCell>
                      <StyledTableCell>{row.customer}</StyledTableCell>
                      <StyledTableCell>
                        <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold'>
                          {row.status}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>{row.grandTotal}</StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={5} align="center">
                      No records found for {activeTab}
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Right Widget: Best Seller */}
        <div className="bg-white shadow-md rounded-xl p-5 w-full lg:w-[40%]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Best Seller July</h2>
            <span className="bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              Top 5
            </span>
          </div>

          <div className="grid grid-cols-3 text-sm font-medium text-gray-500 px-1">
            <div>SL No</div>
            <div>Product Details</div>
            <div className="text-right">Qty</div>
          </div>
          <div className="mt-2">
            {bestSellersMonthQty.length > 0 ? (
              bestSellersMonthQty.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-3 text-sm text-gray-800 py-3 border-t border-gray-200">
                  <div>{idx + 1}</div>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">[{item.code || item.id.slice(-6)}]</div>
                  </div>
                  <div className="text-right">{item.qty}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 py-4">No records found for this month</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
