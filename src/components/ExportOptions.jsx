import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiFileText, FiShare2, FiPrinter } = FiIcons;

const ExportOptions = ({ results }) => {
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportToCSV = () => {
    if (!results || !results.yearlyData) return;

    const csvHeaders = [
      'Age',
      'Year',
      'Starting Balance',
      'Annual Income',
      'One-Time Payment',
      'Desired Expense',
      'Net Expense',
      'Growth',
      'Ending Balance'
    ];

    const csvData = results.yearlyData.map(row => [
      row.age,
      row.year,
      row.startingSavings.toFixed(2),
      row.totalIncome.toFixed(2),
      row.oneTimePayment.toFixed(2),
      row.desiredIncome.toFixed(2),
      row.netExpense.toFixed(2),
      row.growthAmount.toFixed(2),
      Math.max(0, row.endingSavings).toFixed(2)
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'retirement-analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Retirement Analysis Report</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
          }
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
          .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9; }
          .summary-card h4 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
          .summary-card .value { font-size: 24px; font-weight: bold; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: right; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .highlight { background-color: #fff3cd; }
          .success { color: #28a745; }
          .warning { color: #dc3545; }
          .assumptions { background: #f8f9fa; padding: 15px; border-radius: 8px; }
          .assumptions h3 { margin-top: 0; }
          .assumptions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
          .assumption-item { padding: 5px 0; }
          .assumption-label { font-weight: bold; color: #666; }
          .assumption-value { color: #333; }
          .key-finding { padding: 15px; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .key-finding.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
          .key-finding.warning { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Retirement Analysis Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>Executive Summary</h2>
          <div class="summary-grid">
            <div class="summary-card">
              <h4>Initial Savings</h4>
              <div class="value">${formatCurrency(results.summary.initialSavings)}</div>
            </div>
            <div class="summary-card">
              <h4>Total Income</h4>
              <div class="value">${formatCurrency(results.summary.totalIncomeReceived)}</div>
            </div>
            <div class="summary-card">
              <h4>Total Expenses</h4>
              <div class="value">${formatCurrency(results.summary.totalExpenses)}</div>
            </div>
            <div class="summary-card">
              <h4>Final Balance</h4>
              <div class="value ${results.summary.finalBalance > 0 ? 'success' : 'warning'}">${formatCurrency(results.summary.finalBalance)}</div>
            </div>
          </div>
          
          <div class="key-finding ${results.moneyRunsOutAge && results.moneyRunsOutAge <= results.lifeExpectancy ? 'warning' : 'success'}">
            <strong>Key Finding:</strong> 
            ${results.moneyRunsOutAge 
              ? `Your funds are projected to last until age ${results.moneyRunsOutAge}.`
              : `Your funds are projected to last throughout your entire retirement.`
            }
          </div>
        </div>

        <div class="section">
          <h2>Assumptions</h2>
          <div class="assumptions">
            <div class="assumptions-grid">
              <div class="assumption-item">
                <div class="assumption-label">Current Age:</div>
                <div class="assumption-value">${results.formData.currentAge} years</div>
              </div>
              <div class="assumption-item">
                <div class="assumption-label">Life Expectancy:</div>
                <div class="assumption-value">${results.formData.lifeExpectancy} years</div>
              </div>
              <div class="assumption-item">
                <div class="assumption-label">Monthly Income Needed:</div>
                <div class="assumption-value">${formatCurrency(results.formData.desiredMonthlyIncome)}</div>
              </div>
              <div class="assumption-item">
                <div class="assumption-label">Inflation Rate:</div>
                <div class="assumption-value">${results.formData.inflationRate}%</div>
              </div>
              <div class="assumption-item">
                <div class="assumption-label">Investment Growth:</div>
                <div class="assumption-value">${results.formData.investmentGrowthRate}%</div>
              </div>
              <div class="assumption-item">
                <div class="assumption-label">Initial Savings:</div>
                <div class="assumption-value">${formatCurrency(results.formData.lumpSumSavings)}</div>
              </div>
            </div>
          </div>
        </div>

        ${results.incomeStreams.length > 0 ? `
        <div class="section">
          <h2>Income Sources</h2>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Source</th>
                <th>Start Age</th>
                <th>Monthly Amount</th>
                <th>Annual Amount</th>
              </tr>
            </thead>
            <tbody>
              ${results.incomeStreams.map(stream => `
                <tr>
                  <td style="text-align: left;">${stream.name}</td>
                  <td>${stream.startAge}</td>
                  <td>${formatCurrency(stream.monthlyAmount)}</td>
                  <td>${formatCurrency(stream.monthlyAmount * 12)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${results.oneTimePayments.length > 0 ? `
        <div class="section">
          <h2>One-Time Payments</h2>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Payment</th>
                <th>Age</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${results.oneTimePayments.map(payment => `
                <tr>
                  <td style="text-align: left;">${payment.name}</td>
                  <td>${payment.age}</td>
                  <td>${formatCurrency(payment.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="section">
          <h2>Year-by-Year Projections</h2>
          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th>Year</th>
                <th>Starting Balance</th>
                <th>Annual Income</th>
                <th>One-Time Payment</th>
                <th>Annual Expense</th>
                <th>Net Expense</th>
                <th>Growth</th>
                <th>Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              ${results.yearlyData.map(row => `
                <tr ${row.endingSavings <= 0 ? 'class="highlight"' : ''}>
                  <td>${row.age}</td>
                  <td>${row.year}</td>
                  <td>${formatCurrency(row.startingSavings)}</td>
                  <td>${formatCurrency(row.totalIncome)}</td>
                  <td>${row.oneTimePayment > 0 ? formatCurrency(row.oneTimePayment) : '-'}</td>
                  <td>${formatCurrency(row.desiredIncome)}</td>
                  <td>${formatCurrency(row.netExpense)}</td>
                  <td>${formatCurrency(row.growthAmount)}</td>
                  <td>${formatCurrency(Math.max(0, row.endingSavings))}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Important Notes</h2>
          <ul>
            <li>Inflation is applied only to your monthly expenses, not to income sources or one-time payments</li>
            <li>Income sources and one-time payments are fixed in today's purchasing power</li>
            <li>This analysis assumes a consistent investment growth rate</li>
            <li>Actual results may vary based on market conditions and personal circumstances</li>
            <li>Consider consulting with a financial advisor for personalized advice</li>
          </ul>
        </div>
      </body>
      </html>
    `;
  };

  const generateHTMLReport = () => {
    if (!results) return;

    const reportContent = generateReportHTML();
    const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'retirement-analysis-report.html');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!results) return;

    const reportContent = generateReportHTML();
    
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 100);
    };
  };

  const printReport = () => {
    if (!results) return;

    const reportContent = generateReportHTML();
    
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 100);
    };
  };

  const shareResults = async () => {
    if (!results) return;

    const shareText = `My Retirement Analysis Results:
• Money lasts until age: ${results.moneyRunsOutAge || results.lifeExpectancy}
• Initial savings: ${formatCurrency(results.summary.initialSavings)}
• Final balance: ${formatCurrency(results.summary.finalBalance)}
• Generated with Retirement Runway Calculator`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Retirement Analysis Results',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const handleExport = async (exportFunction) => {
    setIsExporting(true);
    try {
      await exportFunction();
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!results) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <SafeIcon icon={FiDownload} className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Export & Share Your Results</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport(exportToCSV)}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <SafeIcon icon={FiFileText} className="w-5 h-5 text-green-600" />
          <div className="text-left">
            <div className="font-semibold text-green-800">Export to CSV</div>
            <div className="text-sm text-green-600">Spreadsheet format</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport(generateHTMLReport)}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
        >
          <SafeIcon icon={FiFileText} className="w-5 h-5 text-purple-600" />
          <div className="text-left">
            <div className="font-semibold text-purple-800">Generate Report</div>
            <div className="text-sm text-purple-600">HTML report</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport(exportToPDF)}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <SafeIcon icon={FiFileText} className="w-5 h-5 text-red-600" />
          <div className="text-left">
            <div className="font-semibold text-red-800">Export to PDF</div>
            <div className="text-sm text-red-600">PDF format</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport(printReport)}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <SafeIcon icon={FiPrinter} className="w-5 h-5 text-gray-600" />
          <div className="text-left">
            <div className="font-semibold text-gray-800">Print Results</div>
            <div className="text-sm text-gray-600">Print report</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={shareResults}
          className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors md:col-span-2 lg:col-span-4"
        >
          <SafeIcon icon={FiShare2} className="w-5 h-5 text-orange-600" />
          <div className="text-left">
            <div className="font-semibold text-orange-800">Share Results</div>
            <div className="text-sm text-orange-600">Copy summary to clipboard</div>
          </div>
        </motion.button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Save your results in multiple formats for easy sharing with financial advisors or family members.
        </p>
      </div>
    </motion.div>
  );
};

export default ExportOptions;