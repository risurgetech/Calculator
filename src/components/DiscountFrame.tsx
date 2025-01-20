import React from 'react';
import { Plus, X } from 'lucide-react';
import type { Discount } from '../App';

interface DiscountFrameProps {
  discounts: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
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
  addButton: {
    backgroundColor: '#2ea043',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#3fb950'
    }
  },
  removeButton: {
    backgroundColor: '#d73a49',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
    '&:hover': {
      backgroundColor: '#cb2431'
    }
  }
};

export default function DiscountFrame({ discounts, setDiscounts }: DiscountFrameProps) {
  const addDiscount = () => {
    setDiscounts([...discounts, { name: `discount${discounts.length + 1}`, value: '0' }]);
  };

  const removeDiscount = (index: number) => {
    setDiscounts(discounts.filter((_, i) => i !== index));
  };

  const updateDiscount = (index: number, field: 'name' | 'value', value: string) => {
    const newDiscounts = [...discounts];
    newDiscounts[index] = { ...newDiscounts[index], [field]: value };
    setDiscounts(newDiscounts);
  };

  return (
    <div style={styles.container} className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Discounts</h2>
        <button
          onClick={addDiscount}
          style={styles.addButton}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Discount
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <th className="border border-gray-600 p-2 bg-[#2d2d2d]">Name</th>
              <th className="border border-gray-600 p-2 bg-[#2d2d2d]">Value</th>
            </tr>
            {discounts.map((discount, index) => (
              <tr key={index}>
                <td className="border border-gray-600 p-2">
                  <input
                    type="text"
                    value={discount.name}
                    onChange={(e) => updateDiscount(index, 'name', e.target.value)}
                    style={styles.input}
                    className="w-full"
                    placeholder="Name"
                  />
                </td>
                <td className="border border-gray-600 p-2">
                  <input
                    type="number"
                    value={discount.value}
                    onChange={(e) => updateDiscount(index, 'value', e.target.value)}
                    style={styles.input}
                    className="w-full"
                    placeholder="Value"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}