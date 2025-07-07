import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiCalculator, FiRefreshCw, FiDollarSign, FiTrendingUp, FiUsers, FiUser, FiUserPlus, FiUserMinus } = FiIcons;

const Calculator = ({ onCalculate, onReset }) => {
  const [hasPartner, setHasPartner] = useState(false);
  
  const [formData, setFormData] = useState({
    currentAge: 52,
    currentYear: 2025,
    lumpSumSavings: 500000,
    desiredMonthlyIncome: 3500,
    inflationRate: 2.0,
    investmentGrowthRate: 5.0,
    lifeExpectancy: 85
  });

  const [partnerData, setPartnerData] = useState({
    currentAge: 50,
    lumpSumSavings: 300000,
    desiredMonthlyIncome: 2500,
    lifeExpectancy: 87
  });

  const [incomeStreams, setIncomeStreams] = useState([
    { id: 1, name: 'Staatspensioen', startAge: 67, monthlyAmount: 1200, owner: 'self' }
  ]);

  const [partnerIncomeStreams, setPartnerIncomeStreams] = useState([
    { id: 1, name: 'Staatspensioen Partner', startAge: 67, monthlyAmount: 1200, owner: 'partner' }
  ]);

  const [oneTimePayments, setOneTimePayments] = useState([
    { id: 1, name: 'Huis Verkoop', age: 70, amount: 200000, owner: 'self' }
  ]);

  const [partnerOneTimePayments, setPartnerOneTimePayments] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePartnerInputChange = (field, value) => {
    setPartnerData(prev => ({ ...prev, [field]: value }));
  };

  const addIncomeStream = () => {
    const newId = Math.max(...incomeStreams.map(s => s.id), 0) + 1;
    setIncomeStreams(prev => [...prev, { id: newId, name: '', startAge: 67, monthlyAmount: 0, owner: 'self' }]);
  };

  const addPartnerIncomeStream = () => {
    const newId = Math.max(...partnerIncomeStreams.map(s => s.id), 0) + 1;
    setPartnerIncomeStreams(prev => [...prev, { id: newId, name: '', startAge: 67, monthlyAmount: 0, owner: 'partner' }]);
  };

  const removeIncomeStream = (id) => {
    setIncomeStreams(prev => prev.filter(stream => stream.id !== id));
  };

  const removePartnerIncomeStream = (id) => {
    setPartnerIncomeStreams(prev => prev.filter(stream => stream.id !== id));
  };

  const updateIncomeStream = (id, field, value) => {
    setIncomeStreams(prev => prev.map(stream => 
      stream.id === id ? { ...stream, [field]: value } : stream
    ));
  };

  const updatePartnerIncomeStream = (id, field, value) => {
    setPartnerIncomeStreams(prev => prev.map(stream => 
      stream.id === id ? { ...stream, [field]: value } : stream
    ));
  };

  const addOneTimePayment = () => {
    const newId = Math.max(...oneTimePayments.map(p => p.id), 0) + 1;
    setOneTimePayments(prev => [...prev, { id: newId, name: '', age: 65, amount: 0, owner: 'self' }]);
  };

  const addPartnerOneTimePayment = () => {
    const newId = Math.max(...partnerOneTimePayments.map(p => p.id), 0) + 1;
    setPartnerOneTimePayments(prev => [...prev, { id: newId, name: '', age: 65, amount: 0, owner: 'partner' }]);
  };

  const removeOneTimePayment = (id) => {
    setOneTimePayments(prev => prev.filter(payment => payment.id !== id));
  };

  const removePartnerOneTimePayment = (id) => {
    setPartnerOneTimePayments(prev => prev.filter(payment => payment.id !== id));
  };

  const updateOneTimePayment = (id, field, value) => {
    setOneTimePayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  const updatePartnerOneTimePayment = (id, field, value) => {
    setPartnerOneTimePayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  const calculateRetirement = () => {
    const combinedData = {
      ...formData,
      hasPartner,
      partnerData: hasPartner ? partnerData : null,
      combinedLumpSum: formData.lumpSumSavings + (hasPartner ? partnerData.lumpSumSavings : 0),
      combinedDesiredIncome: formData.desiredMonthlyIncome + (hasPartner ? partnerData.desiredMonthlyIncome : 0),
      combinedLifeExpectancy: hasPartner ? Math.max(formData.lifeExpectancy, partnerData.lifeExpectancy) : formData.lifeExpectancy
    };

    const allIncomeStreams = hasPartner ? 
      [...incomeStreams, ...partnerIncomeStreams] : 
      incomeStreams;

    const allOneTimePayments = hasPartner ? 
      [...oneTimePayments, ...partnerOneTimePayments] : 
      oneTimePayments;

    const results = performCalculation(combinedData, allIncomeStreams, allOneTimePayments);
    onCalculate(results);
  };

  const performCalculation = (data, streams, payments) => {
    const yearlyData = [];
    let currentSavings = data.combinedLumpSum;
    let currentAge = data.currentAge;
    let partnerAge = data.hasPartner ? data.partnerData.currentAge : null;
    let currentYear = data.currentYear;
    const inflationMultiplier = 1 + (data.inflationRate / 100);
    const growthMultiplier = 1 + (data.investmentGrowthRate / 100);

    // Calculate totals for summary
    let totalIncomeReceived = 0;
    let totalOneTimePayments = 0;
    let totalExpenses = 0;
    let totalGrowth = 0;

    while (currentAge <= data.combinedLifeExpectancy && currentSavings > 0) {
      const yearsFromStart = currentAge - data.currentAge;
      const inflationFactor = Math.pow(inflationMultiplier, yearsFromStart);

      // Calculate combined desired income with inflation
      let adjustedDesiredIncome = 0;
      
      // Add main person's income if still alive
      if (currentAge <= data.lifeExpectancy) {
        adjustedDesiredIncome += data.desiredMonthlyIncome * 12 * inflationFactor;
      }
      
      // Add partner's income if partner exists and still alive
      if (data.hasPartner && partnerAge <= data.partnerData.lifeExpectancy) {
        adjustedDesiredIncome += data.partnerData.desiredMonthlyIncome * 12 * inflationFactor;
      }

      totalExpenses += adjustedDesiredIncome;

      // Calculate income streams
      let totalAnnualIncome = 0;
      streams.forEach(stream => {
        let streamAge = stream.owner === 'self' ? currentAge : partnerAge;
        let streamLifeExpectancy = stream.owner === 'self' ? data.lifeExpectancy : data.partnerData.lifeExpectancy;
        
        if (streamAge >= stream.startAge && streamAge <= streamLifeExpectancy) {
          const fixedStreamIncome = stream.monthlyAmount * 12;
          totalAnnualIncome += fixedStreamIncome;
          totalIncomeReceived += fixedStreamIncome;
        }
      });

      // Calculate one-time payments
      let oneTimePaymentAmount = 0;
      payments.forEach(payment => {
        let paymentAge = payment.owner === 'self' ? currentAge : partnerAge;
        
        if (paymentAge === payment.age) {
          const fixedPayment = payment.amount;
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
        partnerAge: partnerAge,
        year: currentYear,
        startingSavings: startingSavings,
        totalIncome: totalAnnualIncome,
        desiredIncome: adjustedDesiredIncome,
        netExpense: netAnnualExpense,
        oneTimePayment: oneTimePaymentAmount,
        growthAmount: growthAmount,
        endingSavings: currentSavings,
        inflationFactor: inflationFactor,
        mainPersonAlive: currentAge <= data.lifeExpectancy,
        partnerAlive: data.hasPartner ? partnerAge <= data.partnerData.lifeExpectancy : false
      });

      if (currentSavings <= 0) break;

      currentAge++;
      if (partnerAge !== null) partnerAge++;
      currentYear++;
    }

    const moneyRunsOutAge = currentSavings <= 0 ? currentAge : null;
    const moneyRunsOutYear = currentSavings <= 0 ? currentYear : null;

    return {
      moneyRunsOutAge,
      moneyRunsOutYear,
      yearlyData,
      lifeExpectancy: data.combinedLifeExpectancy,
      finalSavings: currentSavings,
      formData: data,
      incomeStreams: streams,
      oneTimePayments: payments,
      hasPartner: data.hasPartner,
      summary: {
        initialSavings: data.combinedLumpSum,
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
    setHasPartner(false);
    setFormData({
      currentAge: 52,
      currentYear: 2025,
      lumpSumSavings: 500000,
      desiredMonthlyIncome: 3500,
      inflationRate: 2.0,
      investmentGrowthRate: 5.0,
      lifeExpectancy: 85
    });
    setPartnerData({
      currentAge: 50,
      lumpSumSavings: 300000,
      desiredMonthlyIncome: 2500,
      lifeExpectancy: 87
    });
    setIncomeStreams([
      { id: 1, name: 'Staatspensioen', startAge: 67, monthlyAmount: 1200, owner: 'self' }
    ]);
    setPartnerIncomeStreams([
      { id: 1, name: 'Staatspensioen Partner', startAge: 67, monthlyAmount: 1200, owner: 'partner' }
    ]);
    setOneTimePayments([
      { id: 1, name: 'Huis Verkoop', age: 70, amount: 200000, owner: 'self' }
    ]);
    setPartnerOneTimePayments([]);
    onReset();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Uw Informatie</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setHasPartner(!hasPartner)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasPartner 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <SafeIcon icon={hasPartner ? FiUserMinus : FiUserPlus} className="w-4 h-4" />
          {hasPartner ? 'Partner Verwijderen' : 'Partner Toevoegen'}
        </motion.button>
      </div>
      
      <div className="space-y-6">
        {/* Main Person Section */}
        <div className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiUser} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Hoofdpersoon</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wat is uw huidige leeftijd?
              </label>
              <input
                type="number"
                value={formData.currentAge}
                onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="bijv. 52"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wat is het huidige jaar?
              </label>
              <input
                type="number"
                value={formData.currentYear}
                onChange={(e) => handleInputChange('currentYear', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="bijv. 2025"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uw totale huidige spaargeld/investeringen
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  value={formData.lumpSumSavings}
                  onChange={(e) => handleInputChange('lumpSumSavings', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="bijv. 500.000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uw gewenste maandelijkse inkomen
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  value={formData.desiredMonthlyIncome}
                  onChange={(e) => handleInputChange('desiredMonthlyIncome', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="bijv. 3.500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uw geschatte levensverwachting
            </label>
            <input
              type="number"
              value={formData.lifeExpectancy}
              onChange={(e) => handleInputChange('lifeExpectancy', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="bijv. 85"
            />
          </div>
        </div>

        {/* Partner Section */}
        {hasPartner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-l-4 border-purple-500 pl-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Partner</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huidige leeftijd partner
                </label>
                <input
                  type="number"
                  value={partnerData.currentAge}
                  onChange={(e) => handlePartnerInputChange('currentAge', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="bijv. 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner's spaargeld/investeringen
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input
                    type="number"
                    value={partnerData.lumpSumSavings}
                    onChange={(e) => handlePartnerInputChange('lumpSumSavings', parseFloat(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="bijv. 300.000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner's gewenste maandelijkse inkomen
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input
                    type="number"
                    value={partnerData.desiredMonthlyIncome}
                    onChange={(e) => handlePartnerInputChange('desiredMonthlyIncome', parseFloat(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="bijv. 2.500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner's geschatte levensverwachting
                </label>
                <input
                  type="number"
                  value={partnerData.lifeExpectancy}
                  onChange={(e) => handlePartnerInputChange('lifeExpectancy', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="bijv. 87"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Shared Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gedeelde Instellingen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welke jaarlijkse inflatie moeten we aannemen?
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.inflationRate}
                  onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="bijv. 2.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welke jaarlijkse groei verwacht u op investeringen?
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.investmentGrowthRate}
                  onChange={(e) => handleInputChange('investmentGrowthRate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="bijv. 5.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Income Streams */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Uw Toekomstige Inkomstenbronnen
              </h3>
              <p className="text-sm text-gray-600">
                💡 Deze bedragen zijn vastgesteld in de huidige koopkracht
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addIncomeStream}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Inkomen Toevoegen
            </motion.button>
          </div>

          <div className="space-y-4">
            {incomeStreams.map((stream) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={stream.name}
                    onChange={(e) => updateIncomeStream(stream.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="bijv. Staatspensioen"
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
                      Op welke leeftijd begint dit inkomen?
                    </label>
                    <input
                      type="number"
                      value={stream.startAge}
                      onChange={(e) => updateIncomeStream(stream.id, 'startAge', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="bijv. 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maandelijks bedrag
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">€</span>
                      <input
                        type="number"
                        value={stream.monthlyAmount}
                        onChange={(e) => updateIncomeStream(stream.id, 'monthlyAmount', parseFloat(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="bijv. 1.200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partner Income Streams */}
        {hasPartner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t pt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Partner's Toekomstige Inkomstenbronnen
                </h3>
                <p className="text-sm text-gray-600">
                  💡 Deze bedragen zijn vastgesteld in de huidige koopkracht
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addPartnerIncomeStream}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                Partner Inkomen Toevoegen
              </motion.button>
            </div>

            <div className="space-y-4">
              {partnerIncomeStreams.map((stream) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-50 p-4 rounded-lg border border-purple-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={stream.name}
                      onChange={(e) => updatePartnerIncomeStream(stream.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="bijv. Staatspensioen Partner"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removePartnerIncomeStream(stream.id)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Op welke leeftijd begint dit inkomen?
                      </label>
                      <input
                        type="number"
                        value={stream.startAge}
                        onChange={(e) => updatePartnerIncomeStream(stream.id, 'startAge', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="bijv. 67"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maandelijks bedrag
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">€</span>
                        <input
                          type="number"
                          value={stream.monthlyAmount}
                          onChange={(e) => updatePartnerIncomeStream(stream.id, 'monthlyAmount', parseFloat(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="bijv. 1.200"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* One-time Payments */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Uw Eenmalige Betalingen
              </h3>
              <p className="text-sm text-gray-600">
                💡 Deze bedragen zijn vastgesteld in de huidige koopkracht
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addOneTimePayment}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
              Betaling Toevoegen
            </motion.button>
          </div>

          <div className="space-y-4">
            {oneTimePayments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 p-4 rounded-lg border border-orange-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={payment.name}
                    onChange={(e) => updateOneTimePayment(payment.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="bijv. Huis Verkoop"
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
                      Op welke leeftijd ontvangt u deze betaling?
                    </label>
                    <input
                      type="number"
                      value={payment.age}
                      onChange={(e) => updateOneTimePayment(payment.id, 'age', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="bijv. 70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Betalingsbedrag
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">€</span>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updateOneTimePayment(payment.id, 'amount', parseFloat(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="bijv. 200.000"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partner One-time Payments */}
        {hasPartner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t pt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Partner's Eenmalige Betalingen
                </h3>
                <p className="text-sm text-gray-600">
                  💡 Deze bedragen zijn vastgesteld in de huidige koopkracht
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addPartnerOneTimePayment}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
              >
                <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
                Partner Betaling Toevoegen
              </motion.button>
            </div>

            <div className="space-y-4">
              {partnerOneTimePayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={payment.name}
                      onChange={(e) => updatePartnerOneTimePayment(payment.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="bijv. Erfenis Partner"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removePartnerOneTimePayment(payment.id)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Op welke leeftijd ontvangt partner deze betaling?
                      </label>
                      <input
                        type="number"
                        value={payment.age}
                        onChange={(e) => updatePartnerOneTimePayment(payment.id, 'age', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="bijv. 70"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Betalingsbedrag
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">€</span>
                        <input
                          type="number"
                          value={payment.amount}
                          onChange={(e) => updatePartnerOneTimePayment(payment.id, 'amount', parseFloat(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="bijv. 150.000"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Combined Summary */}
        {hasPartner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t pt-6 bg-gray-50 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Gecombineerde Samenvatting</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Totaal Spaargeld</p>
                <p className="text-xl font-bold text-blue-600">
                  €{(formData.lumpSumSavings + partnerData.lumpSumSavings).toLocaleString('nl-NL')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Totaal Gewenst Inkomen</p>
                <p className="text-xl font-bold text-green-600">
                  €{(formData.desiredMonthlyIncome + partnerData.desiredMonthlyIncome).toLocaleString('nl-NL')}/maand
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Langste Levensverwachting</p>
                <p className="text-xl font-bold text-purple-600">
                  {Math.max(formData.lifeExpectancy, partnerData.lifeExpectancy)} jaar
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-4 pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateRetirement}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <SafeIcon icon={FiCalculator} className="w-5 h-5" />
            Berekenen
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetForm}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Resetten
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;