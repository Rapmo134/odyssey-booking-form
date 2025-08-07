"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Calendar, Users, CreditCard, MapPin, User } from 'lucide-react';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData: {
    bookingNumber: string;
    date: string;
    duration: string;
    participants: string;
    totalAmount: string;
    customerName: string;
    hotel: string;
    hotelAddress: string;
    bookingName: string;
    hotelTransfer: string;
    packages: Array<{
      name: string;
      price: number;
    }>;
  };
  isLoading?: boolean;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  bookingData,
  isLoading = false
}: BookingConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Confirm PayPal Payment
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Booking Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Booking Number:</span>
                  <p className="text-lg font-bold text-gray-900">{bookingData.bookingNumber}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <p className="text-gray-900">{bookingData.date}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Duration:</span>
                  <p className="text-gray-900">{bookingData.duration}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Participants:</span>
                  <p className="text-gray-900">{bookingData.participants}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Customer Name:</span>
                  <p className="text-gray-900">{bookingData.customerName}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Hotel:</span>
                  <p className="text-gray-900">{bookingData.hotel}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Hotel Address:</span>
                  <p className="text-gray-900">{bookingData.hotelAddress}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Hotel Transfer:</span>
                  <p className="text-gray-900">{bookingData.hotelTransfer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Selected Packages
            </h3>
            
            <div className="space-y-3">
              {bookingData.packages.map((pkg, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{pkg.name}</span>
                  <span className="text-green-600 font-semibold">${pkg.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Payment Information
            </h3>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                <p className="text-gray-900 font-semibold">PayPal</p>
              </div>
              
              <div className="text-right">
                <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                <p className="text-2xl font-bold text-green-600">{bookingData.totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 mb-1">Important Notice</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Please review all booking details before proceeding</li>
                  <li>• Payment will be processed securely through PayPal</li>
                  <li>• You will be redirected to PayPal to complete the payment</li>
                  <li>• Booking will be confirmed after successful payment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Proceed to PayPal</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 