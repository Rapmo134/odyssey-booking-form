"use client"

import { useState } from "react"
import { Calendar, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function Step3PersonalInfo({ onNextStep, onBack }: { onNextStep: () => void, onBack: () => void }) {
  const [formData, setFormData] = useState({
    title: "Mr",
    fullName: "dfjhd",
    email: "rapmo641@gmmail.com",
    mobilePhone: "2332455",
    hotel: "dfgd",
    hotelAddress: "dfvd",
    bookingName: "dfg",
    dateOfArrival: "09-07-2025",
    country: "Indonesia",
    nationality: "dfdg",
    hotelTransfer: "No",
    notes: "vv",
  })

  const [agreeAndContinue, setAgreeAndContinue] = useState(false)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8">
          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Full Booking Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Full Booking Name <span className="text-red-500">(*)</span>
                </label>
                <div className="flex gap-2">
                  <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email <span className="text-red-500">(*)</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Phone</label>
                <Input
                  value={formData.mobilePhone}
                  onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
                />
              </div>

              {/* Hotel */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Hotel <span className="text-red-500">(*)</span>
                </label>
                <Input value={formData.hotel} onChange={(e) => setFormData({ ...formData, hotel: e.target.value })} />
              </div>

              {/* Hotel Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Hotel Address <span className="text-red-500">(*)</span>
                </label>
                <Input
                  value={formData.hotelAddress}
                  onChange={(e) => setFormData({ ...formData, hotelAddress: e.target.value })}
                />
              </div>

              {/* Booking Name in the Hotel */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Booking Name in the Hotel <span className="text-red-500">(*)</span>
                </label>
                <Input
                  value={formData.bookingName}
                  onChange={(e) => setFormData({ ...formData, bookingName: e.target.value })}
                />
              </div>

              {/* Date of Arrival */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Date of Arrival</label>
                <div className="relative">
                  <Input
                    value={formData.dateOfArrival}
                    onChange={(e) => setFormData({ ...formData, dateOfArrival: e.target.value })}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Country</label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger>
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
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Nationality</label>
                <Input
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />
              </div>

              {/* Hotel Transfer Service */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Hotel transfer service? <span className="text-red-500">(*)</span>
                </label>
                <Select
                  value={formData.hotelTransfer}
                  onValueChange={(value) => setFormData({ ...formData, hotelTransfer: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Note (Comments, Request, Question)
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={8}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-8 bg-yellow-100 border border-yellow-200 rounded-lg p-6">
            <div className="text-sm text-gray-700 space-y-2">
              <p className="italic">
                Please arrange your own transportation and please come to the odysseys's shop 15 minutes earlier.
              </p>
              <p className="italic">
                Office's location = inside Mercure kuta hotel - jalan pantai kuta ( next to Hard Rock hotel ),
                Kuta-Bali, Indonesia
              </p>
              <p className="italic">
                Map:{" "}
                <a href="http://goo.gl/0WLN7B" className="text-blue-600 underline">
                  http://goo.gl/0WLN7B
                </a>
              </p>
              <p className="italic">
                Please note, there is no additional hours or re-schedule for the lesson if you come late to our office.
              </p>
            </div>
          </div>

          {/* Agree and Continue */}
          <div className="mt-8 flex items-center justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={agreeAndContinue}
                onCheckedChange={(checked) => setAgreeAndContinue(checked as boolean)}
              />
              <span className="text-sm font-medium text-gray-700">Agree and Continue</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              WHATSAPP
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-semibold flex items-center gap-2"
              disabled={!agreeAndContinue}
              onClick={onNextStep}
            >
              CONFIRMATION
              <Star className="w-5 h-5 fill-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
