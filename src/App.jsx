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
            My Retirement Runway Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Discover how long your savings can sustain your retirement dreams
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
      </div>
    </div>
  );
}

export default App;