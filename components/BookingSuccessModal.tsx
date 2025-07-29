"use client"

import { useState } from "react"
import { CheckCircle, X, Copy, Download } from "lucide-react"
import { Button } from "./ui/button"

interface BookingSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  bookingNumber: string
  bookingDetails?: {
    date: string
    duration: string
    participants: string
    totalAmount: string
    customerName: string
  }
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  onReset,
  bookingNumber,
  bookingDetails
}: BookingSuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const downloadBookingDetails = () => {
    const details = `
Booking Confirmation
===================
Booking Number: ${bookingNumber}
Date: ${bookingDetails?.date || 'N/A'}
Duration: ${bookingDetails?.duration || 'N/A'}
Participants: ${bookingDetails?.participants || 'N/A'}
Customer: ${bookingDetails?.customerName || 'N/A'}
Total Amount: ${bookingDetails?.totalAmount || 'N/A'}
    `.trim()

    const blob = new Blob([details], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-${bookingNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Successful!
          </h2>
          <p className="text-gray-600">
            Your surf lesson has been confirmed
          </p>
        </div>

        {/* Booking Number */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Booking Number</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {bookingNumber}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Booking Details */}
        {bookingDetails && (
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{bookingDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{bookingDetails.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Participants:</span>
              <span className="font-medium">{bookingDetails.participants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{bookingDetails.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-green-600">{bookingDetails.totalAmount}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={downloadBookingDetails}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download size={16} className="mr-2" />
            Download Details
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Keep Form
            </Button>
            
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              New Booking
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> Please arrive 15 minutes before your scheduled time. 
            Don't forget to bring your booking confirmation!
          </p>
        </div>

        {/* Choice Explanation */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Choose your next action:</strong><br/>
            • <strong>Keep Form:</strong> Close modal and continue with current form data<br/>
            • <strong>New Booking:</strong> Start fresh with a clean form
          </p>
        </div>
      </div>
    </div>
  )
} 