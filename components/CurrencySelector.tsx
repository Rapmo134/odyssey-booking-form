import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

type CurrencySelectorProps = {
  currency: string;
  setCurrency: (val: string) => void;
  currencyOptions: { code: string; label: string; rate: number }[];
};

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currency, setCurrency, currencyOptions }) => (
  <div className="mb-6 flex items-center gap-4">
    <label className="text-sm font-semibold text-gray-700">Select currency:</label>
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencyOptions.map(opt => (
          <SelectItem key={opt.code} value={opt.code}>
            {opt.code} - {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default CurrencySelector; 