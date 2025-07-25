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
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Booking Summary */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* Booking Summary Header */}
        <section className="w-full">
          <div className="bg-gray-100 p-3 sm:p-4 mb-3 sm:mb-4 rounded-lg">
            <h2 className="text-sm sm:text-base font-semibold text-sky-600">Booking Summary</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Date</span>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                {reservationDays.length === 1 ? reservationDays[0]?.date : reservationDays.map((r, i) => r.date).join(', ')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Duration</span>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                {duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days"}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-2 lg:col-span-1">
              <span className="text-xs text-gray-500 mb-1">Participants</span>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                {adultCount > 0 ? `${adultCount} Adult` : ''}{adultCount > 0 && childrenCount > 0 ? ' | ' : ''}{childrenCount > 0 ? `${childrenCount} Children` : ''}
              </span>
            </div>
          </div>
        </section>

        {/* Customer Info */}
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4 sm:mb-6">Customer Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Full Name:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.fullName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Email:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Mobile:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.mobile}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Hotel:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.hotel}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Hotel Address:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.hotelAddress}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Booking Name:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.bookingName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Arrival:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.dateOfArrival}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Country:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.country}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Nationality:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.nationality}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <span className="text-xs text-gray-500 w-24 sm:w-28">Notes:</span>
                <span className="text-sm sm:text-base font-medium text-gray-800">{customerInfo.notes}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Packages */}
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4 sm:mb-6">Selected Packages</h2>
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
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📦</div>
                <div className="text-gray-500 text-sm sm:text-base">No package selected yet.</div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1">Please select packages from the booking form</div>
              </div>
            )}
          </div>
        </section>

        {/* Promo Code Section */}
        <section className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">Promo Code</h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-start">
            <div className="flex-1">
              <Input
                type="text"
                value={promoCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="w-full text-sm sm:text-base"
              />
              {promoMessage && (
                <div
                  className={`text-xs sm:text-sm mt-2 ${
                    promoSuccess ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {promoMessage}
                </div>
              )}
            </div>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold px-6 py-2 w-full sm:w-auto"
              onClick={applyVoucher}
            >
              Apply Code
            </Button>
          </div>
        </section>

        {/* Total Amount Section */}
        <section className="bg-slate-950 text-white rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-300">Subtotal</span>
              <span className={`text-base sm:text-lg font-semibold ${voucherData ? "line-through text-red-400" : "text-white"}`}>
                {getDisplayPrice(totalAmount)}
              </span>
            </div>
            {voucherData && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-green-400">
                    Discount ({voucherData.discount_type === "percentage"
                      ? `${voucherData.discount_value}%`
                      : getDisplayPrice(voucherData.discount_amount)}
                    )
                  </span>
                  <span className="text-sm sm:text-base text-green-400 font-semibold">
                    -{getDisplayPrice(voucherData.discount_amount)}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-semibold text-white">Total Amount</span>
                    <span className="text-lg sm:text-xl font-bold text-emerald-400">
                      {getDisplayPrice(voucherData.net_amount)}
                    </span>
                  </div>
                </div>
              </>
            )}
            {!voucherData && (
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-white">Total Amount</span>
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {getDisplayPrice(totalAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Important Info */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            Important Information
          </h3>
          <ul className="text-xs sm:text-sm text-gray-700 space-y-2 list-disc pl-4 sm:pl-6">
            <li>Additional surcharge (USD$5) applies for adult private lessons during high season.</li>
            <li>The surcharge is payable upon arrival.</li>
            <li>If weather conditions are unsuitable, alternative times or surf vouchers will be offered.</li>
          </ul>
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="midtrans" id="midtrans" />
              <div>
                <span className="text-sm sm:text-base font-medium">Midtrans</span>
                <div className="text-xs text-gray-500 mt-1">Secure payment gateway</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="paypal" id="paypal" />
              <div>
                <span className="text-sm sm:text-base font-medium">PayPal</span>
                <div className="text-xs text-gray-500 mt-1">International payment</div>
              </div>
            </label>
          </RadioGroup>
        </section>

        {/* Terms and Payment */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox 
              checked={agreeTerms} 
              onCheckedChange={(v) => setAgreeTerms(v as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <span className="text-sm sm:text-base text-gray-700">
                I agree to the <a href="#" className="text-blue-600 underline hover:text-blue-800">Terms and Conditions</a> and acknowledge that I have read the important information above.
              </span>
              {errors.agreeTerms && (
                <div className="text-red-500 text-xs mt-2">{errors.agreeTerms}</div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm sm:text-base px-8 py-3 sm:px-12 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={handlePayment}
              disabled={!agreeTerms}
            >
              Proceed to Payment
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
} 