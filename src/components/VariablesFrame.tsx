import React from 'react';
import { Plus, X } from 'lucide-react';
import type { Variable } from '../App';

interface VariablesFrameProps {
  variables: Variable[];
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
  selectedRowIndex: number;
  setSelectedRowIndex: React.Dispatch<React.SetStateAction<number>>;
}

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Variables</h2>
        <div className="flex gap-2">
          <button
            onClick={addColumn}
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            <Plus size={16} /> Add Column
          </button>
          <button
            onClick={addRow}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2"></th>
              {variables.map((variable, columnIndex) => (
                <th key={columnIndex} className="border p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => updateColumnName(columnIndex, e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => removeColumn(columnIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(maxRows)].map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  selectedRowIndex === rowIndex ? 'bg-blue-50' : ''
                } hover:bg-gray-50 cursor-pointer`}
                onClick={() => setSelectedRowIndex(rowIndex)}
              >
                <td className="border p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRow(rowIndex);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </td>
                {variables.map((variable, columnIndex) => (
                  <td key={columnIndex} className="border p-2">
                    <input
                      type="text"
                      value={variable.values[rowIndex] || ''}
                      onChange={(e) =>
                        updateValue(columnIndex, rowIndex, e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    />
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