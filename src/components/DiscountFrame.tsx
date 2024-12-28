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
    <div style={styles.container}>
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
      
      <div className="flex gap-4 overflow-x-auto">
        {discounts.map((discount, index) => (
          <div key={index} className="flex flex-col min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={discount.name}
                onChange={(e) => updateDiscount(index, 'name', e.target.value)}
                style={styles.input}
                className="w-full mr-2"
                placeholder="Name"
              />
              <button
                onClick={() => removeDiscount(index)}
                style={styles.removeButton}
              >
                <X size={16} />
              </button>
            </div>
            <input
              type="number"
              value={discount.value}
              onChange={(e) => updateDiscount(index, 'value', e.target.value)}
              style={styles.input}
              placeholder="Value"
            />
          </div>
        ))}
      </div>
    </div>
  );
}