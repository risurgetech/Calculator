import React from 'react';
import { Plus, X } from 'lucide-react';
import type { Variable } from '../App';

interface VariablesFrameProps {
  variables: Variable[];
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
  selectedRowIndex: number;
  setSelectedRowIndex: React.Dispatch<React.SetStateAction<number>>;
}

const styles = {
  container: {
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    border: '1px solid #404040',
    borderRadius: '4px',
    padding: '8px',
    '&:focus': {
      outline: 'none',
      borderColor: '#58a6ff'
    }
  },
  button: {
    backgroundColor: '#2ea043',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
    '&:hover': {
      backgroundColor: '#3fb950'
    }
  },
  deleteButton: {
    backgroundColor: '#d73a49',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#cb2431'
    }
  }
};

export default function VariablesFrame({
  variables,
  setVariables,
  selectedRowIndex,
  setSelectedRowIndex
}: VariablesFrameProps) {
  const addColumn = () => {
    setVariables([...variables, { name: `var${variables.length + 1}`, values: [] }]);
  };

  const removeColumn = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateColumnName = (index: number, name: string) => {
    const newVariables = [...variables];
    newVariables[index] = { ...newVariables[index], name };
    setVariables(newVariables);
  };

  const addRow = () => {
    const newVariables = variables.map(variable => ({
      ...variable,
      values: [...variable.values, '']
    }));
    setVariables(newVariables);
  };

  const removeRow = (rowIndex: number) => {
    const newVariables = variables.map(variable => ({
      ...variable,
      values: variable.values.filter((_, i) => i !== rowIndex)
    }));
    setVariables(newVariables);
    if (selectedRowIndex >= rowIndex) {
      setSelectedRowIndex(Math.max(0, selectedRowIndex - 1));
    }
  };

  const updateValue = (columnIndex: number, rowIndex: number, value: string) => {
    const newVariables = [...variables];
    newVariables[columnIndex].values[rowIndex] = value;
    setVariables(newVariables);
  };

  const maxRows = variables[0]?.values.length || 0;

  return (
    <div style={styles.container} className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Variables</h2>
        <div className="flex gap-2">
          
          <button
            onClick={addRow}
            style={styles.button}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <table className="w-full border-collapse">
          <tbody>
            {variables.map((variable, columnIndex) => (
              <tr key={columnIndex}>
                <th className="border border-gray-600 p-2 bg-[#2d2d2d]">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => updateColumnName(columnIndex, e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </th>
                {[...Array(maxRows)].map((_, rowIndex) => (
                  <td 
                    key={rowIndex} 
                    className={`border border-gray-600 p-2 ${
                      selectedRowIndex === rowIndex ? 'bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedRowIndex(rowIndex)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={variable.values[rowIndex] || ''}
                        onChange={(e) => updateValue(columnIndex, rowIndex, e.target.value)}
                        style={styles.input}
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {columnIndex === 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRow(rowIndex);
                          }}
                          style={styles.deleteButton}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}