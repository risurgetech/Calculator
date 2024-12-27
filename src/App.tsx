import React, { useState } from 'react';
import DiscountFrame from './components/DiscountFrame';
import VariablesFrame from './components/VariablesFrame';
import CodeEditorFrame from './components/CodeEditorFrame';
import { Plus } from 'lucide-react';

export type Discount = {
  name: string;
  value: string;
};

export type Variable = {
  name: string;
  values: string[];
};

export type CalculationResult = {
  marginPercent: number;
  marginAmount: number;
};

function App() {
  const [discounts, setDiscounts] = useState<Discount[]>([
    { name: 'discount1', value: '0' }
  ]);
  
  const [variables, setVariables] = useState<Variable[]>([
    { name: 'price', values: [] },
    { name: 'cost', values: [] }
  ]);
  
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  
  const [code, setCode] = useState(`// Example: Calculate margin
function calculate(variables, discounts) {
  const price = parseFloat(variables.price);
  const cost = parseFloat(variables.cost);
  const discount1 = parseFloat(discounts.discount1);
  
  const discountedPrice = price * (1 - discount1/100);
  const marginAmt = discountedPrice - cost;
  const marginPct = (marginAmt / discountedPrice) * 100;
  
  return {
    marginPercent: marginPct,
    marginAmount: marginAmt
  };
}`);

  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4">
      <div className="flex flex-col gap-4 w-1/2">
        {/* Top Left Frame - Discounts */}
        <div className="bg-white rounded-lg shadow-md p-4 h-1/3">
          <DiscountFrame 
            discounts={discounts} 
            setDiscounts={setDiscounts} 
          />
        </div>
        
        {/* Bottom Left Frame - Variables */}
        <div className="bg-white rounded-lg shadow-md p-4 h-2/3">
          <VariablesFrame 
            variables={variables}
            setVariables={setVariables}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
          />
        </div>
      </div>
      
      {/* Right Frame - Code Editor */}
      <div className="bg-white rounded-lg shadow-md p-4 w-1/2">
        <CodeEditorFrame 
          code={code}
          setCode={setCode}
          variables={variables}
          discounts={discounts}
          selectedRowIndex={selectedRowIndex}
          calculationResults={calculationResults}
          setCalculationResults={setCalculationResults}
        />
      </div>
    </div>
  );
}

export default App;