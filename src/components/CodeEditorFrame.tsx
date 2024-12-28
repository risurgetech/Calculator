import React from 'react';
import { Play } from 'lucide-react';
import type { Discount, Variable, CalculationResult } from '../App';

interface CodeEditorFrameProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  variables: Variable[];
  discounts: Discount[];
  selectedRowIndex: number;
  calculationResults: CalculationResult | null;
  setCalculationResults: React.Dispatch<React.SetStateAction<CalculationResult | null>>;
}

const styles = {
  container: {
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  },
  editor: {
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    padding: '15px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    border: '1px solid #404040'
  },
  results: {
    backgroundColor: '#2d2d2d',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px'
  },
  currentValues: {
    backgroundColor: '#363636',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  calculateButton: {
    backgroundColor: '#2ea043',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#3fb950'
    }
  }
};

export default function CodeEditorFrame({
  code,
  setCode,
  variables,
  discounts,
  selectedRowIndex,
  calculationResults,
  setCalculationResults
}: CodeEditorFrameProps) {
  const executeCode = () => {
    try {
      // Prepare variables object
      const variablesObj: Record<string, string> = {};
      variables.forEach(variable => {
        variablesObj[variable.name] = variable.values[selectedRowIndex] || '0';
      });

      // Prepare discounts object
      const discountsObj: Record<string, string> = {};
      discounts.forEach(discount => {
        discountsObj[discount.name] = discount.value;
      });

      // Create function from code string
      const calculateFn = new Function(
        'variables',
        'discounts',
        `
        ${code}
        return calculate(variables, discounts);
        `
      );

      // Execute the function
      const result = calculateFn(variablesObj, discountsObj);
      setCalculationResults(result);
    } catch (error) {
      console.error('Error executing code:', error);
      alert('Error executing code. Check console for details.');
    }
  };

  return (
    <div style={styles.container} className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Code Editor</h2>
        <button
          onClick={executeCode}
          style={styles.calculateButton}
          className="flex items-center gap-1"
        >
          <Play size={16} /> Calculate
        </button>
      </div>

      <div style={styles.currentValues}>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Current Values:</h3>
        <div className="flex gap-2 flex-wrap">
          {variables.map((variable, index) => (
            <div key={index} className="bg-blue-900/20 px-2 py-0.5 rounded text-xs text-gray-200">
              {variable.name}: {variable.values[selectedRowIndex] || '0'}
            </div>
          ))}
          {discounts.map((discount, index) => (
            <div key={index} className="bg-green-900/20 px-2 py-0.5 rounded text-xs text-gray-200">
              {discount.name}: {discount.value}%
            </div>
          ))}
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={styles.editor}
        className="flex-grow p-4 font-mono text-sm"
        spellCheck={false}
      />

      {calculationResults && (
        <div style={styles.results}>
          <h3 className="text-lg font-semibold mb-2 text-white">Results:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-sm text-gray-400">Margin %</div>
              <div className="text-xl font-semibold text-white">
                {calculationResults.marginPercent.toFixed(2)}%
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-sm text-gray-400">Margin Amount</div>
              <div className="text-xl font-semibold text-white">
                ₹ {calculationResults.marginAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}