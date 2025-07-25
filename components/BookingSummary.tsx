import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Input } from "./ui/input"
import SelectedPackagesCard from "./SelectedPackagesCard"

interface BookingSummaryProps {
  reservationDays: any[]
  duration: string
  adultCount: number
  childrenCount: number
  customerInfo: any
  selectedPackages: any
  getDisplayPrice: (price: any) => string
  handleCancel: (recKey: string) => void
  promoCode: string
  setPromoCode: (value: string) => void
  applyVoucher: () => void
  promoMessage: string
  promoSuccess: boolean
  totalAmount: number
  voucherData: any
  paymentMethod: string
  setPaymentMethod: (value: string) => void
  agreeTerms: boolean
  setAgreeTerms: (value: boolean) => void
  handlePayment: () => void
  errors: any
}

export default function BookingSummary({
  reservationDays,
  duration,
  adultCount,
  childrenCount,
  customerInfo,
  selectedPackages,
  getDisplayPrice,
  handleCancel,
  promoCode,
  setPromoCode,
  applyVoucher,
  promoMessage,
  promoSuccess,
  totalAmount,
  voucherData,
  paymentMethod,
  setPaymentMethod,
  agreeTerms,
  setAgreeTerms,
  handlePayment,
  errors
}: BookingSummaryProps) {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-8">
      {/* Booking Summary */}
      <div className="bg-white shadow-lg rounded-sm border border-gray-200 p-4 sm:p-8 lg:p-16 grid grid-cols-1 gap-4 sm:gap-6">
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6 w-full lg:w-1/2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2 mb-3 sm:mb-4">Booking Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-xs sm:text-sm text-gray-700">
            <div><strong>Date:</strong> {reservationDays.length === 1 ? reservationDays[0]?.date : reservationDays.map((r, i) => r.date).join(', ')}</div>
            <div><strong>Duration:</strong> {duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days"}</div>
            <div className="sm:col-span-2 lg:col-span-1"><strong>Pax:</strong> {adultCount > 0 ? `${adultCount} Adult` : ''}{adultCount > 0 && childrenCount > 0 ? ' | ' : ''}{childrenCount > 0 ? `${childrenCount} Children` : ''}</div>
          </div>
        </section>

        {/* Customer Info */}
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2 mb-3 sm:mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700">
            <div className="space-y-1">
              <div><strong>Full Name:</strong> {customerInfo.fullName}</div>
              <div><strong>Email:</strong> {customerInfo.email}</div>
              <div><strong>Mobile:</strong> {customerInfo.mobile}</div>
              <div><strong>Hotel:</strong> {customerInfo.hotel}</div>
              <div><strong>Hotel Address:</strong> {customerInfo.hotelAddress}</div>
              <div><strong>Booking Name:</strong> {customerInfo.bookingName}</div>
              <div><strong>Arrival:</strong> {customerInfo.dateOfArrival}</div>
            </div>
            <div className="space-y-1">
              <div><strong>Country:</strong> {customerInfo.country}</div>
              <div><strong>Nationality:</strong> {customerInfo.nationality}</div>
              <div><strong>Notes:</strong> {customerInfo.notes}</div>
            </div>
          </div>
        </section>

        {/* Selected Packages */}
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2 mb-3 sm:mb-4">Selected Packages</h2>
          <div className="space-y-4 sm:space-y-6">
            {Object.keys(selectedPackages).length > 0 ? (
              Object.entries(selectedPackages).map(([recKey, rec]) => (
                <SelectedPackagesCard
                  key={recKey}
                  rec={rec}
                  getDisplayPrice={getDisplayPrice}
                  checked={true}
                  onCancel={() => handleCancel(recKey)}
                />
              ))
            ) : (
              <div className="text-gray-500 text-xs sm:text-sm">No package selected yet.</div>
            )}
          </div>
        </section>

        <div className="flex flex-col justify-end items-end">
          {/* Promo Code Input */}
          <div className="my-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
            <div className="flex flex-col gap-2 w-full sm:w-auto text-center sm:text-end">
              {promoMessage && (
                <div
                  className={`text-xs sm:text-sm ${
                    promoSuccess ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {promoMessage}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  type="text"
                  value={promoCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="w-full sm:w-64 text-xs sm:text-sm"
                />
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold w-full sm:w-auto"
                  onClick={applyVoucher}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-slate-950 text-white rounded-lg p-3 sm:p-4 flex flex-col gap-2 w-full lg:w-1/2">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-lg font-semibold text-white">Total Amount</span>
              <span className={`text-lg sm:text-2xl font-bold ${voucherData ? "line-through text-red-400" : "text-white"}`}>
                {getDisplayPrice(totalAmount)}
              </span>
            </div>
            {voucherData && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-base text-green-400 font-semibold">
                    Discount ({voucherData.discount_type === "percentage"
                      ? `${voucherData.discount_value}%`
                      : getDisplayPrice(voucherData.discount_amount)}
                    )
                  </span>
                  <span className="text-xs sm:text-base text-green-400 font-semibold">
                    -{getDisplayPrice(voucherData.discount_amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-lg font-semibold text-white">Net Amount</span>
                  <span className="text-lg sm:text-2xl font-bold text-emerald-400">
                    {getDisplayPrice(voucherData.net_amount)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Important Info */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Important Information:</h3>
          <ul className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2 list-disc pl-4 sm:pl-6">
            <li>Additional surcharge (USD$5) applies for adult private lessons during high season.</li>
            <li>The surcharge is payable upon arrival.</li>
            <li>If weather conditions are unsuitable, alternative times or surf vouchers will be offered.</li>
          </ul>
        </section>

        {/* Payment */}
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-4">
            <label className="flex items-center gap-2">
              <RadioGroupItem value="midtrans" id="midtrans" />
              <span className="text-xs sm:text-sm font-medium">Midtrans</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <span className="text-xs sm:text-sm font-medium">PayPal</span>
            </label>
          </RadioGroup>
        </section>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Checkbox checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(v as boolean)} />
          <span className="text-xs sm:text-sm text-gray-700">
            I agree to the <a href="#" className="text-blue-600 underline">Terms and Conditions</a>
          </span>
        </div>
        {errors.agreeTerms && <div className="text-red-500 text-xs mt-1">{errors.agreeTerms}</div>}
        <div className="flex justify-end gap-4">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3" onClick={handlePayment}>Payment</Button>
        </div>
      </div>
    </div>
  )
} 