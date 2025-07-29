# Environment Variables Setup

This project requires several environment variables to be configured. Create a `.env.local` file in the root directory with the following variables:

## Required Environment Variables

### API Configuration
```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8082

# API Authentication Token
NEXT_PUBLIC_API_TOKEN=your_api_token_here

# API Endpoints
NEXT_PUBLIC_SCHEDULES_ENDPOINT=/api/v1/booking/schedules
NEXT_PUBLIC_MASTER_DATA_ENDPOINT=/api/v1/booking/master-data
```

### Midtrans Payment Gateway
```env
# Midtrans Client Key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here

# Midtrans Server Key
NEXT_PUBLIC_MIDTRANS_SERVER_KEY=your_midtrans_server_key_here

# Midtrans Environment (true for production, false for sandbox)
NEXT_PUBLIC_MIDTRANS_PRODUCTION=false
```

### Optional Configuration
```env
# PayPal Configuration (if using PayPal)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
NEXT_PUBLIC_PAYPAL_SECRET=your_paypal_secret_here

# Database Configuration (if needed)
DATABASE_URL=your_database_url_here

# Application Environment
NEXT_PUBLIC_APP_ENV=development
```

## Getting Started

1. Copy the example above and create a `.env.local` file
2. Replace all `your_*_here` values with your actual credentials
3. Never commit the `.env.local` file to version control
4. The `.env.example` file shows the structure without real values

## Security Notes

- All environment variables starting with `NEXT_PUBLIC_` are exposed to the client
- Server-side secrets should not use the `NEXT_PUBLIC_` prefix
- Keep your API tokens and payment keys secure
- Rotate keys regularly for security 