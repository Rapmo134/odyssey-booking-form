# PayPal Integration Setup

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
NEXT_PUBLIC_PAYPAL_PRODUCTION=false
```

## Configuration Details

### Sandbox Environment (Development)
- **Client ID**: Your PayPal Sandbox Client ID
- **Production**: `false`
- **Base URL**: `https://www.sandbox.paypal.com`

### Production Environment
- **Client ID**: Your PayPal Production Client ID  
- **Production**: `true`
- **Base URL**: `https://www.paypal.com`

## How It Works

1. **Script Loading**: PayPal SDK is loaded dynamically when the modal opens
2. **Payment Flow**: 
   - User selects PayPal as payment method
   - Booking is created on backend
   - PayPal modal opens with payment buttons
   - User completes payment through PayPal
   - Payment details are sent to backend for verification
   - Success modal shows booking confirmation

## Backend API Endpoints Required

Your backend needs to implement these endpoints:

### 1. Create PayPal Order
```
POST /api/v1/booking/paypal/create-order
```

**Request Body:**
```json
{
  "booking_code": "string",
  "amount": "number",
  "currency": "string", 
  "description": "string"
}
```

### 2. Capture PayPal Payment
```
POST /api/v1/booking/paypal/capture-payment
```

**Request Body:**
```json
{
  "booking_code": "string",
  "order_id": "string",
  "payment_id": "string"
}
```

### 3. Get PayPal Order Status
```
GET /api/v1/booking/paypal/order-status/{orderId}
```

## Testing

1. **Sandbox Testing**:
   - Use PayPal Sandbox accounts for testing
   - Set `NEXT_PUBLIC_PAYPAL_PRODUCTION=false`
   - Test with sandbox buyer/seller accounts

2. **Production Testing**:
   - Set `NEXT_PUBLIC_PAYPAL_PRODUCTION=true`
   - Use real PayPal accounts
   - Ensure all webhooks are configured

## Security Notes

- Never expose PayPal secret keys in frontend
- Always verify payments on backend
- Use HTTPS in production
- Implement proper error handling
- Add logging for payment events

## Troubleshooting

### Common Issues

1. **Script not loading**:
   - Check internet connection
   - Verify PayPal Client ID is correct
   - Check browser console for errors

2. **Payment buttons not showing**:
   - Ensure PayPal SDK loaded successfully
   - Check amount is valid number
   - Verify container element exists

3. **Payment verification failed**:
   - Check backend API endpoints
   - Verify payment details are correct
   - Check server logs for errors

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('paypal-debug', 'true');
```

## Integration Steps

1. **Get PayPal Developer Account**:
   - Sign up at developer.paypal.com
   - Create app to get Client ID

2. **Configure Environment**:
   - Add environment variables
   - Set production flag appropriately

3. **Test Integration**:
   - Test in sandbox first
   - Verify payment flow works
   - Test error scenarios

4. **Go Live**:
   - Switch to production environment
   - Update Client ID to production
   - Test with real payments 