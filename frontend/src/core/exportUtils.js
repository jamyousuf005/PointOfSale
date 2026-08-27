/**
 * Utility functions for exporting table data to CSV and printing HTML tables.
 */

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  // Filter out internal fields like _id, __v if desired or clean object keys
  const sample = data[0];
  const keys = Object.keys(sample).filter(k => k !== '__v');

  const csvRows = [];

  // Header row
  csvRows.push(keys.map(k => `"${k}"`).join(','));

  // Data rows
  data.forEach(item => {
    const row = keys.map(k => {
      const val = item[k];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printTable = (title, columns = [], data = []) => {
  const visibleCols = columns.filter(c => c.visible !== false);
  
  const printWindow = window.open('', '_blank', 'width=900,height=600');
  if (!printWindow) {
    alert('Please allow popups to print.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Print Table'}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          h2 { margin-bottom: 16px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; }
          th { background-color: #f3f4f6; font-weight: 600; }
          tr:nth-child(even) { background-color: #f9fafb; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h2>${title || 'Table Data'}</h2>
        <table>
          <thead>
            <tr>
              ${visibleCols.map(col => `<th>${col.label || col.key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${visibleCols.map(col => {
                  const val = row[col.key];
                  return `<td>${val !== undefined && val !== null ? String(val) : ''}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
