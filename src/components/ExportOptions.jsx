import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiFileText, FiShare2, FiPrinter } = FiIcons;

const ExportOptions = ({ results }) => {
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportToCSV = () => {
    if (!results || !results.yearlyData) return;

    const csvHeaders = [
      'Leeftijd',
      ...(results.hasPartner ? ['Partner Leeftijd'] : []),
      'Jaar',
      'Begin Saldo',
      'Jaarlijks Inkomen',
      'Eenmalige Betaling',
      'Gewenste Uitgave',
      'Netto Uitgave',
      'Groei',
      'Eind Saldo',
      ...(results.hasPartner ? ['Hoofdpersoon Leeft', 'Partner Leeft'] : [])
    ];

    const csvData = results.yearlyData.map(row => [
      row.age,
      ...(results.hasPartner ? [row.partnerAge] : []),
      row.year,
      row.startingSavings.toFixed(2),
      row.totalIncome.toFixed(2),
      row.oneTimePayment.toFixed(2),
      row.desiredIncome.toFixed(2),
      row.netExpense.toFixed(2),
      row.growthAmount.toFixed(2),
      Math.max(0, row.endingSavings).toFixed(2),
      ...(results.hasPartner ? [row.mainPersonAlive ? 'Ja' : 'Nee', row.partnerAlive ? 'Ja' : 'Nee'] : [])
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pensioen-analyse${results.hasPartner ? '-partners' : ''}.csv`);
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
        <title>${results.hasPartner ? 'Gecombineerde Pensioen Analyse Rapport' : 'Pensioen Analyse Rapport'}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
          }
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .copyright { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; color: #666; font-size: 12px; }
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
          .partner-info { background: #f3e8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .deceased { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${results.hasPartner ? 'Gecombineerde Pensioen Analyse Rapport' : 'Pensioen Analyse Rapport'}</h1>
          <p>Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}</p>
        </div>

        ${results.hasPartner ? `
        <div class="partner-info">
          <h3>Partner Berekening</h3>
          <p><strong>Deze analyse combineert beide partners.</strong> Spaargelden worden samengevoegd, uitgaven gecombineerd, en de berekening loopt tot de langste levensverwachting. Inkomsten stoppen wanneer de respectievelijke eigenaar overlijdt.</p>
        </div>
        ` : ''}

        <div class="section">
          <h2>Samenvatting</h2>
          <div class="summary-grid">
            <div class="summary-card">
              <h4>${results.hasPartner ? 'Gecombineerd Initieel Spaargeld' : 'Initiële Spaargeld'}</h4>
              <div class="value">${formatCurrency(results.summary.initialSavings)}</div>
            </div>
            <div class="summary-card">
              <h4>Totaal Inkomen</h4>
              <div class="value">${formatCurrency(results.summary.totalIncomeReceived)}</div>
            </div>
            <div class="summary-card">
              <h4>${results.hasPartner ? 'Gecombineerde Uitgaven' : 'Totale Uitgaven'}</h4>
              <div class="value">${formatCurrency(results.summary.totalExpenses)}</div>
            </div>
            <div class="summary-card">
              <h4>Eindsaldo</h4>
              <div class="value ${results.summary.finalBalance > 0 ? 'success' : 'warning'}">${formatCurrency(results.summary.finalBalance)}</div>
            </div>
          </div>
          
          <div class="key-finding ${results.moneyRunsOutAge && results.moneyRunsOutAge <= results.lifeExpectancy ? 'warning' : 'success'}">
            <strong>Belangrijkste Bevinding:</strong> 
            ${results.moneyRunsOutAge 
              ? `${results.hasPartner ? 'Uw gezamenlijke' : 'Uw'} fondsen zullen naar verwachting meegaan tot leeftijd ${results.moneyRunsOutAge}.`
              : `${results.hasPartner ? 'Uw gezamenlijke' : 'Uw'} fondsen zullen naar verwachting ${results.hasPartner ? 'het hele pensioen van beide partners' : 'uw hele pensioen'} meegaan.`
            }
          </div>
        </div>

        <div class="section">
          <h2>Aannames</h2>
          <div class="assumptions">
            <div class="assumptions-grid">
              <div class="assumption-item">
                <div class="assumption-label">Hoofdpersoon Leeftijd:</div>
                <div class="assumption-value">${results.formData.currentAge} jaar</div>
              </div>
              ${results.hasPartner && results.formData.partnerData ? `
              <div class="assumption-item">
                <div class="assumption-label">Partner Leeftijd:</div>
                <div class="assumption-value">${results.formData.partnerData.currentAge} jaar</div>
              </div>
              ` : ''}
              <div class="assumption-item">
                <div class="assumption-label">Levensverwachting:</div>
                <div class="assumption-value">${results.formData.lifeExpectancy} jaar</div>
              </div>
              ${results.hasPartner && results.formData.partnerData ? `
              <div class="assumption-item">
                <div class="assumption-label">Partner Levensverwachting:</div>
                <div class="assumption-value">${results.formData.partnerData.lifeExpectancy} jaar</div>
              </div>
              ` : ''}
              <div class="assumption-item">
                <div class="assumption-label">Maandelijks Inkomen Nodig:</div>
                <div class="assumption-value">${formatCurrency(results.formData.desiredMonthlyIncome)}</div>
              </div>
              ${results.hasPartner && results.formData.partnerData ? `
              <div class="assumption-item">
                <div class="assumption-label">Partner Maandelijks Inkomen:</div>
                <div class="assumption-value">${formatCurrency(results.formData.partnerData.desiredMonthlyIncome)}</div>
              </div>
              ` : ''}
              <div class="assumption-item">
                <div class="assumption-label">Inflatie Percentage:</div>
                <div class="assumption-value">${results.formData.inflationRate}%</div>
              </div>
              <div class="assumption-item">
                <div class="assumption-label">Investering Groei:</div>
                <div class="assumption-value">${results.formData.investmentGrowthRate}%</div>
              </div>
              <div class="assumption-item">
                <div class="assumption-label">${results.hasPartner ? 'Gecombineerd' : ''} Initiële Spaargeld:</div>
                <div class="assumption-value">${formatCurrency(results.formData.combinedLumpSum || results.formData.lumpSumSavings)}</div>
              </div>
            </div>
          </div>
        </div>

        ${results.incomeStreams.length > 0 ? `
        <div class="section">
          <h2>Inkomstenbronnen</h2>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Bron</th>
                <th>Eigenaar</th>
                <th>Start Leeftijd</th>
                <th>Maandelijks Bedrag</th>
                <th>Jaarlijks Bedrag</th>
              </tr>
            </thead>
            <tbody>
              ${results.incomeStreams.map(stream => `
                <tr>
                  <td style="text-align: left;">${stream.name}</td>
                  <td>${stream.owner === 'self' ? 'Hoofdpersoon' : 'Partner'}</td>
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
          <h2>Eenmalige Betalingen</h2>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Betaling</th>
                <th>Eigenaar</th>
                <th>Leeftijd</th>
                <th>Bedrag</th>
              </tr>
            </thead>
            <tbody>
              ${results.oneTimePayments.map(payment => `
                <tr>
                  <td style="text-align: left;">${payment.name}</td>
                  <td>${payment.owner === 'self' ? 'Hoofdpersoon' : 'Partner'}</td>
                  <td>${payment.age}</td>
                  <td>${formatCurrency(payment.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="section">
          <h2>Jaar-voor-Jaar Projecties</h2>
          <table>
            <thead>
              <tr>
                <th>Leeftijd</th>
                ${results.hasPartner ? '<th>Partner</th>' : ''}
                <th>Jaar</th>
                <th>Begin Saldo</th>
                <th>Jaarlijks Inkomen</th>
                <th>Eenmalige Betaling</th>
                <th>Jaarlijkse Uitgave</th>
                <th>Netto Uitgave</th>
                <th>Groei</th>
                <th>Eind Saldo</th>
              </tr>
            </thead>
            <tbody>
              ${results.yearlyData.map(row => `
                <tr ${row.endingSavings <= 0 ? 'class="highlight"' : ''}>
                  <td>${row.age}${!row.mainPersonAlive ? ' <span class="deceased">†</span>' : ''}</td>
                  ${results.hasPartner ? `<td>${row.partnerAge}${!row.partnerAlive ? ' <span class="deceased">†</span>' : ''}</td>` : ''}
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
          <h2>Belangrijke Opmerkingen</h2>
          <ul>
            <li>Inflatie wordt alleen toegepast op ${results.hasPartner ? 'uw gecombineerde' : 'uw'} maandelijkse uitgaven, niet op inkomstenbronnen of eenmalige betalingen</li>
            <li>Inkomstenbronnen en eenmalige betalingen zijn vast in de huidige koopkracht</li>
            ${results.hasPartner ? '<li>Bij partners worden spaargelden gecombineerd, maar inkomsten stoppen wanneer de respectievelijke eigenaar overlijdt</li>' : ''}
            <li>Deze analyse gaat uit van een consistente investeringsgroei</li>
            <li>Werkelijke resultaten kunnen variëren op basis van marktomstandigheden en persoonlijke omstandigheden</li>
            <li>Overweeg om een financieel adviseur te raadplegen voor gepersonaliseerd advies</li>
          </ul>
        </div>

        <div class="copyright">
          <p>© ${new Date().getFullYear()} Robin Ramp - Alle rechten voorbehouden</p>
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
    link.setAttribute('download', `pensioen-analyse-rapport${results.hasPartner ? '-partners' : ''}.html`);
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

    const shareText = `${results.hasPartner ? 'Onze Gecombineerde' : 'Mijn'} Pensioen Analyse Resultaten:
• Geld houdt tot leeftijd: ${results.moneyRunsOutAge || results.lifeExpectancy}
• ${results.hasPartner ? 'Gecombineerd initieel' : 'Initiële'} spaargeld: ${formatCurrency(results.summary.initialSavings)}
• Eindsaldo: ${formatCurrency(results.summary.finalBalance)}
• Gegenereerd met Pensioen Runway Calculator
• © Robin Ramp`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${results.hasPartner ? 'Gecombineerde' : ''} Pensioen Analyse Resultaten`,
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
      alert('Resultaten gekopieerd naar klembord!');
    }).catch(() => {
      alert('Kopiëren naar klembord mislukt');
    });
  };

  const handleExport = async (exportFunction) => {
    setIsExporting(true);
    try {
      await exportFunction();
    } catch (error) {
      console.error('Export error:', error);
      alert('Export mislukt. Probeer opnieuw.');
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
        <h3 className="text-xl font-bold text-gray-800">
          Exporteer & Deel {results.hasPartner ? 'Uw Gecombineerde' : 'Uw'} Resultaten
        </h3>
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
            <div className="font-semibold text-green-800">Export naar CSV</div>
            <div className="text-sm text-green-600">Spreadsheet formaat</div>
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
            <div className="font-semibold text-purple-800">Genereer Rapport</div>
            <div className="text-sm text-purple-600">HTML rapport</div>
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
            <div className="font-semibold text-red-800">Export naar PDF</div>
            <div className="text-sm text-red-600">PDF formaat</div>
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
            <div className="font-semibold text-gray-800">Print Resultaten</div>
            <div className="text-sm text-gray-600">Print rapport</div>
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
            <div className="font-semibold text-orange-800">Deel Resultaten</div>
            <div className="text-sm text-orange-600">Kopieer samenvatting naar klembord</div>
          </div>
        </motion.button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Bewaar {results.hasPartner ? 'uw gecombineerde' : 'uw'} resultaten in meerdere formaten om gemakkelijk te delen met financiële adviseurs of familieleden.
        </p>
      </div>
    </motion.div>
  );
};

export default ExportOptions;