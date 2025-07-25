"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CurrencySelector from "./CurrencySelector"

type ActivityKey = "surfLessons" | "surfTours";

const activitiesList: { key: ActivityKey; label: string }[] = [
  { key: "surfLessons", label: "Surf Lessons" },
  { key: "surfTours", label: "Surf Tours", },
];

const durationOptions = [
  { value: "1-day", label: "1 Day" },
  { value: "2-days", label: "2 Days" },
  { value: "3-days", label: "3 Days" },
];

interface LessonsToursSpecificationsProps {
  currency: string;
  setCurrency: (currency: string) => void;
  currencyOptions: Array<{ code: string; label: string; rate: number }>;
  selectedActivities: Record<ActivityKey, boolean>;
  setSelectedActivities: (activities: Record<ActivityKey, boolean> | ((prev: Record<ActivityKey, boolean>) => Record<ActivityKey, boolean>)) => void;
  duration: string;
  setDuration: (duration: string) => void;
  reservationDays: Array<{ date: string; time: string }>;
  setReservationDays: (days: Array<{ date: string; time: string }>) => void;
  schedules: Array<{ date: string; time1: string; time2: string }>;
  errors: { [key: string]: string };
}

export default function LessonsToursSpecifications({
  currency,
  setCurrency,
  currencyOptions,
  selectedActivities,
  setSelectedActivities,
  duration,
  setDuration,
  reservationDays,
  setReservationDays,
  schedules,
  errors
}: LessonsToursSpecificationsProps) {
  return (
    <>
      {/* Lessons & Tours Specifications */}
      <div className="bg-gray-100 p-3 sm:p-4 mb-1 rounded-lg">
        <h2 className="text-xs sm:text-sm font-semibold text-sky-600">Lessons & Tours Specifications</h2>
      </div>

      <div className="p-3 sm:p-4 bg-white">
        {/* Currency Selector */}
        <div className="mb-4">
          <CurrencySelector currency={currency} setCurrency={setCurrency} currencyOptions={currencyOptions} />
        </div>

        {/* Surfing Activities */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-3">
            <span className="text-xs sm:text-sm font-semibold text-orange-500 w-32">Surfing Activities</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              {activitiesList.map((activity) => (
                <label key={activity.key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedActivities[activity.key]}
                    onCheckedChange={(checked) =>
                      setSelectedActivities((prev: Record<ActivityKey, boolean>) => ({
                        ...prev,
                        [activity.key]: checked as boolean,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-xs sm:text-sm">{activity.label}</span>
                </label>
              ))}
            </div>
          </div>
          {errors.activities && <span className="text-red-500 text-xs ml-0 sm:ml-32">{errors.activities}</span>}
        </div>

        {/* Duration */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
            <span className="text-xs sm:text-sm font-semibold text-orange-500 w-32">Duration</span>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full sm:w-24 h-8 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reservation Day */}
        <div className="mb-6">
          {reservationDays.map((res, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-3 sm:mb-2">
              <span className="text-xs sm:text-sm font-semibold text-orange-500 w-32">
                Reservation Day {idx + 1}
              </span>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <Select
                  value={res.date}
                  onValueChange={(value) => {
                    const newArr = [...reservationDays];
                    newArr[idx].date = value;
                    setReservationDays(newArr);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-36 h-8 text-xs sm:text-sm">
                    <SelectValue placeholder="Select Date" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.map(schedule => (
                      <SelectItem key={schedule.date} value={schedule.date}>
                        {schedule.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={res.time}
                  onValueChange={(value) => {
                    const newArr = [...reservationDays];
                    newArr[idx].time = value;
                    setReservationDays(newArr);
                  }}
                  disabled={!res.date}
                >
                  <SelectTrigger className="w-full sm:w-32 h-8 text-xs sm:text-sm" disabled={!res.date}>
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const selectedSchedule = schedules.find(s => s.date === res.date);
                      if (selectedSchedule) {
                        return [
                          { value: selectedSchedule.time1, label: selectedSchedule.time1 },
                          { value: selectedSchedule.time2, label: selectedSchedule.time2 }
                        ].map((timeSlot) => (
                          <SelectItem key={timeSlot.value} value={timeSlot.value}>
                            {timeSlot.label}
                          </SelectItem>
                        ));
                      }
                      return null;
                    })()}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                {errors[`reservation_date_${idx}`] && (
                  <span className="text-red-500 text-xs ml-0 sm:ml-32">{errors[`reservation_date_${idx}`]}</span>
                )}
                {errors[`reservation_time_${idx}`] && (
                  <span className="text-red-500 text-xs ml-0 sm:ml-32">{errors[`reservation_time_${idx}`]}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 