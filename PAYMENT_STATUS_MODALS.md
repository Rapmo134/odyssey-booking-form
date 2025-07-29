# Payment Status Modals

## Overview

Sistem ini menampilkan modal khusus untuk setiap status pembayaran yang berbeda, memberikan user experience yang lebih baik dan informasi yang lebih jelas.

## Modal Types

### 1. **Payment Settlement Modal** ✅
**Status**: `success` atau `settlement`

**Features:**
- ✅ **Green theme** dengan emoji success
- ✅ **Booking details** lengkap (number, amount, date, duration, participants, customer)
- ✅ **"View Booking Details"** button untuk melihat modal success
- ✅ **Gradient background** hijau-biru

**UI Elements:**
```jsx
<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
  <span className="text-2xl">✅</span>
</div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">
  Payment Successful
</h2>
```

### 2. **Payment Pending Modal** ⏳
**Status**: `pending`

**Features:**
- ⏳ **Yellow theme** dengan emoji pending
- ⏳ **Status monitoring info** - menjelaskan proses checking
- ⏳ **"Continue Monitoring"** button
- ⏳ **"Close & Stop Monitoring"** button

**UI Elements:**
```jsx
<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
  <span className="text-2xl">⏳</span>
</div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">
  Payment Pending
</h2>
```

### 3. **Payment Failed Modal** ❌
**Status**: `error` atau `failed`

**Features:**
- ❌ **Red theme** dengan emoji error
- ❌ **Error reasons** - menjelaskan kemungkinan penyebab
- ❌ **"Try Again"** button untuk retry payment
- ❌ **"Cancel Payment"** button

**UI Elements:**
```jsx
<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
  <span className="text-2xl">❌</span>
</div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">
  Payment Failed
</h2>
```

### 4. **Payment Expired Modal** ⏰
**Status**: `expired`

**Features:**
- ⏰ **Orange theme** dengan emoji clock
- ⏰ **Expiry reasons** - menjelaskan penyebab expired
- ⏰ **"Try Again"** button untuk retry payment
- ⏰ **"Cancel Payment"** button

**UI Elements:**
```jsx
<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
  <span className="text-2xl">⏰</span>
</div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">
  Payment Expired
</h2>
```

### 5. **Payment Denied Modal** 🚫
**Status**: `deny`

**Features:**
- 🚫 **Red theme** dengan emoji forbidden
- 🚫 **Denial reasons** - menjelaskan penyebab denial
- 🚫 **"Try Again"** button untuk retry payment
- 🚫 **"Cancel Payment"** button

**UI Elements:**
```jsx
<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
  <span className="text-2xl">🚫</span>
</div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">
  Payment Denied
</h2>
```

## State Management

### **Modal States:**
```typescript
const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
const [showPaymentSettlementModal, setShowPaymentSettlementModal] = useState(false);
const [showPaymentPendingModal, setShowPaymentPendingModal] = useState(false);
const [showPaymentExpiredModal, setShowPaymentExpiredModal] = useState(false);
const [showPaymentDeniedModal, setShowPaymentDeniedModal] = useState(false);
```

### **Status Mapping:**
```typescript
// checkPaymentStatus function
if (status === 'success' || status === 'settlement') {
  setShowPaymentSettlementModal(true);
} else if (status === 'expired') {
  setShowPaymentExpiredModal(true);
} else if (status === 'deny') {
  setShowPaymentDeniedModal(true);
} else if (status === 'pending') {
  setShowPaymentPendingModal(true);
}
```

## Modal Features

### **Common Features:**
- ✅ **Backdrop blur** untuk focus
- ✅ **Responsive design** (max-w-lg)
- ✅ **Gradient buttons** dengan hover effects
- ✅ **Emoji icons** untuk visual appeal
- ✅ **Color-coded themes** sesuai status

### **Settlement Modal Special:**
- ✅ **Booking details section** dengan grid layout
- ✅ **"View Booking Details"** untuk show success modal
- ✅ **Gradient background** hijau-biru
- ✅ **Complete booking info** display

### **Pending Modal Special:**
- ✅ **Status monitoring info** dengan bullet points
- ✅ **"Continue Monitoring"** untuk keep checking
- ✅ **"Close & Stop Monitoring"** untuk stop checking
- ✅ **Yellow theme** untuk pending status

### **Error Modals Special:**
- ✅ **Error reasons** dengan bullet points
- ✅ **"Try Again"** untuk retry payment
- ✅ **"Cancel Payment"** untuk cancel
- ✅ **Color-coded themes** (red/orange)

## Integration Flow

### **1. Payment Initiation:**
```typescript
handleMidtransPayment(snapToken);
// Opens Midtrans Snap
```

### **2. Status Checking:**
```typescript
startPaymentChecking(bookingNumber);
// Checks every 5 seconds
```

### **3. Modal Display:**
```typescript
checkPaymentStatus(bookingNumber);
// Shows appropriate modal based on status
```

### **4. User Actions:**
```typescript
// Try Again
setShowModal(false);
setShowMidtransModal(true);
handleMidtransPayment(snapToken);

// Cancel
setShowModal(false);
setShowMidtransModal(false);
setSnapToken(null);
```

## UI Components

### **Modal Container:**
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
  <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
    {/* Modal content */}
  </div>
</div>
```

### **Status Icon:**
```jsx
<div className="w-16 h-16 bg-color-100 rounded-full flex items-center justify-center mx-auto mb-4">
  <span className="text-2xl">emoji</span>
</div>
```

### **Info Section:**
```jsx
<div className="bg-color-50 rounded-lg p-4 mb-6 border border-color-200">
  <div className="flex items-center gap-2 mb-2">
    <span className="text-color-600">emoji</span>
    <span className="font-semibold text-color-800">Title</span>
  </div>
  <ul className="text-sm text-color-700 space-y-1">
    <li>• Point 1</li>
    <li>• Point 2</li>
  </ul>
</div>
```

### **Action Buttons:**
```jsx
<div className="space-y-3">
  <button className="w-full bg-color-600 hover:bg-color-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
    <span className="flex items-center justify-center gap-2">
      <span>emoji</span>
      <span>Action</span>
    </span>
  </button>
  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
    Cancel
  </button>
</div>
```

## Benefits

### **User Experience:**
- ✅ **Clear status indication** dengan emoji dan warna
- ✅ **Detailed information** tentang penyebab error
- ✅ **Easy retry mechanism** untuk failed payments
- ✅ **Consistent design** across all modals

### **Technical Benefits:**
- ✅ **Modular design** - setiap modal independent
- ✅ **Reusable components** - common UI patterns
- ✅ **State management** - proper modal control
- ✅ **Error handling** - comprehensive error states

### **Business Benefits:**
- ✅ **Reduced support tickets** - user tahu penyebab error
- ✅ **Better conversion** - clear retry options
- ✅ **Professional appearance** - polished UI
- ✅ **User confidence** - transparent status updates 