import axios from 'axios';
import { PAYPAL_CONFIG } from '@/lib/config';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Create booking and PayPal payment
export const createBookingPayPalPayment = (data: {
  booking_no: string;
  date: string;
  type: string;
  agent: string;
  agent_code?: string;
  comm?: number;
  member_code?: string;
  member_type: string;
  promo_no?: string;
  qty: number;
  gross: number;
  disc: number;
  discp: number;
  nett: number;
  usd_amount: number;
  booking_details: Array<{
    code: string;
    name: string;
    price: number;
    qty: number;
    gross: number;
    disc: number;
    discp: number;
    nett: number;
    price_usd: number;
  }>;
  booking_persons?: Array<{
    code: string;
    name: string;
    medical?: string[];
    medical_other?: string;
  }>;
  voucher_code?: string;
  currency?: string;
  company_code?: string;
  user_id?: number;
}) => API.post('/paypal/create-booking-payment', data);

// Execute PayPal payment
export const executePayPalPayment = (data: {
  paymentId: string;
  PayerID: string;
  booking_no: string;
}) => API.post('/paypal/execute-payment', data);

// Get booking payment status
export const getBookingPayPalStatus = (bookingNo: string) => 
  API.get(`/paypal/payment-status/${bookingNo}`);

// Get booking details
export const getBookingDetails = (bookingNo: string) => 
  API.get(`/paypal/booking-details/${bookingNo}`);

// Get payment history
export const getPayPalPaymentHistory = (params?: {
  company_code?: string;
  user_id?: number;
  status?: string;
  booking_no?: string;
  per_page?: number;
}) => API.get('/paypal/payment-history', { params });

// Load PayPal SDK script
export const loadPayPalScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `${PAYPAL_CONFIG.SCRIPT_URL}?client-id=${PAYPAL_CONFIG.CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      // console.log('PayPal SDK loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      reject(new Error('Failed to load PayPal SDK'));
    };
    document.head.appendChild(script);
  });
};

// Initialize PayPal buttons
export const initializePayPalButtons = (
  containerId: string,
  amount: number,
  onApprove: (data: any) => void,
  onError: (error: any) => void
) => {
  if (typeof window !== 'undefined' && (window as any).paypal) {
    const paypal = (window as any).paypal;
    
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toString()
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          onApprove(details);
        });
      },
      onError: (err: any) => {
        onError(err);
      }
    }).render(`#${containerId}`);
  } else {
    console.error('PayPal SDK not loaded');
    onError(new Error('PayPal SDK not loaded'));
  }
}; 