import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Calculator from './components/Calculator';
import Results from './components/Results';
import './App.css';

function App() {
  const [results, setResults] = useState(null);

  const handleCalculate = (calculationResults) => {
    setResults(calculationResults);
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mijn Pensioen Runway Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Ontdek hoe lang uw spaargeld uw pensioendromen kan ondersteunen
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Calculator onCalculate={handleCalculate} onReset={handleReset} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Results results={results} />
          </motion.div>
        </div>

        {/* Copyright Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-lg shadow-md p-4 mx-auto max-w-md">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} <span className="font-semibold text-gray-800">Robin Ramp</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Alle rechten voorbehouden
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;