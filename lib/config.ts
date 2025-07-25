// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8082',
  TOKEN: process.env.NEXT_PUBLIC_API_TOKEN || '',
  ENDPOINTS: {
    SCHEDULES: process.env.NEXT_PUBLIC_SCHEDULES_ENDPOINT || '/api/v1/booking/schedules',
    MASTER_DATA: process.env.NEXT_PUBLIC_MASTER_DATA_ENDPOINT || '/api/v1/booking/master-data',
    BOOKING: '/api/v1/booking',
    APPLY_VOUCHER: '/api/v1/booking/apply-voucher',
    GENERATE_NUMBER: '/api/v1/booking/generate-number',
    CHECK_DRAFTS: '/api/v1/booking/check-drafts',
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