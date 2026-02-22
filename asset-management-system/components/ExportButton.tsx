'use client';

import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  disabled?: boolean;
}

export default function ExportButton({ data, filename, disabled }: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Convert data to CSV format
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).filter(key => {
      // Filter out nested objects and arrays
      const value = data[0][key];
      return !(typeof value === 'object' && value !== null);
    });

    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle null/undefined
          if (value === null || value === undefined) return '';
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </button>
  );
}
