# Midtrans Integration Setup

## Environment Variables

Tambahkan variabel berikut ke file `.env.local`:

```env
# Midtrans Configuration
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-k618wg72LIN17Vi6
NEXT_PUBLIC_MIDTRANS_SERVER_KEY=SB-Mid-server-FmKlb8bduL2cVpQx1RP6YVV3
NEXT_PUBLIC_MIDTRANS_PRODUCTION=false
```

## Configuration Details

### Sandbox Environment (Development)
- **Client Key**: `SB-Mid-client-k618wg72LIN17Vi6`
- **Server Key**: `SB-Mid-server-FmKlb8bduL2cVpQx1RP6YVV3`
- **Base URL**: `https://app.sandbox.midtrans.com`
- **Production**: `false`

### Production Environment
Untuk production, ganti dengan:
- **Client Key**: `Mid-client-XXXXXXXXXX`
- **Server Key**: `Mid-server-XXXXXXXXXX`
- **Base URL**: `https://app.midtrans.com`
- **Production**: `true`

## Features Implemented

### 1. **Automatic Script Loading**
- Midtrans Snap script otomatis dimuat saat komponen mount
- Script cleanup saat komponen unmount

### 2. **Payment Modal**
- Modal yang menarik dengan informasi pembayaran
- Debug info untuk development
- Responsive design

### 3. **Payment Callbacks**
- `onSuccess`: Menampilkan pesan sukses dan modal booking
- `onPending`: Menampilkan pesan pending
- `onError`: Menampilkan pesan error
- `onClose`: Menampilkan pesan cancelled

### 4. **Security Features**
- Client key validation
- Environment detection (sandbox/production)
- Error handling untuk script loading

## Testing

### Sandbox Testing
1. Gunakan kartu kredit test:
   - **Card Number**: `4811 1111 1111 1114`
   - **Expiry**: `01/25`
   - **CVV**: `123`

2. Atau gunakan bank transfer test:
   - **Bank**: BCA, Mandiri, BNI
   - **Account**: Test account akan muncul

### Production Testing
1. Gunakan kartu kredit asli
2. Atau gunakan bank transfer asli
3. Pastikan `NEXT_PUBLIC_MIDTRANS_PRODUCTION=true`

## Integration Flow

1. **User completes booking form**
2. **System creates booking via API**
3. **API returns snap_token**
4. **Frontend shows payment modal**
5. **User clicks "Proceed to Payment"**
6. **Midtrans Snap opens**
7. **User completes payment**
8. **Callback handles result**
9. **Success modal shows booking details**

## Error Handling

- **Script not loaded**: Refresh page message
- **Payment failed**: Retry message
- **Payment cancelled**: Try again later message
- **Network error**: Contact support message

## Security Notes

- Client key aman untuk frontend
- Server key hanya untuk backend
- Sandbox environment untuk testing
- Production environment untuk live
- HTTPS required untuk production 