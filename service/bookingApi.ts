import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Get master data (packages, agents, members, banks)
export const getBookingData = () => API.get('/booking');

// Get master data (packages, agents, members, banks)
export const getMasterData = () => API.get('/booking/master-data');

// Get recommended packages based on user criteria
export const getRecommendedPackages = (criteria: {
  activities: string[];
  duration: string;
  adultCount: number;
  childrenCount: number;
  levels: string[];
}) => API.post('/booking/recommended-packages', criteria);

// Generate unique booking number
export const generateBookingNumber = () => API.get('/booking/generate-number');

// Submit booking data
export const postBooking = (data: any) => API.post('/booking', data);

// Apply voucher
export const applyVoucher = (data: { voucher_code: string; gross_amount: number }) =>
  API.post('/booking/apply-voucher', data);

// Check drafts (for reloading unfinished bookings)
export const checkDrafts = (data: { agent_id: string }) => API.post('/booking/check-drafts', data);

// Send email manually
export const sendEmail = (data: { booking_code: string; email: string }) =>
  API.post('/booking/send-email', data);

// Send email automatically
export const sendEmailAuto = (data: { booking_code: string }) =>
  API.post('/booking/send-email-auto', data);

// Cancel a booking
export const cancelBooking = (data: { booking_code: string }) =>
  API.post('/booking/cancel', data);