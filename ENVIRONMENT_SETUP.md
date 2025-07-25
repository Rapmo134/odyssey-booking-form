# Environment Variables Setup

Untuk menggunakan endpoint dari environment variables, buat file `.env.local` di root project dengan konfigurasi berikut:

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8082
NEXT_PUBLIC_API_TOKEN=your_api_token_here
NEXT_PUBLIC_SCHEDULES_ENDPOINT=/api/v1/booking/schedules
NEXT_PUBLIC_MASTER_DATA_ENDPOINT=/api/v1/booking/master-data
```

## Penjelasan Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL untuk API server
- `NEXT_PUBLIC_API_TOKEN`: Token untuk autentikasi API
- `NEXT_PUBLIC_SCHEDULES_ENDPOINT`: Endpoint untuk mengambil data schedules
- `NEXT_PUBLIC_MASTER_DATA_ENDPOINT`: Endpoint untuk mengambil master data

## Endpoint yang Digunakan

Aplikasi menggunakan endpoint-endpoint berikut:
- `/api/v1/booking/schedules` - Mengambil data jadwal
- `/api/v1/booking/master-data` - Mengambil master data
- `/api/v1/booking` - Membuat booking baru
- `/api/v1/booking/apply-voucher` - Menerapkan voucher
- `/api/v1/booking/generate-number` - Generate nomor booking
- `/api/v1/booking/check-drafts` - Cek draft booking

## Cara Penggunaan

1. Copy file `.env.example` (jika ada) ke `.env.local`
2. Atau buat file `.env.local` baru dengan konfigurasi di atas
3. Ganti nilai `your_api_token_here` dengan token API yang sebenarnya
4. Sesuaikan `NEXT_PUBLIC_API_BASE_URL` dengan URL server API Anda

## Fallback Values

Jika environment variables tidak ditemukan, aplikasi akan menggunakan nilai default:
- Base URL: `http://127.0.0.1:8082`
- Schedules endpoint: `/api/v1/booking/schedules`
- Master data endpoint: `/api/v1/booking/master-data`
- Booking endpoint: `/api/v1/booking`
- Apply voucher endpoint: `/api/v1/booking/apply-voucher`
- Generate number endpoint: `/api/v1/booking/generate-number`
- Check drafts endpoint: `/api/v1/booking/check-drafts` 