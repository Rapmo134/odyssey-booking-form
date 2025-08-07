import { EXCHANGE_RATE_CONFIG } from '@/lib/config';

// Exchange Rate API Service
export interface ExchangeRateResponse {
  success: boolean;
  rate?: number;
  error?: string;
  timestamp?: string;
}

/**
 * Fetch exchange rate from Exchange Rate API
 */
export const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<ExchangeRateResponse> => {
  try {
    // If base currency is IDR, rate is 1
    if (fromCurrency === 'IDR' && toCurrency === 'IDR') {
      return {
        success: true,
        rate: 1,
        timestamp: new Date().toISOString()
      };
    }

    // Try Exchange Rate API first
    const response = await fetch(`${EXCHANGE_RATE_CONFIG.EXCHANGE_RATE_BASE_URL}/${fromCurrency}`);
    
    if (response.ok) {
      const data = await response.json();
      const rate = data.rates[toCurrency];
      
      if (rate) {
        return {
          success: true,
          rate: rate,
          timestamp: data.time_last_updated_utc
        };
      }
    }

    // Fallback to CurrencyFreaks API
    if (EXCHANGE_RATE_CONFIG.API_KEY) {
      const currencyFreaksResponse = await fetch(
        `${EXCHANGE_RATE_CONFIG.CURRENCY_FREAKS_URL}?apikey=${EXCHANGE_RATE_CONFIG.API_KEY}&base=${fromCurrency}&symbols=${toCurrency}`
      );
      
      if (currencyFreaksResponse.ok) {
        const currencyData = await currencyFreaksResponse.json();
        const rate = parseFloat(currencyData.rates[toCurrency]);
        
        if (rate) {
          return {
            success: true,
            rate: rate,
            timestamp: currencyData.date
          };
        }
      }
    }

    // Use fallback rate if both APIs fail
    const fallbackRate = EXCHANGE_RATE_CONFIG.FALLBACK_RATES[toCurrency as keyof typeof EXCHANGE_RATE_CONFIG.FALLBACK_RATES] || 1;
    
    return {
      success: true,
      rate: fallbackRate,
      timestamp: new Date().toISOString(),
      error: 'Using fallback exchange rate'
    };

  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Use fallback rate on error
    const fallbackRate = EXCHANGE_RATE_CONFIG.FALLBACK_RATES[toCurrency as keyof typeof EXCHANGE_RATE_CONFIG.FALLBACK_RATES] || 1;
    
    return {
      success: true,
      rate: fallbackRate,
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch exchange rate, using fallback'
    };
  }
};

/**
 * Convert amount from one currency to another
 */
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string, rate: number): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  return amount * rate;
};

/**
 * Format currency amount with proper symbol
 */
export const formatCurrency = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return formatter.format(amount);
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    'IDR': 'Rp',
    'USD': '$'
  };
  
  return symbols[currency] || currency;
};

/**
 * Format IDR with proper Indonesian formatting
 */
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format USD with proper US formatting
 */
export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}; 