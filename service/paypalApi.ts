import axios from 'axios';
import { PAYPAL_CONFIG } from '@/lib/config';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Create PayPal order
export const createPayPalOrder = (data: {
  booking_code: string;
  amount: number;
  currency: string;
  description: string;
}) => API.post('/booking/paypal/create-order', data);

// Capture PayPal payment
export const capturePayPalPayment = (data: {
  booking_code: string;
  order_id: string;
  payment_id: string;
}) => API.post('/booking/paypal/capture-payment', data);

// Get PayPal order status
export const getPayPalOrderStatus = (orderId: string) => 
  API.get(`/booking/paypal/order-status/${orderId}`);

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
      console.log('PayPal SDK loaded successfully');
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