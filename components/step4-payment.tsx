"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Step4Payment() {
  const [paymentMethod, setPaymentMethod] = useState("midtrans")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const bookingData = {
    dateOfLesson: "19-07-2025",
    duration: "1 Day",
    pax: "1 Adult | 1 Children",
  }

  const selectedPackages = [
    {
      id: 1,
      title: "KIDS PRIVATE LESSON",
      badge: "POUPG",
      badgeColor: "bg-blue-400",
      day: "Day 1",
      time: "Afternoon",
      hour: "12:00",
      date: "19-07-2025",
      duration: "Max: 2.5 Hours",
      price: 750000,
      totalPrice: 750000,
    },
    {
      id: 2,
      title: "PRIVATE LESSON",
      badge: "SP30",
      badgeColor: "bg-blue-500",
      day: "Day 1",
      time: "Afternoon",
      hour: "12:00",
      date: "19-07-2025",
      duration: "Max: 2.5 Hours",
      price: 790000,
      additionalCharge: 170000,
      totalPrice: 790000,
      note: "High season additional charge",
    },
  ]

  const customerInfo = {
    fullName: "Mr. John",
    email: "rapmo641@gmmail.com",
    mobile: "564",
    hotel: "Dfh",
    hotelAddress: "fht",
    bookingName: "yyyyyyy",
    dateOfArrival: "08-07-2025",
    country: "",
    nationality: "",
    notes: "",
  }

  const totalAmount = selectedPackages.reduce((sum, pkg) => sum + pkg.totalPrice, 0) + 170000

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8">
          {/* Booking Summary */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4 text-sm mb-6">
              <div>
                <span className="text-gray-600">Date of Lesson</span>
                <span className="ml-4 text-blue-600">: {bookingData.dateOfLesson}</span>
              </div>
              <div>
                <span className="text-gray-600">Duration</span>
                <span className="ml-4 text-blue-600">: {bookingData.duration}</span>
              </div>
              <div>
                <span className="text-gray-600">Pax</span>
                <span className="ml-4 text-blue-600">: {bookingData.pax}</span>
              </div>
            </div>
          </div>

          {/* Selected Packages */}
          <div className="space-y-6 mb-8">
            {selectedPackages.map((pkg) => (
              <div key={pkg.id} className="bg-gray-100 rounded-lg p-4">
                {/* Package Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                  <h3 className="font-semibold text-gray-800">{pkg.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold text-white rounded ${pkg.badgeColor}`}>
                    {pkg.badge}
                  </span>
                </div>

                {/* Package Details */}
                <div className="grid grid-cols-5 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-600">{pkg.day}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{pkg.time}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{pkg.hour}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{pkg.date}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{pkg.duration}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-4 h-6 bg-red-500"></div>
                      <div className="w-4 h-6 bg-white border"></div>
                      <span className="text-xs">ITSBOOK</span>
                    </div>
                  </div>
                </div>

                {/* Additional Charge (if any) */}
                {pkg.additionalCharge && (
                  <div className="bg-orange-200 p-2 rounded mb-2">
                    <div className="text-sm text-gray-700">{pkg.note}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">TOTAL IDR</span>
                      <span className="font-semibold">{pkg.additionalCharge.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Package Price */}
                <div className="bg-orange-300 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">PRICE/PERSON/1 Day IDR {pkg.price.toLocaleString()}</span>
                    <div className="text-right">
                      <div className="text-sm">TOTAL PRICE IDR</div>
                      <div className="font-bold">{pkg.totalPrice.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="bg-green-400 p-4 rounded-lg mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">APPLY</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">TOTAL AMOUNT IDR</div>
                <div className="text-xl font-bold">{totalAmount.toLocaleString()}.00</div>
              </div>
            </div>
          </div>

          {/* Customer Information Summary */}
          <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-600 w-32">Full Booking Name (*)</span>
                  <span className="text-gray-800">{customerInfo.fullName}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Email (*)</span>
                  <span className="text-gray-800">{customerInfo.email}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Mobile Phone</span>
                  <span className="text-gray-800">{customerInfo.mobile}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Hotel</span>
                  <span className="text-gray-800">{customerInfo.hotel}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Hotel Address</span>
                  <span className="text-gray-800">{customerInfo.hotelAddress}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Booking Name in the Hotel</span>
                  <span className="text-gray-800">{customerInfo.bookingName}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Date of Arrival</span>
                  <span className="text-gray-800">{customerInfo.dateOfArrival}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-600 w-32">Country</span>
                  <span className="text-gray-800">{customerInfo.country}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Nationality</span>
                  <span className="text-gray-800">{customerInfo.nationality}</span>
                </div>
                <div className="mt-4">
                  <div className="text-gray-600 mb-2">Note (Comments, Request, Question)</div>
                  <div className="text-gray-800">{customerInfo.notes}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Important Information:</h3>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                • Additional surcharge (USD$5) applies for adult private lessons, adult intermediate lessons and surf
                tour during the high season ( June – September & 26th December – 5th January ).
              </p>
              <p>• The surcharge is payable upon arrival.</p>
              <p className="font-semibold">Pick up service:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  If you want a pick up service, due to the special sharing of transportation please let us know if your
                  scheduled pick up time that we will inform to you later.
                </li>
                <li>
                  If you arrive early you can wait for the adjusted trip staff, since due to road disturbance or
                  Balinese ceremonies. We are sorry for this inconvenience.
                </li>
                <li>
                  The shuttle bus will leave without waiting if the baby. Please take note that they own transport. We
                  are not responsible for lesson cancellation if the transportation is missed.
                </li>
              </ol>
              <p className="font-semibold">Wet season conditions:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  If the weather conditions are bad and not suitable for surfing, we will provide you with an
                  alternative beach or time that is suitable for surfing. If the lesson could not be postponed, in these
                  circumstances we will offer you alternative dates, no refund will be available. If you are unable or
                  unwilling to accept these new dates then we will provide a surf vouchers under the same booking
                  conditions that has been experienced to be used anytime within 1 year, expired from the date of the
                  booking.
                </li>
                <li>
                  Please be informed that garbage in Kuta beach and Seminyak beach are recommended every rainy season in
                  Bali. To clean the garbage in Kuta Beach, the government mobilized local residents to clean all the
                  beautiful every day.
                </li>
              </ol>
              <p>We are sorry for the inconvenience caused.</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Payment Method:</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="midtrans" id="midtrans" />
                <label htmlFor="midtrans" className="text-sm font-medium">
                  Midtrans
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <label htmlFor="paypal" className="text-sm font-medium">
                  PayPal
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
              <span className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-blue-600 underline">
                  Terms and Conditions
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-semibold flex items-center gap-2"
              disabled={!agreeTerms}
            >
              SUBMIT & PAY
              <Star className="w-5 h-5 fill-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
