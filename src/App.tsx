import React, { useState } from 'react';
import DiscountFrame from './components/DiscountFrame';
import VariablesFrame from './components/VariablesFrame';
import CodeEditorFrame from './components/CodeEditorFrame';

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
  const headers = ['code', 'qty', 'free', 'selling_price', 'discount', 'cost_price', 'cost_price_gst', 'actual_cost_price', 'actual_cost_price_gst', 'gst', 'mrp', 'new_selling_price'];
  const sampleRow = ['SAMPLE001', '10', '1', '100', '10', '80', '85', '75', '80', '18', '120', ''];
  
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
    { name: 'billing_on', value: '0' },
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
    { name: 'selling_price', values: ['0'] },
    { name: 'discount', values: ['0'] },
    { name: 'cost_price', values: ['0'] },
    { name: 'cost_price_gst', values: ['0'] },
    { name: 'actual_cost_price', values: ['0'] },
    { name: 'actual_cost_price_gst', values: ['0'] },
    { name: 'gst', values: ['0'] },
    { name: 'mrp', values: ['0'] },
    { name: 'new_selling_price', values: [''] }
  ]);
  
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  
  const [code, setCode] = useState(`function calculate(variables, discounts) {
    let our_margin = 0;
    let mar_amount = 0;
    let acp_margin = 0;
    let acp_mar_amount = 0;
    let ret_margin = 0;
    let gst = variables?.gst ?? 0
    let gst_value = 0;
    let gst_div = 1;

    if (gst == 5) gst_div = 1.05;
    else if (gst == 12) gst_div = 1.12;
    else if (gst == 18) gst_div = 1.18;
    else if (gst == 28) gst_div = 1.28;

    let mrp = parseFloat(variables?.mrp ?? 0);
    let cp = variables.cost_price === '' ? 0.0 : parseFloat(variables.cost_price);
    let acp =
      variables.actual_cost_price == '' ? 0.0 : parseFloat(variables.actual_cost_price);
    let cp_gst = cp + (cp * gst) / 100;
    let acp_gst = acp + (acp * gst) / 100;

    let sp = parseFloat(variables.selling_price)

    let quantity =
      variables.qty === '' ? 0.0 : parseFloat(variables.qty);
    let free = variables.free === '' ? 0.0 : parseFloat(variables.free);

    let disc =
      variables.discount === '' || variables.discount == null
        ? 0.0
        : parseFloat(variables.discount);
    let overall_disc =
      (discounts?.overall_disc ?? '') === ''
        ? 0.0
        : parseFloat(discounts?.overall_disc || 0);
    let additional_disc_1 =
      (discounts?.additional_disc_1 ?? '') === ''
        ? 0.0
        : parseFloat(discounts?.additional_disc_1 || 0);
    let additional_disc_2 =
      (discounts?.additional_disc_2 ?? '') === ''
        ? 0.0
        : parseFloat(discounts?.additional_disc_2 || 0);
    let additional_disc_3 =
      (discounts?.additional_disc_3 ?? '') === ''
        ? 0.0
        : parseFloat(discounts?.additional_disc_3 || 0);
    let additional_disc_4 =
      (discounts?.additional_disc_4 ?? '') === ''
        ? 0.0
        : parseFloat(discounts?.additional_disc_4 || 0);

    let sp_gst = (sp * gst_div).toFixed(2);
    let asp = sp - (sp * disc) / 100;
    let asp_overall_disc = asp - (asp * overall_disc) / 100;
    asp_overall_disc = parseFloat(
      (
        asp_overall_disc -
        (asp_overall_disc * additional_disc_1) / 100
      ).toFixed(2),
    );
    asp_overall_disc = parseFloat(
      (
        asp_overall_disc -
        (asp_overall_disc * additional_disc_2) / 100
      ).toFixed(2),
    );
    asp_overall_disc = parseFloat(
      (
        asp_overall_disc -
        (asp_overall_disc * additional_disc_3) / 100
      ).toFixed(2),
    );
    asp_overall_disc = parseFloat(
      (
        asp_overall_disc -
        (asp_overall_disc * additional_disc_4) / 100
      ).toFixed(2),
    );

    let asp_margin = (asp_overall_disc * quantity) / (quantity + free);
    let asp_margin_gst = asp_margin * gst_div;
    let product_value = (sp * quantity).toFixed(2);
    if (['3', '8', '9', '10'].includes(discounts?.billing_on)) {
      gst_value = ((((asp / gst_div) * gst) / 100) * quantity).toFixed(2);
      our_margin =
        cp_gst == 0 || asp_margin == 0
          ? (0).toFixed(2)
          : (((asp_margin - cp_gst) / asp_margin) * 100).toFixed(2);
      mar_amount = ((asp_margin - cp_gst) * (quantity + free)).toFixed(2);
      acp_margin =
        acp_gst == 0 || asp_margin == 0
          ? (0).toFixed(2)
          : (((asp_margin - acp_gst) / asp_margin) * 100).toFixed(2);
      acp_mar_amount = ((asp_margin - acp_gst) * (quantity + free)).toFixed(
        2,
      );
      ret_margin =
        mrp == 0
          ? (0).toFixed(2)
          : (((mrp - asp_margin) / mrp) * 100).toFixed(2);
    } else {
      gst_value = (((asp * gst) / 100) * quantity).toFixed(2);
      our_margin =
        cp == 0 || asp_margin == 0
          ? (0).toFixed(2)
          : (((asp_margin - cp) / asp_margin) * 100).toFixed(2);
      mar_amount = ((asp_margin - cp) * (quantity + free)).toFixed(2);
      acp_margin =
        acp == 0 || asp_margin == 0
          ? (0).toFixed(2)
          : (((asp_margin - acp) / asp_margin) * 100).toFixed(2);
      acp_mar_amount = ((asp_margin - acp) * (quantity + free)).toFixed(2);
      ret_margin =
        mrp == 0
          ? (0).toFixed(2)
          : (((mrp - asp_margin_gst) / mrp) * 100).toFixed(2);
    }

    // let acp_mar_amount = ((asp_margin - acp) * (quantity + free)).toFixed(2);
    // let mar_amount = ((asp_margin - cp) * (quantity + free)).toFixed(2);

    let disc_amount = ((sp - asp) * quantity).toFixed(2);
      
      return {
        marginPercent: our_margin,
        marginAmount: mar_amount
      };
    }`);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      <div className="flex flex-col h-screen gap-4">
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

        <div className="flex gap-4 flex-1">
          <div className="w-1/2">
            <div className="flex gap-4">
              <div className="rounded-lg shadow-md p-4 w-1/2">
                <DiscountFrame 
                  discounts={discounts} 
                  setDiscounts={setDiscounts} 
                />
              </div>
              
              <div className="rounded-lg shadow-md p-4 w-1/2">
                <VariablesFrame 
                  variables={variables}
                  setVariables={setVariables}
                  selectedRowIndex={selectedRowIndex}
                  setSelectedRowIndex={setSelectedRowIndex}
                />
              </div>
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
    </div>
  );
}

export default App;