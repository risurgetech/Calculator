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

// Add new type and state for CSV data
type CSVData = {
  headers: string[];
  rows: string[][];
};

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    minHeight: '100vh',
    padding: '20px',
    color: '#ffffff'
  }
};

const generateSampleCSV = () => {
  const headers = ['code', 'qty', 'free', 'rate', 'discount', 'cost_price', 'cost_price_gst', 'actual_cost_price', 'actual_cost_price_gst', 'gst', 'mrp'];
  const sampleRow = ['SAMPLE001', '10', '1', '100', '10', '80', '85', '75', '80', '18', '120'];
  
  const csvContent = [
    headers.join(','),
    sampleRow.join(','),
  ].join('\n');
  
  return csvContent;
};

const downloadSampleCSV = () => {
  const csvContent = generateSampleCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample_template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function App() {
  const [discounts, setDiscounts] = useState<Discount[]>([
    { name: 'header_discount', value: '0' },
    { name: 'additional_discount', value: '0' },
    { name: 'additional_discount_2', value: '0' },
    { name: 'additional_discount_3', value: '0' },
    { name: 'additional_discount_4', value: '0' }
  ]);
  
  const [variables, setVariables] = useState<Variable[]>([
    { name: 'code', values: [''] },
    { name: 'qty', values: ['0'] },
    { name: 'free', values: ['0'] },
    { name: 'rate', values: ['0'] },
    { name: 'discount', values: ['0'] },
    { name: 'cost_price', values: ['0'] },
    { name: 'cost_price_gst', values: ['0'] },
    { name: 'actual_cost_price', values: ['0'] },
    { name: 'actual_cost_price_gst', values: ['0'] },
    { name: 'gst', values: ['0'] },
    { name: 'mrp', values: ['0'] }
  ]);
  
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  
  const [code, setCode] = useState(`function calculate(variables, discounts) {
      const price = parseFloat(variables.rate);
      const rate = parseFloat(variables.cost_price)
      const header_discount = parseFloat(discounts.header_discount);
      
      const discountedPrice = price * (1 - header_discount/100);
      const marginAmt = discountedPrice - rate;
      const marginPct = (marginAmt / discountedPrice) * 100;
      
      return {
        marginPercent: marginPct,
        marginAmount: marginAmt
      };
    }`);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<CSVData | null>(null);

  // Add function to handle CSV loading
  const handleLoadCSV = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const rows = csvText.split('\n').map(row => 
          row.trim().split(',').map(cell => cell.trim())
        ).filter(row => row.length > 0); // Filter out empty rows
        
        const headers = rows[0];
        const dataRows = rows.slice(1);
        
        // Store CSV data
        setCSVData({
          headers,
          rows: dataRows
        });
        
        // Create variables from CSV headers
        const newVariables = headers.map(header => ({
          name: header.trim(),
          values: dataRows.map(row => row[headers.indexOf(header)] || '')
        }));
        
        setVariables(newVariables);
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <div style={styles.container}>
      <div className="flex h-screen gap-4">
        <div className="flex flex-col gap-4 w-1/2">
          <div className="rounded-lg shadow-md p-4 bg-[#2d2d2d]">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold text-white whitespace-nowrap">Upload Data</h2>
              <button
                onClick={downloadSampleCSV}
                className="text-[#2ea043] hover:text-[#3fb950] text-sm font-semibold flex items-center gap-1"
              >
                Download Sample CSV
              </button>
            </div>
            <div className="flex gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  setSelectedFile(e.target.files?.[0] || null);
                  setCSVData(null);
                }}
                className="flex-1 text-sm text-gray-300 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#2ea043] file:text-white
                  hover:file:bg-[#3fb950]
                  cursor-pointer"
              />
              <button
                onClick={handleLoadCSV}
                disabled={!selectedFile}
                className={`text-white px-4 py-2 rounded-md text-sm font-semibold ${
                  selectedFile 
                    ? 'bg-[#2ea043] hover:bg-[#3fb950] cursor-pointer' 
                    : 'bg-[#2ea043]/50 cursor-not-allowed'
                }`}
              >
                Load Data
              </button>
            </div>
          </div>
          <div className="rounded-lg shadow-md p-4 h-1/3">
            <DiscountFrame 
              discounts={discounts} 
              setDiscounts={setDiscounts} 
            />
          </div>
          
          <div className="rounded-lg shadow-md p-4 h-2/3">
            <VariablesFrame 
              variables={variables}
              setVariables={setVariables}
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
            />
          </div>
        </div>
        
        <div className="rounded-lg shadow-md p-4 w-1/2">
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
    </div>
  );
}

export default App;