import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "./ui/textarea"
import { Calendar } from "lucide-react"

interface CustomerInformationFormProps {
  formData2: any
  setFormData2: (data: any) => void
  errors: any
}

export default function CustomerInformationForm({ formData2, setFormData2, errors }: CustomerInformationFormProps) {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-gray-100 p-3 sm:p-4 mb-1">
        <h2 className="text-xs sm:text-sm font-semibold text-sky-600">Customer Information</h2>
      </div>
      <div className="bg-white">
        <div className="my-4 sm:my-8 mx-2 sm:mx-4">
          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Full Booking Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Full Booking Name <span className="text-red-500">(*)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={formData2.title} onValueChange={(value) => setFormData2({ ...formData2, title: value })}>
                    <SelectTrigger className="w-full sm:w-20 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData2.fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, fullName: e.target.value })}
                    className="flex-1 text-xs sm:text-sm"
                    placeholder="Full name"
                  />
                </div>
                {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Email <span className="text-red-500">(*)</span>
                </label>
                <Input
                  type="email"
                  value={formData2.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, email: e.target.value })}
                  placeholder="your@email.com"
                  className="text-xs sm:text-sm"
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">Mobile Phone</label>
                <Input
                  value={formData2.mobilePhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, mobilePhone: e.target.value })}
                  placeholder="Phone number"
                  className="text-xs sm:text-sm"
                />
                {errors.mobilePhone && <div className="text-red-500 text-xs mt-1">{errors.mobilePhone}</div>}
              </div>

              {/* Hotel */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Hotel <span className="text-red-500">(*)</span>
                </label>
                <Input value={formData2.hotel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, hotel: e.target.value })} placeholder="Hotel name" className="text-xs sm:text-sm" />
                {errors.hotel && <div className="text-red-500 text-xs mt-1">{errors.hotel}</div>}
              </div>

              {/* Hotel Address */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Hotel Address <span className="text-red-500">(*)</span>
                </label>
                <Input
                  value={formData2.hotelAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, hotelAddress: e.target.value })}
                  placeholder="Hotel address"
                  className="text-xs sm:text-sm"
                />
                {errors.hotelAddress && <div className="text-red-500 text-xs mt-1">{errors.hotelAddress}</div>}
              </div>

              {/* Booking Name in the Hotel */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Booking Name in the Hotel <span className="text-red-500">(*)</span>
                </label>
                <Input
                  value={formData2.bookingName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, bookingName: e.target.value })}
                  placeholder="Booking name in hotel"
                  className="text-xs sm:text-sm"
                />
                {errors.bookingName && <div className="text-red-500 text-xs mt-1">{errors.bookingName}</div>}
              </div>

              {/* Date of Arrival */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">Date of Arrival</label>
                <div className="relative">
                  <Input
                    value={formData2.dateOfArrival}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, dateOfArrival: e.target.value })}
                    className="pr-10 text-xs sm:text-sm"
                    placeholder="Select date"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                </div>
                {errors.dateOfArrival && <div className="text-red-500 text-xs mt-1">{errors.dateOfArrival}</div>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Country */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">Country</label>
                <Select
                  value={formData2.country}
                  onValueChange={(value) => setFormData2({ ...formData2, country: value })}
                >
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && <div className="text-red-500 text-xs mt-1">{errors.country}</div>}
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">Nationality</label>
                <Input
                  value={formData2.nationality}
                  placeholder="Nationality"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData2({ ...formData2, nationality: e.target.value })}
                  className="text-xs sm:text-sm"
                />
              </div>

              {/* Hotel Transfer Service */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Hotel transfer service? <span className="text-red-500">(*)</span>
                </label>
                <Select
                  value={formData2.hotelTransfer}
                  onValueChange={(value) => setFormData2({ ...formData2, hotelTransfer: value })}
                >
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hotelTransfer && <div className="text-red-500 text-xs mt-1">{errors.hotelTransfer}</div>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Note (Comments, Request, Question)
                </label>
                <Textarea
                  value={formData2.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData2({ ...formData2, notes: e.target.value })}
                  rows={6}
                  className="resize-none text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 