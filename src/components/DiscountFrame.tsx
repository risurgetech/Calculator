import React from 'react';
import { Plus, X } from 'lucide-react';
import type { Discount } from '../App';

interface DiscountFrameProps {
  discounts: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
}

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Discounts</h2>
        <button
          onClick={addDiscount}
          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
                className="border rounded px-2 py-1 w-full mr-2"
                placeholder="Name"
              />
              <button
                onClick={() => removeDiscount(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
            <input
              type="number"
              value={discount.value}
              onChange={(e) => updateDiscount(index, 'value', e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="Value"
            />
          </div>
        ))}
      </div>
    </div>
  );
}