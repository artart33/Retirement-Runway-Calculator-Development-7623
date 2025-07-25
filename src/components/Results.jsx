import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import ExportOptions from './ExportOptions';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiBarChart3, FiPieChart, FiInfo, FiUsers, FiUser } = FiIcons;

const Results = ({ results }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Uw Pensioen Runway Analyse</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <SafeIcon icon={FiTrendingUp} className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500">
            Vul het formulier in en klik op "Berekenen" om uw pensioen runway analyse te zien.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const isSuccessful = !results.moneyRunsOutAge || results.moneyRunsOutAge > results.lifeExpectancy;
  const yearsShort = results.moneyRunsOutAge ? results.lifeExpectancy - results.moneyRunsOutAge : 0;

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <ExportOptions results={results} />

      {/* Partner Notice */}
      {results.hasPartner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">Partner Berekening</h4>
              <p className="text-sm text-purple-700">
                <strong>Deze analyse combineert beide partners.</strong> Spaargelden worden samengevoegd, uitgaven gecombineerd, en de berekening loopt tot de langste levensverwachting. Inkomsten stoppen wanneer de respectievelijke eigenaar overlijdt.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Inflation Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Inflatie Berekenings Methode</h4>
            <p className="text-sm text-blue-700">
              <strong>Inflatie wordt ALLEEN toegepast op uw maandelijkse uitgaven.</strong> Uw pensioeninkomen en eenmalige betalingen blijven vast in de huidige koopkracht, waardoor dit een conservatieve schatting is.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          {results.hasPartner ? (
            <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600" />
          ) : (
            <SafeIcon icon={FiUser} className="w-6 h-6 text-blue-600" />
          )}
          <h2 className="text-2xl font-bold text-gray-800">
            {results.hasPartner ? 'Uw Gecombineerde Pensioen Runway Analyse' : 'Uw Pensioen Runway Analyse'}
          </h2>
        </div>
        
        <div className="space-y-6">
          <div className={`p-4 rounded-lg border-2 ${isSuccessful ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <SafeIcon 
                icon={isSuccessful ? FiCheckCircle : FiAlertTriangle} 
                className={`w-6 h-6 ${isSuccessful ? 'text-green-600' : 'text-red-600'}`} 
              />
              <h3 className={`text-lg font-semibold ${isSuccessful ? 'text-green-800' : 'text-red-800'}`}>
                {isSuccessful ? 'Goed Nieuws!' : 'Aandacht Vereist'}
              </h3>
            </div>
            
            {results.moneyRunsOutAge ? (
              <div className="space-y-2">
                <p className="text-gray-700">
                  Gebaseerd op uw invoer, zal {results.hasPartner ? 'uw gecombineerde' : 'uw'} geld naar verwachting meegaan tot{' '}
                  <span className="font-bold">leeftijd {results.moneyRunsOutAge}</span>.
                </p>
                <p className="text-gray-700">
                  Dit betekent dat {results.hasPartner ? 'uw gezamenlijke' : 'uw'} fondsen opraken in het jaar{' '}
                  <span className="font-bold">{results.moneyRunsOutYear}</span>.
                </p>
                {!isSuccessful && (
                  <p className="text-red-700 font-medium mt-3">
                    Dit is {yearsShort} jaar voor {results.hasPartner ? 'de langste' : 'uw'} geschatte levensverwachting. 
                    {results.hasPartner ? ' Jullie moeten mogelijk' : ' U moet mogelijk'} uitgaven aanpassen, meer sparen, of aanvullende inkomstenbronnen verkennen.
                  </p>
                )}
                {isSuccessful && (
                  <p className="text-green-700 font-medium mt-3">
                    {results.hasPartner ? 'Uw gezamenlijke' : 'Uw'} fondsen zullen naar verwachting langer meegaan dan {results.hasPartner ? 'de langste' : 'uw'} geschatte levensverwachting, wat een comfortabele buffer biedt.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-green-700 font-medium">
                  Uitstekend! {results.hasPartner ? 'Uw gezamenlijke' : 'Uw'} fondsen zullen naar verwachting {results.hasPartner ? 'het hele pensioen van beide partners' : 'uw hele pensioen'} meegaan.
                </p>
                <p className="text-gray-700">
                  {results.hasPartner ? 'Jullie zouden' : 'U zou'} ongeveer {formatCurrency(results.finalSavings)} overhouden op {results.lifeExpectancy}-jarige leeftijd.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Belangrijke Inzichten</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Pensioen Duur</span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {results.moneyRunsOutAge 
                    ? `${results.moneyRunsOutAge - results.yearlyData[0].age} jaar`
                    : `${results.lifeExpectancy - results.yearlyData[0].age}+ jaar`
                  }
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <SafeIcon icon={FiTrendingDown} className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Eindsaldo</span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(Math.max(0, results.finalSavings))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Complete Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <SafeIcon icon={FiPieChart} className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-800">
            {results.hasPartner ? 'Gecombineerde Financiële Samenvatting' : 'Complete Financiële Samenvatting'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {results.hasPartner ? 'Gecombineerd Initieel Spaargeld' : 'Initiële Spaargeld'}
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(results.summary.initialSavings)}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Totaal Inkomen Ontvangen</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(results.summary.totalIncomeReceived)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              Gem: {formatCurrency(results.summary.averageAnnualIncome)}/jaar
            </p>
            <p className="text-xs text-green-600 mt-1">
              💡 Vast in huidige koopkracht
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Eenmalige Betalingen</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {formatCurrency(results.summary.totalOneTimePayments)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              💡 Vast in huidige koopkracht
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingDown} className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {results.hasPartner ? 'Gecombineerde Uitgaven' : 'Totale Uitgaven'}
              </span>
            </div>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(results.summary.totalExpenses)}
            </p>
            <p className="text-xs text-red-700 mt-1">
              Gem: {formatCurrency(results.summary.averageAnnualExpense)}/jaar
            </p>
            <p className="text-xs text-red-600 mt-1">
              💡 Aangepast voor inflatie
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Investering Groei</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {formatCurrency(results.summary.totalGrowth)}
            </p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">Netto Cashflow</span>
            </div>
            <p className={`text-2xl font-bold ${results.summary.netCashFlow >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatCurrency(results.summary.netCashFlow)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Pensioen Tijdlijn</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Totale Jaren</p>
              <p className="text-xl font-bold text-gray-800">{results.summary.totalYears}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Leeftijd</p>
              <p className="text-xl font-bold text-gray-800">{results.yearlyData[0]?.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Geld Houdt Tot</p>
              <p className="text-xl font-bold text-gray-800">
                {results.moneyRunsOutAge 
                  ? `Leeftijd ${results.moneyRunsOutAge}`
                  : `Leeftijd ${results.lifeExpectancy}+`
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Eindsaldo</p>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(results.summary.finalBalance)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Year-by-Year Breakdown */}
      {results.yearlyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <SafeIcon icon={FiBarChart3} className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Complete Jaar-voor-Jaar Uitsplitsing</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold">Leeftijd</th>
                  {results.hasPartner && <th className="text-left p-3 font-semibold">Partner</th>}
                  <th className="text-left p-3 font-semibold">Jaar</th>
                  <th className="text-right p-3 font-semibold">Begin Saldo</th>
                  <th className="text-right p-3 font-semibold">Jaarlijks Inkomen<br/><span className="text-xs font-normal text-gray-500">(Vast)</span></th>
                  <th className="text-right p-3 font-semibold">Eenmalige Betaling<br/><span className="text-xs font-normal text-gray-500">(Vast)</span></th>
                  <th className="text-right p-3 font-semibold">Gewenste Uitgave<br/><span className="text-xs font-normal text-gray-500">(Inflatie Aangep.)</span></th>
                  <th className="text-right p-3 font-semibold">Netto Uitgave</th>
                  <th className="text-right p-3 font-semibold">Groei</th>
                  <th className="text-right p-3 font-semibold">Eind Saldo</th>
                </tr>
              </thead>
              <tbody>
                {results.yearlyData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b hover:bg-gray-50 ${row.endingSavings <= 0 ? 'bg-red-50' : ''}`}
                  >
                    <td className="p-3 font-medium">
                      {row.age}
                      {!row.mainPersonAlive && <span className="text-red-500 text-xs ml-1">†</span>}
                    </td>
                    {results.hasPartner && (
                      <td className="p-3 font-medium">
                        {row.partnerAge}
                        {!row.partnerAlive && <span className="text-red-500 text-xs ml-1">†</span>}
                      </td>
                    )}
                    <td className="p-3">{row.year}</td>
                    <td className="p-3 text-right">{formatCurrency(row.startingSavings)}</td>
                    <td className="p-3 text-right text-green-600 font-medium">
                      {formatCurrency(row.totalIncome)}
                    </td>
                    <td className="p-3 text-right text-purple-600 font-medium">
                      {row.oneTimePayment > 0 ? formatCurrency(row.oneTimePayment) : '-'}
                    </td>
                    <td className="p-3 text-right text-gray-600">
                      {formatCurrency(row.desiredIncome)}
                      {row.inflationFactor > 1 && (
                        <div className="text-xs text-gray-500">
                          {formatPercentage((row.inflationFactor - 1) * 100)} inflatie
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right text-red-600 font-medium">
                      {formatCurrency(row.netExpense)}
                    </td>
                    <td className="p-3 text-right text-blue-600 font-medium">
                      {formatCurrency(row.growthAmount)}
                    </td>
                    <td className="p-3 text-right font-bold">
                      <span className={row.endingSavings <= 0 ? 'text-red-600' : 'text-gray-800'}>
                        {formatCurrency(Math.max(0, row.endingSavings))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">Legenda:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Jaarlijks Inkomen: Vast in huidige koopkracht</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Eenmalige Betaling: Vast in huidige koopkracht</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Gewenste Uitgave: Aangepast voor inflatie elk jaar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Netto Uitgave: Tekort na inkomstenbronnen</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Groei: Investeringsrendementen op resterend saldo</span>
              </div>
              {results.hasPartner && (
                <div className="flex items-center gap-2">
                  <span className="text-red-500">†</span>
                  <span>Geeft aan wanneer een persoon niet meer leeft</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Results;