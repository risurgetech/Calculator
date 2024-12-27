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
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Code Editor</h2>
        <button
          onClick={executeCode}
          className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Play size={16} /> Calculate
        </button>
      </div>

      <div className="bg-gray-100 p-2 mb-4 rounded">
        <h3 className="text-sm font-medium mb-2">Current Values:</h3>
        <div className="flex gap-2 flex-wrap">
          {variables.map((variable, index) => (
            <div key={index} className="bg-blue-100 px-2 py-1 rounded text-sm">
              {variable.name}: {variable.values[selectedRowIndex] || '0'}
            </div>
          ))}
          {discounts.map((discount, index) => (
            <div key={index} className="bg-green-100 px-2 py-1 rounded text-sm">
              {discount.name}: {discount.value}%
            </div>
          ))}
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-grow p-4 font-mono text-sm border rounded bg-gray-50"
        spellCheck={false}
      />

      {calculationResults && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">Results:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded shadow">
              <div className="text-sm text-gray-600">Margin %</div>
              <div className="text-xl font-semibold">
                {calculationResults.marginPercent.toFixed(2)}%
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="text-sm text-gray-600">Margin Amount</div>
              <div className="text-xl font-semibold">
                ${calculationResults.marginAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}