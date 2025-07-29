import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "./ui/textarea"
import { Calendar } from "lucide-react"

interface CustomerInformationFormProps {
  formData2: any
  setFormData2: (data: any) => void
  errors: any
  validateField: (fieldName: string, value: any) => void
}

export default function CustomerInformationForm({ formData2, setFormData2, errors, validateField }: CustomerInformationFormProps) {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6 mt-12 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Customer Information</h2>
            <p className="text-sm text-slate-600 mt-1">Please provide your contact and accommodation details</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Full Booking Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Booking Name <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <select
                  value={formData2.title}
                  onChange={(e) => {
                    setFormData2({ ...formData2, title: e.target.value });
                  }}
                  className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
                <Input
                  value={formData2.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    setFormData2({ ...formData2, fullName: value });
                    validateField('fullName', value);
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData2.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setFormData2({ ...formData2, email: value });
                  validateField('email', value);
                }}
                placeholder="your@email.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Phone</label>
              <Input
                value={formData2.mobilePhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setFormData2({ ...formData2, mobilePhone: value });
                }}
                placeholder="Phone number"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.mobilePhone && <p className="mt-1 text-sm text-red-600">{errors.mobilePhone}</p>}
            </div>

            {/* Hotel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel <span className="text-red-500">*</span>
              </label>
              <Input 
                value={formData2.hotel} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setFormData2({ ...formData2, hotel: value });
                  validateField('hotel', value);
                }} 
                placeholder="Hotel name" 
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              />
              {errors.hotel && <p className="mt-1 text-sm text-red-600">{errors.hotel}</p>}
            </div>

            {/* Hotel Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Address <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData2.hotelAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setFormData2({ ...formData2, hotelAddress: value });
                  validateField('hotelAddress', value);
                }}
                placeholder="Hotel address"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.hotelAddress && <p className="mt-1 text-sm text-red-600">{errors.hotelAddress}</p>}
            </div>

            {/* Booking Name in the Hotel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Name in the Hotel <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData2.bookingName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setFormData2({ ...formData2, bookingName: value });
                  validateField('bookingName', value);
                }}
                placeholder="Booking name in hotel"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.bookingName && <p className="mt-1 text-sm text-red-600">{errors.bookingName}</p>}
            </div>

            {/* Date of Arrival */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Arrival</label>
              <div className="relative">
                <Input
                  value={formData2.dateOfArrival}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, dateOfArrival: e.target.value })}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Select date"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.dateOfArrival && <p className="mt-1 text-sm text-red-600">{errors.dateOfArrival}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={formData2.country}
                onChange={(e) => setFormData2({ ...formData2, country: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Indonesia">Indonesia</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Singapore">Singapore</option>
                <option value="Thailand">Thailand</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <Input
                value={formData2.nationality}
                placeholder="Nationality"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, nationality: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Hotel Transfer Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel transfer service? <span className="text-red-500">*</span>
              </label>
              <select
                value={formData2.hotelTransfer}
                onChange={(e) => {
                  setFormData2({ ...formData2, hotelTransfer: e.target.value });
                  validateField('hotelTransfer', e.target.value);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.hotelTransfer && <p className="mt-1 text-sm text-red-600">{errors.hotelTransfer}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Comments, Request, Question)
              </label>
              <Textarea
                value={formData2.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData2({ ...formData2, notes: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Enter any additional notes, comments, or special requests..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 