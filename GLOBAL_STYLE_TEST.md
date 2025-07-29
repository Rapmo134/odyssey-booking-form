# Global Style Test Guide

## Cara Test Style Global

### 1. Test Select Elements
Buka browser dan periksa elemen `<select>` di komponen:
- `ParticipantForm.tsx` - Adult count, adult level, children count, child age, child level
- `CustomerInformationForm.tsx` - Title, country, hotel transfer
- `BookingSummary.tsx` - Bank selection
- `BookingFooter.tsx` - Language selector
- `LessonsToursSpecifications.tsx` - Duration, reservation date, reservation time

**Yang harus terlihat:**
- Border abu-abu (`border-gray-300`)
- Padding (`px-3 py-2`)
- Border radius (`rounded-md`)
- Focus ring biru (`focus:ring-blue-500`)
- Background putih (`bg-white`)

### 2. Test Radio Buttons
Periksa radio buttons di `BookingSummary.tsx`:
- Payment method radio buttons

**Yang harus terlihat:**
- Size 16x16 (`w-4 h-4`)
- Warna biru (`text-blue-600`)
- Border abu-abu (`border-gray-300`)
- Focus ring biru (`focus:ring-blue-500`)

### 3. Test Checkboxes
Periksa checkboxes di:
- `LessonsToursSpecifications.tsx` - Surfing activities
- `BookingSummary.tsx` - Terms agreement

**Yang harus terlihat:**
- Size 16x16 (`w-4 h-4`)
- Warna biru (`text-blue-600`)
- Border abu-abu (`border-gray-300`)
- Border radius (`rounded`)
- Focus ring biru (`focus:ring-blue-500`)

### 4. Test Text Inputs
Periksa input fields di:
- `ParticipantForm.tsx` - Name inputs
- `CustomerInformationForm.tsx` - Email, phone, hotel, etc.

**Yang harus terlihat:**
- Border abu-abu (`border-gray-300`)
- Padding (`px-3 py-2`)
- Border radius (`rounded-md`)
- Focus ring biru (`focus:ring-blue-500`)

## Troubleshooting

### Jika style tidak muncul:

1. **Periksa CSS Specificity**
   ```css
   /* Style global mungkin kalah dengan style komponen UI */
   select {
     @apply px-3 py-2 text-sm border border-gray-300 rounded-md !important;
   }
   ```

2. **Periksa Tailwind Config**
   ```js
   // Pastikan globals.css di-include di tailwind.config.ts
   content: [
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
     "./components/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   ```

3. **Periksa Import CSS**
   ```jsx
   // Pastikan globals.css di-import di layout.tsx
   import './globals.css'
   ```

4. **Force Refresh Browser**
   - Hard refresh (Ctrl+F5 / Cmd+Shift+R)
   - Clear browser cache
   - Restart development server

### Debug dengan Browser DevTools:

1. **Inspect Element**
   - Klik kanan pada select/input
   - Pilih "Inspect"
   - Lihat di tab "Styles"

2. **Periksa CSS Rules**
   - Cari style yang diterapkan
   - Pastikan tidak ada style yang override

3. **Test dengan Console**
   ```javascript
   // Test di browser console
   document.querySelector('select').style.cssText
   ```

## Expected Results

Setelah style global diterapkan dengan benar, semua form elements harus memiliki:

### Select Elements:
```css
padding: 0.75rem 0.5rem;
font-size: 0.875rem;
border: 1px solid #d1d5db;
border-radius: 0.375rem;
background-color: white;
```

### Radio/Checkbox:
```css
width: 1rem;
height: 1rem;
color: #2563eb;
border: 1px solid #d1d5db;
```

### Focus States:
```css
outline: none;
ring: 2px solid #3b82f6;
border-color: #3b82f6;
```

## Fallback Solution

Jika style global masih tidak bekerja, gunakan utility classes:

```jsx
// Gunakan utility classes sebagai fallback
<select className="form-select w-16 h-8 text-xs sm:text-sm">
  <option value="0">0</option>
</select>

<input type="radio" className="form-radio" name="payment" value="bank" />
<input type="checkbox" className="form-checkbox" name="agree" />
``` 