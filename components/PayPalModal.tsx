"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { loadPayPalScript, initializePayPalButtons } from '@/service/paypalApi';
import { PAYPAL_CONFIG } from '@/lib/config';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingCode: string;
  onSuccess: (paymentDetails: any) => void;
  onError: (error: any) => void;
}

export default function PayPalModal({
  isOpen,
  onClose,
  amount,
  bookingCode,
  onSuccess,
  onError
}: PayPalModalProps) {
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !scriptLoaded) {
      loadPayPalScript()
        .then(() => {
          setScriptLoaded(true);
          setError(null);
        })
        .catch((err) => {
          setError('Failed to load PayPal SDK');
          console.error('PayPal script loading error:', err);
        });
    }
  }, [isOpen, scriptLoaded]);

  useEffect(() => {
    if (isOpen && scriptLoaded) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          initializePayPalButtons(
            'paypal-button-container',
            amount,
            (details) => {
              setIsLoading(true);
              onSuccess(details);
            },
            (err) => {
              setError('PayPal payment failed');
              onError(err);
            }
          );
        } catch (err) {
          setError('Failed to initialize PayPal buttons');
          console.error('PayPal initialization error:', err);
        }
      }, 100);
    }
  }, [isOpen, scriptLoaded, amount, onSuccess, onError]);

  const handleClose = () => {
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>PayPal Payment</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Complete your payment securely with PayPal
            </p>
            <p className="text-lg font-semibold">
              Total Amount: ${amount.toFixed(2)} USD
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">
                Processing payment...
              </span>
            </div>
          ) : approvalUrl ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Click the button below to complete your PayPal payment
                </p>
                <button
                  onClick={() => window.open(approvalUrl, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Complete PayPal Payment
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div id="paypal-button-container" className="min-h-[150px] flex items-center justify-center">
                {!scriptLoaded && (
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Loading PayPal...</p>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>PayPal Client ID: {PAYPAL_CONFIG.CLIENT_ID ? 'Configured' : 'Not configured'}</p>
                <p>Environment: {PAYPAL_CONFIG.IS_PRODUCTION ? 'Production' : 'Sandbox'}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 