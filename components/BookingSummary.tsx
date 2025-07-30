import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
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
  formData: any
  // Agent related props
  agentCode: string
  setAgentCode: (code: string) => void
  selectedAgent: any
  setSelectedAgent: (agent: any) => void
  fetchAgentByCode: (code: string) => Promise<void>
  loadingAgent?: boolean
  // Split payment props
  splitPayments: any[]
  setSplitPayments: (payments: any[]) => void
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
  errors,
  formData,
  agentCode,
  setAgentCode,
  selectedAgent,
  setSelectedAgent,
  fetchAgentByCode,
  loadingAgent,
  splitPayments,
  setSplitPayments
}: BookingSummaryProps) {
  
  // Check if all participants have packages
  const allParticipantNames = [
    ...formData.adults.map((a: any) => a.name),
    ...formData.children.map((c: any) => c.name)
  ].filter((name: string) => name.trim() !== "");

  const participantsWithPackages = Object.values(selectedPackages || {}).flatMap((pkg: any) => 
    pkg.people || []
  );

  const participantsWithoutPackages = allParticipantNames.filter((name: string) => 
    !participantsWithPackages.includes(name)
  );

  const canProceedToPayment = participantsWithoutPackages.length === 0;

  // Determine available payment methods based on agent
  const getAvailablePaymentMethods = () => {
    if (selectedAgent) {
      // Agent is selected, use agent's payment methods
      const agentPaymentMethods = selectedAgent.payment || '';
      const methods = [];
      
      if (agentPaymentMethods.includes('B')) methods.push({ code: 'bank', label: 'Bank Transfer', description: 'BCA, Mandiri, BNI' });
      if (agentPaymentMethods.includes('C')) methods.push({ code: 'credit_card', label: 'Credit', description: '' });
      if (agentPaymentMethods.includes('O')) methods.push({ code: 'onsite', label: 'Onsite Payment', description: 'Pay at location' });
      if (agentPaymentMethods.includes('S')) methods.push({ code: 'saldo', label: 'Saldo/Balance', description: 'Account balance' });
      
      return methods;
    } else {
      // No agent selected, use default payment methods (Midtrans/PayPal)
      return [
        { code: 'midtrans', label: 'Midtrans', description: 'Secure payment gateway' },
        { code: 'paypal', label: 'PayPal', description: 'PayPal payment' }
      ];
    }
  };

  const availablePaymentMethods = getAvailablePaymentMethods();

  // Calculate total split payment amount
  const totalSplitAmount = splitPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const remainingAmount = (voucherData ? voucherData.net_amount : totalAmount) - totalSplitAmount;

  return (
    <div className="max-w-7xl">
      {/* Booking Summary */}

      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 rounded-lg p-3 sm:p-4 md:p-5 mb-4 sm:mb-5 md:mb-6 mt-8 sm:mt-10 md:mt-12 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 self-center sm:self-auto">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-800 leading-tight">Booking Summary</h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1 sm:mt-2 leading-relaxed">Please review your booking details</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Booking Summary Header */}
        <section className="w-full">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Booking Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Date</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {reservationDays.length === 1 ? reservationDays[0]?.date : reservationDays.map((r, i) => r.date).join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Duration</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Participants</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {adultCount > 0 ? `${adultCount} Adult` : ''}{adultCount > 0 && childrenCount > 0 ? ' | ' : ''}{childrenCount > 0 ? `${childrenCount} Children` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Info */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-base font-medium text-gray-900">Customer Information</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Full Name</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.fullName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Email</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Mobile</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.mobile}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Hotel</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.hotel}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Hotel Address</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.hotelAddress}</span>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Booking Name</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.bookingName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Arrival</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.dateOfArrival}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Country</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.country}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Nationality</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{customerInfo.nationality}</span>
              </div>
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Notes</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-right">{customerInfo.notes}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Packages */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-base font-medium text-gray-900">Selected Packages</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
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
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="text-gray-500 text-xs sm:text-sm">No package selected yet.</div>
                <div className="text-gray-400 text-xs mt-1">Please select packages from the booking form</div>
              </div>
            )}
          </div>
        </section>

        {/* Participant Details */}
        <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 sm:pb-3 mb-3 sm:mb-4 md:mb-6">Participant Details</h2>
          <div className="space-y-3 sm:space-y-4">
            {/* Adults */}
            {formData.adults.filter((adult: any) => adult.name.trim() !== "").length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Adults</h3>
                <div className="space-y-2 sm:space-y-3">
                  {formData.adults.filter((adult: any) => adult.name.trim() !== "").map((adult: any, idx: number) => (
                    <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-xs sm:text-sm">{adult.name}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Level: {adult.level}</div>
                          {adult.medical && adult.medical.length > 0 && adult.medical[0] !== "no_medical" && (
                            <div className="text-xs sm:text-sm text-orange-600 mt-1">
                              ⚠️ Medical conditions: {adult.medical.join(", ")}
                              {adult.medical_other && ` - ${adult.medical_other}`}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Object.values(selectedPackages || {}).some((pkg: any) => 
                            pkg.people.includes(adult.name) && pkg.pkg?.id
                          ) ? (
                            <span className="text-green-600">✓ Package Selected</span>
                          ) : (
                            <span className="text-red-500">⚠️ No Package</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Children */}
            {formData.children.filter((child: any) => child.name.trim() !== "").length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Children</h3>
                <div className="space-y-2 sm:space-y-3">
                  {formData.children.filter((child: any) => child.name.trim() !== "").map((child: any, idx: number) => (
                    <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-xs sm:text-sm">{child.name}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Level: {child.level}</div>
                          {child.medical && child.medical.length > 0 && child.medical[0] !== "no_medical" && (
                            <div className="text-xs sm:text-sm text-orange-600 mt-1">
                              ⚠️ Medical conditions: {child.medical.join(", ")}
                              {child.medical_other && ` - ${child.medical_other}`}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Object.values(selectedPackages || {}).some((pkg: any) => 
                            pkg.people.includes(child.name) && pkg.pkg?.id
                          ) ? (
                            <span className="text-green-600">✓ Package Selected</span>
                          ) : (
                            <span className="text-red-500">⚠️ No Package</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Promo Code Section */}
        <section className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Promo Code</h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-start sm:items-start">
            <div className="flex-1">
              <Input
                type="text"
                value={promoCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="w-full text-xs sm:text-sm md:text-base"
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
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base font-semibold px-4 sm:px-6 py-2 w-full sm:w-auto"
              onClick={applyVoucher}
            >
              Apply Code
            </Button>
          </div>
        </section>

        {/* Total Amount Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Payment Summary</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm md:text-base text-gray-600">Subtotal</span>
              <span className={`text-sm sm:text-base md:text-lg font-semibold ${voucherData ? "line-through text-gray-400" : "text-gray-900"}`}>
                {getDisplayPrice(totalAmount)}
              </span>
            </div>
            {voucherData && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm md:text-base text-green-600">
                    Discount ({voucherData.discount_type === "percentage"
                      ? `${voucherData.discount_value}%`
                      : getDisplayPrice(voucherData.discount_amount)}
                    )
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-green-600 font-semibold">
                    -{getDisplayPrice(voucherData.discount_amount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">Total Amount</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-green-600">
                      {getDisplayPrice(voucherData.net_amount)}
                    </span>
                  </div>
                </div>
              </>
            )}
            {!voucherData && (
              <div className="border-t border-gray-200 pt-2 sm:pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">Total Amount</span>
                  <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                    {getDisplayPrice(totalAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Important Info */}
        {/* <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            Important Information
          </h3>
          <ul className="text-xs sm:text-sm text-gray-700 space-y-2 list-disc pl-4 sm:pl-6">
            <li>Additional surcharge (USD$5) applies for adult private lessons during high season.</li>
            <li>The surcharge is payable upon arrival.</li>
            <li>If weather conditions are unsuitable, alternative times or surf vouchers will be offered.</li>
          </ul>
        </section> */}

        {/* Agent Selection */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Agent Selection</h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Agent Code Input */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Enter Agent Code (Optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  value={agentCode}
                  onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
                  placeholder="Enter agent code (e.g., AGT001)"
                  className="flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => fetchAgentByCode(agentCode)}
                  disabled={!agentCode.trim() || loadingAgent}
                  className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm md:text-base"
                >
                  {loadingAgent ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Searching...</span>
                      <span className="sm:hidden">Search...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="hidden sm:inline">Find Agent</span>
                      <span className="sm:hidden">Find</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Selected Agent Info */}
            {selectedAgent && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">Selected Agent</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgent(null);
                      setAgentCode('');
                      setSplitPayments([]);
                    }}
                    className="flex items-center gap-1 text-red-600 text-xs sm:text-sm font-medium hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors self-start sm:self-auto"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="hidden sm:inline">Remove</span>
                    <span className="sm:hidden">Remove</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-blue-100">
                      <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">Name</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">{selectedAgent.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-blue-100">
                      <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">Email</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">{selectedAgent.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-blue-100">
                      <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">Phone</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{selectedAgent.phone}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-blue-100">
                      <span className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-0">Payment Methods</span>
                      <span className="text-xs sm:text-sm font-medium text-blue-600">
                        {selectedAgent.payment?.split('').map((p: string) => {
                          const labels = { B: 'Bank', C: 'Credit Card', O: 'Onsite', S: 'Saldo' };
                          return labels[p as keyof typeof labels];
                        }).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default Payment Info */}
            {!selectedAgent && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">Default Payment Methods</span>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Midtrans and PayPal payment gateways</div>
                  </div>
                </div>
              </div>
            )}

            {/* Switch to Default Mode Option */}
            {selectedAgent && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-orange-800">Want to use default payment?</span>
                      <div className="text-xs text-orange-700 mt-1">Switch back to Midtrans/PayPal</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgent(null);
                      setAgentCode('');
                      setSplitPayments([]);
                    }}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-orange-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <span className="hidden sm:inline">Switch to Default</span>
                    <span className="sm:hidden">Switch</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Payment Method</h2>
          </div>
          
          {/* Warning if participants haven't selected packages */}
          {!canProceedToPayment && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-red-800">Cannot Proceed to Payment</h4>
              </div>
              <p className="text-sm text-red-700 mb-3">
                The following participants haven't selected a package:
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside mb-3">
                {participantsWithoutPackages.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
              <p className="text-sm text-red-600">
                Please select packages for all participants before proceeding to payment.
              </p>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            {/* Payment Method Inputs for Agent */}
            {selectedAgent ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Enter payment amounts for each method:</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {availablePaymentMethods.map((method) => {
                    const currentAmount = splitPayments.find(p => p.method === method.code)?.amount || 0;
                    const maxSaldo = selectedAgent?.saldo ? parseFloat(selectedAgent.saldo) : 0;
                    const isSaldo = method.code === 'saldo';
                    const isOverLimit = isSaldo && currentAmount > maxSaldo;
                    
                    return (
                      <div key={method.code} className="border border-gray-200 rounded-xl p-3 sm:p-5 hover:border-blue-300 transition-all duration-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              </div>
                              <span className="text-sm sm:text-base font-semibold text-gray-900">{method.label}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">{method.description}</div>
                            {isSaldo && maxSaldo > 0 && (
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 mt-2 font-medium">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span>Available: {getDisplayPrice(maxSaldo)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Amount:</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={currentAmount || ''}
                            onChange={(e) => {
                              const amount = parseFloat(e.target.value) || 0;
                              const newPayments = [...splitPayments];
                              const existingIndex = newPayments.findIndex(p => p.method === method.code);
                              
                              if (existingIndex >= 0) {
                                newPayments[existingIndex].amount = amount;
                              } else {
                                newPayments.push({ method: method.code, amount });
                              }
                              
                              setSplitPayments(newPayments);
                            }}
                            className={`w-24 sm:w-32 px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              isOverLimit ? 'border-red-400 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {isOverLimit && (
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600 font-medium">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span>Over limit</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Default Payment Methods (Radio buttons) */
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {availablePaymentMethods.map((method) => (
                    <label key={method.code} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors bg-white shadow-sm">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.code}
                        checked={paymentMethod === method.code}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm sm:text-base font-bold text-gray-800">{method.label}</span>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">{method.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
            )}

            {/* Payment Summary for Agent */}
            {selectedAgent && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Payment Summary</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div className="text-xs text-gray-600">Total Amount</div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{getDisplayPrice(voucherData ? voucherData.net_amount : totalAmount)}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                      <div className="text-xs text-gray-600">Split Total</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{getDisplayPrice(totalSplitAmount)}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-gray-600">Remaining</div>
                    </div>
                    <div className={`text-lg font-bold ${remainingAmount > 0 ? 'text-orange-600' : remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {getDisplayPrice(remainingAmount)}
                    </div>
                  </div>
                </div>
                
                {/* Status Messages */}
                <div className="space-y-3">
                  {remainingAmount < 0 && (
                    <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="font-medium">Total split amount exceeds total payment</span>
                    </div>
                  )}
                  {remainingAmount > 0 && (
                    <div className="flex items-center gap-3 text-sm text-orange-700 bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="font-medium">Payment incomplete. Please complete the payment amount.</span>
                    </div>
                  )}
                  {remainingAmount === 0 && totalSplitAmount > 0 && (
                    <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Payment complete</span>
                    </div>
                  )}
                  
                  {/* Saldo Limit Warning */}
                  {(() => {
                    const saldoAmount = splitPayments.find(p => p.method === 'saldo')?.amount || 0;
                    const maxSaldo = selectedAgent?.saldo ? parseFloat(selectedAgent.saldo) : 0;
                    if (saldoAmount > maxSaldo) {
                      return (
                        <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="font-medium">Saldo amount ({getDisplayPrice(saldoAmount)}) exceeds available balance ({getDisplayPrice(maxSaldo)})</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                
                {/* Quick Examples */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Examples:</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Bank only: Enter full amount in Bank Transfer</div>
                    <div>• Mixed: Split amount across multiple methods</div>
                    <div>• Saldo: Based on agent's available balance</div>
                    <div>• Total must equal the full payment amount</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Terms and Payment */}
        <section className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <span className="text-xs sm:text-sm md:text-base text-gray-700">
                I agree to the <a href="#" className="text-blue-600 underline hover:text-blue-800">Terms and Conditions</a> and acknowledge that I have read the important information above.
              </span>
              {errors.agreeTerms && (
                <div className="text-red-500 text-xs mt-2">{errors.agreeTerms}</div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className={`
                relative overflow-hidden group
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                text-white font-semibold 
                text-xs sm:text-sm md:text-base
                px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 
                shadow-lg hover:shadow-xl 
                transition-all duration-300 ease-in-out
                transform hover:scale-105 active:scale-95
                border-0 rounded-lg
                w-full sm:w-auto
                ${!agreeTerms ? 'opacity-50 cursor-not-allowed grayscale' : ''}
              `}
              onClick={handlePayment}
              disabled={!agreeTerms}
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="relative z-10 whitespace-nowrap">
                  <span className="hidden sm:inline">Pay Now</span>
                  <span className="sm:hidden">Pay Now</span>
                </span>
              </div>
              
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Button>
          </div>
        </section>
      </div>
        
    </div>
  )
} 