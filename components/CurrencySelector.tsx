import React from "react";

type CurrencySelectorProps = {
  currency: string;
  setCurrency: (val: string) => void;
  currencyOptions: { code: string; label: string; rate: number }[];
};

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currency, setCurrency, currencyOptions }) => {
  return (
    <div className="mb-6 flex items-center gap-4">
      <label className="text-sm font-semibold text-gray-700">Select currency:</label>
      <select 
        value={currency} 
        onChange={(e) => setCurrency(e.target.value)}
        className="w-64 h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {currencyOptions.map(opt => (
          <option key={opt.code} value={opt.code}>
            {opt.code} - {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector; 