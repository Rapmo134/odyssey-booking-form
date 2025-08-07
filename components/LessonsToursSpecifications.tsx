"use client"

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
  onRateChange?: (rate: number) => void;
  paymentMethod?: string;
  selectedActivities: Record<ActivityKey, boolean>;
  setSelectedActivities: (activities: Record<ActivityKey, boolean> | ((prev: Record<ActivityKey, boolean>) => Record<ActivityKey, boolean>)) => void;
  duration: string;
  setDuration: (duration: string) => void;
  reservationDays: Array<{ date: string; time: string }>;
  setReservationDays: (days: Array<{ date: string; time: string }>) => void;
  schedules: Array<{ date: string; time1: string; time2: string }>;
  errors: { [key: string]: string };
  validateField?: (fieldName: string, value: any, context?: any) => void;
}

export default function LessonsToursSpecifications({
  currency,
  setCurrency,
  onRateChange,
  paymentMethod,
  selectedActivities,
  setSelectedActivities,
  duration,
  setDuration,
  reservationDays,
  setReservationDays,
  schedules,
  errors,
  validateField
}: LessonsToursSpecificationsProps) {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-400 rounded-lg p-3 sm:p-4 md:p-5 mb-4 sm:mb-5 md:mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center flex-shrink-0 self-center sm:self-auto">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-800 leading-tight">Lessons & Tours Specifications</h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1 sm:mt-2 leading-relaxed">Configure your surfing activities and schedule</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Currency Selector */}
        {/* <div className="mb-4">
          <CurrencySelector 
            currency={currency} 
            setCurrency={setCurrency} 
            onRateChange={onRateChange}
            paymentMethod={paymentMethod}
            disabled={paymentMethod === 'paypal'}
          />
        </div> */}

        {/* Surfing Activities */}
        <div>
          <div className="mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Surfing Activities</h3>
            <p className="text-xs sm:text-sm text-gray-600">Select the activities you'd like to book</p>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {activitiesList.map((activity) => (
              <label key={activity.key} className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedActivities[activity.key]}
                  onChange={(e) =>
                    setSelectedActivities((prev: Record<ActivityKey, boolean>) => ({
                      ...prev,
                      [activity.key]: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                />
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">{activity.label}</span>
              </label>
            ))}
          </div>
          {errors.activities && (
            <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.activities}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <div className="mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Duration</h3>
            <p className="text-xs sm:text-sm text-gray-600">Choose your booking duration</p>
          </div>
          
          <select 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            className="w-full sm:w-64 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select Duration</option>
            {durationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Reservation Days */}
        <div>
          <div className="mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Reservation Schedule</h3>
            <p className="text-xs sm:text-sm text-gray-600">Select your preferred dates and times</p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {reservationDays.map((res, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Day {idx + 1}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date</label>
                    <select
                      value={res.date}
                      onChange={(e) => {
                        const newArr = [...reservationDays];
                        newArr[idx].date = e.target.value;
                        newArr[idx].time = "";
                        setReservationDays(newArr);
                        
                        if (validateField) {
                          validateField('reservationDate', e.target.value, { index: idx });
                        }
                      }}
                      className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Date</option>
                      {schedules.map(schedule => {
                        const isDateSelected = reservationDays.some((day, dayIndex) => 
                          dayIndex !== idx && day.date === schedule.date
                        );
                        
                        return (
                          <option 
                            key={schedule.date} 
                            value={schedule.date}
                            disabled={isDateSelected}
                          >
                            {schedule.date} {isDateSelected ? "(Already selected)" : ""}
                          </option>
                        );
                      })}
                    </select>
                    {errors[`reservation_date_${idx}`] && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">{errors[`reservation_date_${idx}`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Time</label>
                    <select
                      value={res.time}
                      onChange={(e) => {
                        const newArr = [...reservationDays];
                        newArr[idx].time = e.target.value;
                        setReservationDays(newArr);
                      }}
                      disabled={!res.date}
                      className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Time</option>
                      {(() => {
                        const selectedSchedule = schedules.find(s => s.date === res.date);
                        if (selectedSchedule) {
                          return [
                            { value: selectedSchedule.time1, label: selectedSchedule.time1 },
                            { value: selectedSchedule.time2, label: selectedSchedule.time2 }
                          ].map((timeSlot) => (
                            <option key={timeSlot.value} value={timeSlot.value}>
                              {timeSlot.label}
                            </option>
                          ));
                        }
                        return null;
                      })()}
                    </select>
                    {errors[`reservation_time_${idx}`] && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">{errors[`reservation_time_${idx}`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 