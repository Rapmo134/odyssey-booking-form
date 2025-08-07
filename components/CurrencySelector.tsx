import React, { useState, useEffect } from "react";
import { fetchExchangeRate, formatIDR, formatUSD } from "@/service/exchangeRateApi";

type CurrencySelectorProps = {
  currency: string;
  setCurrency: (val: string) => void;
  onRateChange?: (rate: number) => void;
  paymentMethod?: string;
  disabled?: boolean;
};

// Currency options - only USD and IDR
const CURRENCY_OPTIONS = [
  { code: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'USD', label: 'US Dollar', symbol: '$' }
];

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  currency, 
  setCurrency, 
  onRateChange,
  paymentMethod,
  disabled = false
}) => {
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'IDR') {
        // IDR is base currency, rate is 1
        setExchangeRate(1);
        onRateChange?.(1);
        setLastUpdated(new Date().toLocaleTimeString());
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchExchangeRate('IDR', currency);
        
        if (result.success && result.rate) {
          setExchangeRate(result.rate);
          onRateChange?.(result.rate);
          setLastUpdated(new Date().toLocaleTimeString());
          
          if (result.error) {
            setError(result.error);
          }
        } else {
          throw new Error('Failed to fetch exchange rate');
        }
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
        setError('Failed to fetch exchange rate, using fallback');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [currency, onRateChange]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-2">
        <label className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">Select currency:</label>
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          disabled={disabled || paymentMethod === 'paypal'}
          className={`w-48 h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            disabled || paymentMethod === 'paypal' ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        >
          {CURRENCY_OPTIONS.map(opt => (
            <option key={opt.code} value={opt.code}>
              {opt.code} - {opt.label}
            </option>
          ))}
        </select>
        
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-600">Loading rate...</span>
          </div>
        )}
        
        {paymentMethod === 'paypal' && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">$</span>
            </div>
            <span className="text-xs text-blue-600 font-medium">USD Only (PayPal)</span>
          </div>
        )}
      </div>

      {/* Exchange Rate Display */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-blue-800">Exchange Rate:</span>
            <div className="text-lg font-bold text-blue-900">
              1 IDR = {exchangeRate.toFixed(6)} {currency}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-blue-700">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            {error && (
              <div className="text-xs text-orange-600 mt-1">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Currency Info */}
      {/* <div className="mt-3 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">IDR:</span>
            <span>Indonesian Rupiah (Base)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">USD:</span>
            <span>US Dollar (Converted)</span>
          </div>
        </div>
      </div> */}

      {/* Example Conversion */}
      {/* <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-2">Example conversion:</div>
        <div className="text-sm">
          <div className="flex justify-between">
            <span>100,000 IDR</span>
            <span>=</span>
            <span>{currency === 'USD' ? formatUSD(100000 * exchangeRate) : formatIDR(100000)}</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CurrencySelector; 