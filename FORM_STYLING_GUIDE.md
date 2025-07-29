# Form Styling Guide

## Cara Menggunakan Style Global untuk Form Elements

### 1. Style Otomatis (Automatic Styling)
Setelah menambahkan style global di `globals.css`, semua elemen HTML native akan otomatis memiliki style yang konsisten:

```html
<!-- Select akan otomatis memiliki style -->
<select>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>

<!-- Radio button akan otomatis memiliki style -->
<input type="radio" name="payment" value="bank" />

<!-- Checkbox akan otomatis memiliki style -->
<input type="checkbox" name="agree" />

<!-- Input text akan otomatis memiliki style -->
<input type="text" placeholder="Enter your name" />
```

### 2. Menggunakan Utility Classes
Jika ingin override style global atau menambahkan style tambahan:

```html
<!-- Menggunakan utility class form-select -->
<select className="form-select w-32">
  <option value="option1">Option 1</option>
</select>

<!-- Menggunakan utility class form-radio -->
<input type="radio" className="form-radio" name="payment" value="bank" />

<!-- Menggunakan utility class form-checkbox -->
<input type="checkbox" className="form-checkbox" name="agree" />

<!-- Menggunakan utility class form-input -->
<input type="text" className="form-input w-full" placeholder="Enter your name" />
```

### 3. Kombinasi dengan Tailwind Classes
Anda masih bisa menambahkan class Tailwind lainnya:

```html
<!-- Select dengan width custom -->
<select className="w-16 h-8 text-xs sm:text-sm">
  <option value="0">0</option>
  <option value="1">1</option>
</select>

<!-- Radio dengan margin -->
<input type="radio" className="mt-0.5" name="payment" value="bank" />

<!-- Input dengan responsive width -->
<input type="text" className="w-full sm:w-52 h-8 text-xs sm:text-sm" />
```

### 4. Keuntungan Menggunakan Style Global

1. **Konsistensi**: Semua form elements memiliki style yang sama
2. **Maintenance**: Perubahan style cukup di satu tempat
3. **Performance**: Tidak perlu mengulang class yang sama
4. **Clean Code**: Kode lebih bersih tanpa class yang berulang

### 5. Override Style Global
Jika ingin mengubah style untuk kasus tertentu:

```html
<!-- Override style global dengan class custom -->
<select className="!border-red-500 !focus:ring-red-500">
  <option value="error">Error Option</option>
</select>
```

### 6. Dark Mode Support
Style global sudah mendukung dark mode melalui CSS variables:

```css
/* Di globals.css sudah ada dark mode variables */
.dark select {
  @apply bg-gray-800 border-gray-600 text-white;
}
```

### 7. Responsive Design
Style global sudah responsive dan bisa dikombinasikan dengan class Tailwind:

```html
<!-- Select responsive -->
<select className="w-16 sm:w-24 md:w-32">
  <option value="option1">Option 1</option>
</select>
```

## Contoh Penggunaan di Komponen

### Sebelum (dengan class yang berulang):
```jsx
<select className="w-16 h-8 text-xs sm:text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
  <option value="0">0</option>
</select>
```

### Sesudah (dengan style global):
```jsx
<select className="w-16 h-8 text-xs sm:text-sm">
  <option value="0">0</option>
</select>
```

## File yang Sudah Diupdate

Style global sudah ditambahkan di:
- `app/globals.css` - Style global untuk semua form elements

Komponen yang bisa dioptimasi:
- `components/ParticipantForm.tsx`
- `components/CustomerInformationForm.tsx`
- `components/BookingSummary.tsx`
- `components/BookingFooter.tsx`
- `components/LessonsToursSpecifications.tsx` 