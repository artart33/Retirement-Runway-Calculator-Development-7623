import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import ExportOptions from './ExportOptions';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiBarChart3, FiPieChart, FiInfo } = FiIcons;

const Results = ({ results }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Retirement Runway Analysis</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <SafeIcon icon={FiTrendingUp} className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500">
            Fill out the form and click "Calculate" to see your retirement runway analysis.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

      {/* Inflation Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Inflation Calculation Method</h4>
            <p className="text-sm text-blue-700">
              <strong>Inflation is applied ONLY to your monthly expenses.</strong> Your pension income and one-time payments 
              remain fixed in today's purchasing power, making this a conservative estimate.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Retirement Runway Analysis</h2>
        
        <div className="space-y-6">
          <div className={`p-4 rounded-lg border-2 ${isSuccessful ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <SafeIcon 
                icon={isSuccessful ? FiCheckCircle : FiAlertTriangle} 
                className={`w-6 h-6 ${isSuccessful ? 'text-green-600' : 'text-red-600'}`} 
              />
              <h3 className={`text-lg font-semibold ${isSuccessful ? 'text-green-800' : 'text-red-800'}`}>
                {isSuccessful ? 'Good News!' : 'Attention Needed'}
              </h3>
            </div>
            
            {results.moneyRunsOutAge ? (
              <div className="space-y-2">
                <p className="text-gray-700">
                  Based on your inputs, your money is projected to last until you are{' '}
                  <span className="font-bold">{results.moneyRunsOutAge} years old</span>.
                </p>
                <p className="text-gray-700">
                  This means your funds would run out in the year{' '}
                  <span className="font-bold">{results.moneyRunsOutYear}</span>.
                </p>
                
                {!isSuccessful && (
                  <p className="text-red-700 font-medium mt-3">
                    This is {yearsShort} years before your estimated life expectancy. 
                    You may need to adjust your spending, save more, or explore additional income sources.
                  </p>
                )}
                
                {isSuccessful && (
                  <p className="text-green-700 font-medium mt-3">
                    Your funds are projected to last beyond your estimated life expectancy, 
                    providing a comfortable buffer.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-green-700 font-medium">
                  Excellent! Your funds are projected to last throughout your entire retirement.
                </p>
                <p className="text-gray-700">
                  You would have approximately {formatCurrency(results.finalSavings)} remaining 
                  at age {results.lifeExpectancy}.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Key Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Retirement Duration</span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {results.moneyRunsOutAge 
                    ? `${results.moneyRunsOutAge - results.yearlyData[0].age} years`
                    : `${results.lifeExpectancy - results.yearlyData[0].age}+ years`
                  }
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <SafeIcon icon={FiTrendingDown} className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Final Balance</span>
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
          <h3 className="text-xl font-bold text-gray-800">Complete Financial Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Initial Savings</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(results.summary.initialSavings)}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Total Income Received</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(results.summary.totalIncomeReceived)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              Avg: {formatCurrency(results.summary.averageAnnualIncome)}/year
            </p>
            <p className="text-xs text-green-600 mt-1">
              💡 Fixed in today's purchasing power
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">One-Time Payments</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {formatCurrency(results.summary.totalOneTimePayments)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              💡 Fixed in today's purchasing power
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingDown} className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Total Expenses</span>
            </div>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(results.summary.totalExpenses)}
            </p>
            <p className="text-xs text-red-700 mt-1">
              Avg: {formatCurrency(results.summary.averageAnnualExpense)}/year
            </p>
            <p className="text-xs text-red-600 mt-1">
              💡 Adjusted for inflation
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Investment Growth</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {formatCurrency(results.summary.totalGrowth)}
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">Net Cash Flow</span>
            </div>
            <p className={`text-2xl font-bold ${results.summary.netCashFlow >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatCurrency(results.summary.netCashFlow)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Retirement Timeline</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Years</p>
              <p className="text-xl font-bold text-gray-800">{results.summary.totalYears}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Starting Age</p>
              <p className="text-xl font-bold text-gray-800">{results.yearlyData[0]?.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Money Lasts Until</p>
              <p className="text-xl font-bold text-gray-800">
                {results.moneyRunsOutAge ? `Age ${results.moneyRunsOutAge}` : `Age ${results.lifeExpectancy}+`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Final Balance</p>
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
            <h3 className="text-xl font-bold text-gray-800">Complete Year-by-Year Breakdown</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold">Age</th>
                  <th className="text-left p-3 font-semibold">Year</th>
                  <th className="text-right p-3 font-semibold">Starting Balance</th>
                  <th className="text-right p-3 font-semibold">Annual Income<br/><span className="text-xs font-normal text-gray-500">(Fixed)</span></th>
                  <th className="text-right p-3 font-semibold">One-Time Payment<br/><span className="text-xs font-normal text-gray-500">(Fixed)</span></th>
                  <th className="text-right p-3 font-semibold">Desired Expense<br/><span className="text-xs font-normal text-gray-500">(Inflation Adj.)</span></th>
                  <th className="text-right p-3 font-semibold">Net Expense</th>
                  <th className="text-right p-3 font-semibold">Growth</th>
                  <th className="text-right p-3 font-semibold">Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.yearlyData.map((row, index) => (
                  <tr key={index} className={`border-b hover:bg-gray-50 ${row.endingSavings <= 0 ? 'bg-red-50' : ''}`}>
                    <td className="p-3 font-medium">{row.age}</td>
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
                          {formatPercentage((row.inflationFactor - 1) * 100)} inflation
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
            <h5 className="font-semibold text-gray-800 mb-2">Legend:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Annual Income: Fixed in today's purchasing power</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>One-Time Payment: Fixed in today's purchasing power</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Desired Expense: Adjusted for inflation each year</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Net Expense: Shortfall after income sources</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Growth: Investment returns on remaining balance</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Results;