// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://odyssey.softcomp.io',
  TOKEN: process.env.NEXT_PUBLIC_API_TOKEN || '',
  ENDPOINTS: {
    SCHEDULES: process.env.NEXT_PUBLIC_SCHEDULES_ENDPOINT || '/api/v1/booking/schedules',
    MASTER_DATA: process.env.NEXT_PUBLIC_MASTER_DATA_ENDPOINT || '/api/v1/booking/master-data',
    BOOKING: '/api/v1/booking',
    WITHOUT_PAYMENT: '/api/v1/booking/without-payment',
    APPLY_VOUCHER: '/api/v1/booking/apply-voucher',
    GENERATE_NUMBER: '/api/v1/booking/generate-number',
    CHECK_DRAFTS: '/api/v1/booking/check-drafts',
    PAYMENT_STATUS: '/api/v1/booking/payment/status',
    PAYMENT_POLL: '/api/v1/booking/payment/poll',
    UPDATE_PAYMENT_STATUS: '/api/v1/booking/update-payment-status',
  }
};

// Midtrans Configuration
export const MIDTRANS_CONFIG = {
  CLIENT_KEY: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
  SERVER_KEY: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || '',
  IS_PRODUCTION: process.env.NEXT_PUBLIC_MIDTRANS_PRODUCTION === 'true',
  BASE_URL: process.env.NEXT_PUBLIC_MIDTRANS_PRODUCTION === 'true' 
    ? 'https://app.midtrans.com' 
    : 'https://app.sandbox.midtrans.com'
};

// PayPal Configuration
export const PAYPAL_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  IS_PRODUCTION: process.env.NEXT_PUBLIC_PAYPAL_PRODUCTION === 'true',
  BASE_URL: process.env.NEXT_PUBLIC_PAYPAL_PRODUCTION === 'true'
    ? 'https://www.paypal.com'
    : 'https://www.sandbox.paypal.com',
  SCRIPT_URL: 'https://www.paypal.com/sdk/js'
};

// Exchange Rate Configuration
export const EXCHANGE_RATE_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || '',
  EXCHANGE_RATE_BASE_URL: 'https://api.exchangerate-api.com/v4/latest',
  CURRENCY_FREAKS_URL: 'https://api.currencyfreaks.com/v2.0/rates',
  FALLBACK_RATES: {
    USD: 0.000065, // 1 IDR = 0.000065 USD (approximate)
    IDR: 1
  }
};

// Build full URL for endpoints
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Get schedules URL
export const getSchedulesUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.SCHEDULES);
};

// Get master data URL
export const getMasterDataUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DATA);
};

// Get booking URL
export const getBookingUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.BOOKING);
};

// Get without payment URL (for Midtrans)
export const getWithoutPaymentUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.WITHOUT_PAYMENT);
};

// Get apply voucher URL
export const getApplyVoucherUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.APPLY_VOUCHER);
};

// Get generate number URL
export const getGenerateNumberUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_NUMBER);
};

// Get check drafts URL
export const getCheckDraftsUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.CHECK_DRAFTS);
};

// Get payment status URL
export const getPaymentStatusUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_STATUS);
};

// Get update payment status URL
export const getUpdatePaymentStatusUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PAYMENT_STATUS);
};

// Get payment poll URL
export const getPaymentPollUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_POLL);
};