import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiCalculator, FiRefreshCw, FiDollarSign, FiTrendingUp } = FiIcons;

const Calculator = ({ onCalculate, onReset }) => {
  const [formData, setFormData] = useState({
    currentAge: 45,
    currentYear: 2025,
    lumpSumSavings: 500000,
    desiredMonthlyIncome: 3500,
    inflationRate: 3.0,
    investmentGrowthRate: 5.0,
    lifeExpectancy: 90
  });

  const [incomeStreams, setIncomeStreams] = useState([
    {
      id: 1,
      name: 'State Pension',
      startAge: 67,
      monthlyAmount: 1200
    }
  ]);

  const [oneTimePayments, setOneTimePayments] = useState([
    {
      id: 1,
      name: 'House Sale',
      age: 70,
      amount: 200000
    }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIncomeStream = () => {
    const newId = Math.max(...incomeStreams.map(s => s.id), 0) + 1;
    setIncomeStreams(prev => [...prev, {
      id: newId,
      name: '',
      startAge: 67,
      monthlyAmount: 0
    }]);
  };

  const removeIncomeStream = (id) => {
    setIncomeStreams(prev => prev.filter(stream => stream.id !== id));
  };

  const updateIncomeStream = (id, field, value) => {
    setIncomeStreams(prev => prev.map(stream => 
      stream.id === id ? { ...stream, [field]: value } : stream
    ));
  };

  const addOneTimePayment = () => {
    const newId = Math.max(...oneTimePayments.map(p => p.id), 0) + 1;
    setOneTimePayments(prev => [...prev, {
      id: newId,
      name: '',
      age: 65,
      amount: 0
    }]);
  };

  const removeOneTimePayment = (id) => {
    setOneTimePayments(prev => prev.filter(payment => payment.id !== id));
  };

  const updateOneTimePayment = (id, field, value) => {
    setOneTimePayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  const calculateRetirement = () => {
    const results = performCalculation(formData, incomeStreams, oneTimePayments);
    onCalculate(results);
  };

  const performCalculation = (data, streams, payments) => {
    const yearlyData = [];
    let currentSavings = data.lumpSumSavings;
    let currentAge = data.currentAge;
    let currentYear = data.currentYear;
    
    const inflationMultiplier = 1 + (data.inflationRate / 100);
    const growthMultiplier = 1 + (data.investmentGrowthRate / 100);
    
    // Calculate totals for summary
    let totalIncomeReceived = 0;
    let totalOneTimePayments = 0;
    let totalExpenses = 0;
    let totalGrowth = 0;
    
    while (currentAge <= data.lifeExpectancy && currentSavings > 0) {
      const yearsFromStart = currentAge - data.currentAge;
      const inflationFactor = Math.pow(inflationMultiplier, yearsFromStart);
      
      // ONLY apply inflation to desired monthly income
      const adjustedDesiredIncome = data.desiredMonthlyIncome * 12 * inflationFactor;
      totalExpenses += adjustedDesiredIncome;
      
      // Income streams are NOT adjusted for inflation (fixed in today's value)
      let totalAnnualIncome = 0;
      streams.forEach(stream => {
        if (currentAge >= stream.startAge) {
          const fixedStreamIncome = stream.monthlyAmount * 12; // No inflation adjustment
          totalAnnualIncome += fixedStreamIncome;
          totalIncomeReceived += fixedStreamIncome;
        }
      });
      
      // One-time payments are NOT adjusted for inflation (fixed in today's value)
      let oneTimePaymentAmount = 0;
      payments.forEach(payment => {
        if (currentAge === payment.age) {
          const fixedPayment = payment.amount; // No inflation adjustment
          oneTimePaymentAmount += fixedPayment;
          totalOneTimePayments += fixedPayment;
        }
      });
      
      const netAnnualExpense = adjustedDesiredIncome - totalAnnualIncome;
      const startingSavings = currentSavings;
      
      // Add one-time payment first
      currentSavings += oneTimePaymentAmount;
      
      // Subtract net expense
      currentSavings -= netAnnualExpense;
      
      // Apply growth
      const growthAmount = currentSavings * (data.investmentGrowthRate / 100);
      currentSavings *= growthMultiplier;
      totalGrowth += growthAmount;
      
      yearlyData.push({
        age: currentAge,
        year: currentYear,
        startingSavings: startingSavings,
        totalIncome: totalAnnualIncome,
        desiredIncome: adjustedDesiredIncome,
        netExpense: netAnnualExpense,
        oneTimePayment: oneTimePaymentAmount,
        growthAmount: growthAmount,
        endingSavings: currentSavings,
        inflationFactor: inflationFactor
      });
      
      if (currentSavings <= 0) break;
      
      currentAge++;
      currentYear++;
    }
    
    const moneyRunsOutAge = currentSavings <= 0 ? currentAge : null;
    const moneyRunsOutYear = currentSavings <= 0 ? currentYear : null;
    
    return {
      moneyRunsOutAge,
      moneyRunsOutYear,
      yearlyData,
      lifeExpectancy: data.lifeExpectancy,
      finalSavings: currentSavings,
      summary: {
        initialSavings: data.lumpSumSavings,
        totalIncomeReceived,
        totalOneTimePayments,
        totalExpenses,
        totalGrowth,
        finalBalance: Math.max(0, currentSavings),
        totalYears: yearlyData.length,
        averageAnnualExpense: totalExpenses / yearlyData.length,
        averageAnnualIncome: totalIncomeReceived / yearlyData.length,
        netCashFlow: totalIncomeReceived + totalOneTimePayments - totalExpenses
      }
    };
  };

  const resetForm = () => {
    setFormData({
      currentAge: 45,
      currentYear: 2025,
      lumpSumSavings: 500000,
      desiredMonthlyIncome: 3500,
      inflationRate: 3.0,
      investmentGrowthRate: 5.0,
      lifeExpectancy: 90
    });
    setIncomeStreams([
      {
        id: 1,
        name: 'State Pension',
        startAge: 67,
        monthlyAmount: 1200
      }
    ]);
    setOneTimePayments([
      {
        id: 1,
        name: 'House Sale',
        age: 70,
        amount: 200000
      }
    ]);
    onReset();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is your current age?
            </label>
            <input
              type="number"
              value={formData.currentAge}
              onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 45"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is the current year?
            </label>
            <input
              type="number"
              value={formData.currentYear}
              onChange={(e) => handleInputChange('currentYear', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2025"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your total current lump sum savings/investments?
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.lumpSumSavings}
              onChange={(e) => handleInputChange('lumpSumSavings', parseFloat(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 500,000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How much money do you need per month in retirement (in today's value)?
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.desiredMonthlyIncome}
              onChange={(e) => handleInputChange('desiredMonthlyIncome', parseFloat(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3,500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💡 This amount will be adjusted for inflation over time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What annual inflation rate should we assume?
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={formData.inflationRate}
                onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3.0"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              💡 Applied only to your monthly expenses
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What annual growth rate do you expect on your investments?
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={formData.investmentGrowthRate}
                onChange={(e) => handleInputChange('investmentGrowthRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5.0"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What age do you estimate your life expectancy to be?
          </label>
          <input
            type="number"
            value={formData.lifeExpectancy}
            onChange={(e) => handleInputChange('lifeExpectancy', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 90"
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Add Future Income Sources (Pensions, etc.)
              </h3>
              <p className="text-sm text-gray-600">
                💡 These amounts are fixed in today's purchasing power (no inflation adjustment)
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addIncomeStream}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Add Income
            </motion.button>
          </div>

          <div className="space-y-4">
            {incomeStreams.map((stream) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-4 rounded-lg border"
              >
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={stream.name}
                    onChange={(e) => updateIncomeStream(stream.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., State Pension"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeIncomeStream(stream.id)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      At what age does this income start?
                    </label>
                    <input
                      type="number"
                      value={stream.startAge}
                      onChange={(e) => updateIncomeStream(stream.id, 'startAge', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 67"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly amount (fixed in today's value)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={stream.monthlyAmount}
                        onChange={(e) => updateIncomeStream(stream.id, 'monthlyAmount', parseFloat(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1,200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Add One-Time Payments (House Sale, Inheritance, etc.)
              </h3>
              <p className="text-sm text-gray-600">
                💡 These amounts are fixed in today's purchasing power (no inflation adjustment)
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addOneTimePayment}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
              Add Payment
            </motion.button>
          </div>

          <div className="space-y-4">
            {oneTimePayments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-50 p-4 rounded-lg border border-purple-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={payment.name}
                    onChange={(e) => updateOneTimePayment(payment.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., House Sale"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeOneTimePayment(payment.id)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      At what age will you receive this payment?
                    </label>
                    <input
                      type="number"
                      value={payment.age}
                      onChange={(e) => updateOneTimePayment(payment.id, 'age', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 70"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment amount (fixed in today's value)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updateOneTimePayment(payment.id, 'amount', parseFloat(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 200,000"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateRetirement}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <SafeIcon icon={FiCalculator} className="w-5 h-5" />
            Calculate
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetForm}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;