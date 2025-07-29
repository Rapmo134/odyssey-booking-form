# Payment Status Checking Feature

## Overview

Fitur ini menambahkan kemampuan untuk mengecek status pembayaran secara otomatis setiap 5 detik setelah user melakukan pembayaran melalui Midtrans.

## Features

### 🔄 **Automatic Status Checking**
- ✅ **Check setiap 5 detik** setelah payment dimulai
- ✅ **Real-time status updates** di modal payment
- ✅ **Auto-stop** ketika payment completed/failed
- ✅ **Manual stop** dengan tombol cancel

### 📊 **Status Types**
- **`pending`** - Payment sedang diproses
- **`success`** - Payment berhasil
- **`settlement`** - Payment sudah diselesaikan
- **`expired`** - Payment expired
- **`deny`** - Payment ditolak

### 🎯 **UI Components**

#### **Payment Status Indicator**
```jsx
{isCheckingPayment && (
  <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="font-semibold text-blue-800">Checking Payment Status</span>
    </div>
    {/* Status messages */}
  </div>
)}
```

#### **Status Messages**
- ⏳ **Pending**: "Payment is being processed..."
- ✅ **Success**: "Payment completed successfully!"
- ❌ **Expired**: "Payment expired. Please try again."
- ❌ **Deny**: "Payment was denied. Please try again."

## Implementation Details

### **State Management**
```typescript
const [paymentStatus, setPaymentStatus] = useState<string>('');
const [isCheckingPayment, setIsCheckingPayment] = useState(false);
const [paymentCheckInterval, setPaymentCheckInterval] = useState<NodeJS.Timeout | null>(null);
```

### **API Endpoint**
```typescript
// POST /api/v1/booking/payment-status
{
  "booking_number": "BK-20241201-0001"
}

// Response
{
  "success": true,
  "data": {
    "status": "success" | "pending" | "expired" | "deny"
  }
}
```

### **Check Function**
```typescript
const checkPaymentStatus = async (bookingNumber: string) => {
  const response = await fetch(getPaymentStatusUrl(), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ booking_number: bookingNumber })
  });
  
  const data = await response.json();
  setPaymentStatus(data.data.status);
  
  // Auto-stop on completion
  if (status === 'success' || status === 'settlement') {
    stopPaymentChecking();
    // Show success modal
  }
};
```

### **Start/Stop Functions**
```typescript
const startPaymentChecking = (bookingNumber: string) => {
  setIsCheckingPayment(true);
  setPaymentStatus('pending');
  
  // Check immediately
  checkPaymentStatus(bookingNumber);
  
  // Set up interval
  const interval = setInterval(() => {
    checkPaymentStatus(bookingNumber);
  }, 5000);
  
  setPaymentCheckInterval(interval);
};

const stopPaymentChecking = () => {
  setIsCheckingPayment(false);
  setPaymentStatus('');
  if (paymentCheckInterval) {
    clearInterval(paymentCheckInterval);
    setPaymentCheckInterval(null);
  }
};
```

## Integration Flow

### **1. Payment Initiation**
```typescript
// User clicks "Proceed to Payment"
handleMidtransPayment(snapToken);

// Midtrans Snap opens
// User completes payment
```

### **2. Status Checking Starts**
```typescript
// onSuccess callback
onSuccess: function(result: any) {
  const bookingNumber = draftData?.booking_number;
  startPaymentChecking(bookingNumber);
}

// onPending callback  
onPending: function(result: any) {
  const bookingNumber = draftData?.booking_number;
  startPaymentChecking(bookingNumber);
}
```

### **3. Continuous Monitoring**
```typescript
// Every 5 seconds
setInterval(() => {
  checkPaymentStatus(bookingNumber);
}, 5000);
```

### **4. Auto-Stop Conditions**
```typescript
if (status === 'success' || status === 'settlement') {
  stopPaymentChecking();
  showSuccessModal();
} else if (status === 'expired' || status === 'deny') {
  stopPaymentChecking();
  showErrorModal();
}
```

## Error Handling

### **Network Errors**
```typescript
catch (error) {
  console.error('Error checking payment status:', error);
  // Continue checking, don't stop
}
```

### **API Errors**
```typescript
if (!data.success) {
  console.error('Failed to check payment status:', data.message);
  // Continue checking, don't stop
}
```

### **Cleanup**
```typescript
useEffect(() => {
  return () => {
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
    }
  };
}, [paymentCheckInterval]);
```

## Configuration

### **Environment Variables**
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8082
NEXT_PUBLIC_API_TOKEN=your_token_here

# Payment Status Endpoint
NEXT_PUBLIC_PAYMENT_STATUS_ENDPOINT=/api/v1/booking/payment-status
```

### **API Endpoint**
```typescript
// lib/config.ts
PAYMENT_STATUS: '/api/v1/booking/payment-status'

// Helper function
export const getPaymentStatusUrl = () => {
  return getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_STATUS);
};
```

## Testing

### **Manual Testing**
1. **Start booking process**
2. **Select Midtrans payment**
3. **Complete payment in Midtrans**
4. **Observe status checking**
5. **Verify auto-stop on completion**

### **API Testing**
```bash
curl -X POST "http://localhost:8082/api/v1/booking/payment-status" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"booking_number": "BK-20241201-0001"}'
```

## Benefits

### **User Experience**
- ✅ **Real-time feedback** tentang status payment
- ✅ **No manual refresh** diperlukan
- ✅ **Automatic completion** detection
- ✅ **Clear status messages** dengan emoji

### **Technical Benefits**
- ✅ **Efficient polling** setiap 5 detik
- ✅ **Auto-cleanup** untuk mencegah memory leaks
- ✅ **Error resilient** - continue checking on errors
- ✅ **Responsive UI** dengan loading indicators

### **Business Benefits**
- ✅ **Reduced support tickets** - user tahu status payment
- ✅ **Better conversion** - user tidak bingung status payment
- ✅ **Automated confirmation** - tidak perlu manual check 