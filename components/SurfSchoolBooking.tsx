"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, Clock, Star, Facebook, Instagram, Youtube, HelpCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Step2Activities from "@/components/step2-activities"
import { fetchData } from "@/lib/fetchData"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Step3PersonalInfo from "./step3-personal-info"
import Step4Payment from "./step4-payment"

type ActivityKey = "surfLessons" | "surfTours";

const activitiesList: { key: ActivityKey; label: string }[] = [
  { key: "surfLessons", label: "Surf Lessons" },
  { key: "surfTours", label: "Surf Tours" },
  // { key: "surfBoardRental", label: "Surf Board Rental" },
];

const durationOptions = [
  { value: "1-day", label: "1 Day" },
  { value: "2-days", label: "2 Days" },
  { value: "3-days", label: "3 Days" },
];

interface AdultForm {
  name: string;
  level: string;
}
interface ChildForm {
  name: string;
  age: string;
  level: string;
}

export default function SurfSchoolBooking() {
  // //contoh fetch data
  // const data = fetchData("/master-data")
  // console.log(data)

  const [selectedActivities, setSelectedActivities] = useState<Record<ActivityKey, boolean>>({
    surfLessons: true,
    surfTours: false,
  })

  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<{
    adults: AdultForm[];
    children: ChildForm[];
    // tambahkan field lain sesuai kebutuhan
  }>({
    adults: [],
    children: [],
    // tambahkan field lain sesuai kebutuhan
  })

  const [duration, setDuration] = useState("1-day");

  const [reservationDays, setReservationDays] = useState([
    { date: "", time: "" }, // untuk day 1
  ]);

  const [adultCount, setAdultCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);

  const [errors, setErrors] = useState<{
    adults?: string[];
    children?: string[];
    reservationDays?: string[];
    activities?: string;
  }>({});

  useEffect(() => {
    const dayCount = parseInt(duration); // "1-day" => 1, "2-days" => 2, dst
    setReservationDays((prev) => {
      const newArr = [...prev];
      if (newArr.length < dayCount) {
        // tambah
        while (newArr.length < dayCount) newArr.push({ date: "", time: "" });
      } else if (newArr.length > dayCount) {
        // kurangi
        newArr.length = dayCount;
      }
      return newArr;
    });
  }, [duration]);

  // const handleSubmit = async () => {
  //   // Siapkan payload sesuai kebutuhan API
  //   const payload = {
  //     // mapping dari formData ke struktur API
  //     // contoh:
  //     booking_persons: [
  //       ...formData.adults.map(a => ({ name: a.name, level: a.level })),
  //       ...formData.children.map(c => ({ name: c.name, age: c.age, level: c.level }))
  //     ],
  //     reservation_days: reservationDays,
  //     // tambahkan field lain sesuai kebutuhan API
  //   };    

  //   try {
  //     const res = await fetch("http://localhost:8000/api/v1/booking", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer eMh79MH906bM#m2zyeYsmWtyAxBfjWeGAHFSdertR"
  //       },
  //       body: JSON.stringify(payload)
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       // lanjut ke step berikutnya
  //       setCurrentStep(2);
  //     } else {
  //       alert("Gagal submit: " + data.message);
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       alert("Error: " + err.message);
  //     } else {
  //       alert("Unknown error");
  //     }
  //   }
  // };

  const handleSubmit = () => {
    // Validasi lengkap per field
    const newErrors: typeof errors = {};
    // 1. Minimal 1 adult/children
    if (adultCount === 0 && childrenCount === 0) {
      newErrors.activities = "Please add at least 1 adult or 1 child.";
    }
    // 2. Nama tidak boleh kosong & level harus diisi
    newErrors.adults = [];
    for (let i = 0; i < formData.adults.length; i++) {
      if (!formData.adults[i].name.trim()) {
        newErrors.adults[i] = "Name is required.";
      } else if (!formData.adults[i].level) {
        newErrors.adults[i] = "Level is required.";
      } else {
        newErrors.adults[i] = "";
      }
    }
    newErrors.children = [];
    for (let i = 0; i < formData.children.length; i++) {
      if (!formData.children[i].name.trim()) {
        newErrors.children[i] = "Name is required.";
      } else if (!formData.children[i].age) {
        newErrors.children[i] = "Age is required.";
      } else if (!formData.children[i].level) {
        newErrors.children[i] = "Level is required.";
      } else {
        newErrors.children[i] = "";
      }
    }
    // 3. Reservation date & time harus diisi dan tidak boleh di masa lalu
    newErrors.reservationDays = [];
    for (let i = 0; i < reservationDays.length; i++) {
      if (!reservationDays[i].date) {
        newErrors.reservationDays[i] = "Date is required.";
      } else if (!reservationDays[i].time) {
        newErrors.reservationDays[i] = "Time is required.";
      } else {
        const today = new Date();
        const resDate = new Date(reservationDays[i].date);
        if (resDate < new Date(today.toISOString().split('T')[0])) {
          newErrors.reservationDays[i] = "Date cannot be in the past.";
        } else {
          newErrors.reservationDays[i] = "";
        }
      }
    }
    // 4. Minimal satu aktivitas harus dipilih
    if (!Object.values(selectedActivities).some(Boolean)) {
      newErrors.activities = "Please select at least one surfing activity.";
    }
    // Cek jika ada error
    const hasError =
      (newErrors.adults && newErrors.adults.some(e => e)) ||
      (newErrors.children && newErrors.children.some(e => e)) ||
      (newErrors.reservationDays && newErrors.reservationDays.some(e => e)) ||
      newErrors.activities;
    setErrors(newErrors);
    if (hasError) return;
    setErrors({});
    setCurrentStep(2);
  };

  // Level options dinamis
  const getLevelOptions = () => {
    const { surfLessons, surfTours } = selectedActivities;
    if (surfLessons && !surfTours) return ["beginner"];
    if (!surfLessons && surfTours) return ["beginner", "intermediate"];
    if (surfLessons && surfTours) return ["beginner", "intermediate"];
    return ["beginner"]; // default
  };
  const levelOptions = getLevelOptions();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image Section */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/6299936/pexels-photo-6299936.jpeg"
          alt="Surf School Header"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Logo Top Left */}
        <div className="absolute top-4 left-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="text-black font-bold text-sm leading-tight">
            <div>ODYSSEYS</div>
            <div>SURF</div>
            <div>SCHOOL</div>
          </div>
        </div>

        {/* Social Icons Top Right */}
        <div className="absolute top-4 right-6 flex gap-2">
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <Facebook className="w-4 h-4 text-gray-600" />
          </div>
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <Instagram className="w-4 h-4 text-gray-600" />
          </div>
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <Youtube className="w-4 h-4 text-gray-600" />
          </div>
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <HelpCircle className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Modern Progress Steps */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line Background */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

            {/* Active Progress Line */}
            <div
              className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 z-10 transition-all duration-500"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "33.33%" : currentStep === 3 ? "66.66%" : "100%",
              }}
            ></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-20">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 1
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > 1 ? "✓" : "01"}
              </div>
              <div className="mt-3 text-center">
                <div
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    currentStep >= 1 ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  STEP 1
                </div>
                <div
                  className={`text-sm font-medium mt-1 transition-colors duration-300 ${
                    currentStep >= 1 ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  Find Surf Activities
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-20">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 2
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : currentStep === 1
                      ? "bg-white border-2 border-orange-500 text-orange-500"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > 2 ? "✓" : "02"}
              </div>
              <div className="mt-3 text-center">
                <div
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    currentStep >= 2 ? "text-orange-600" : currentStep === 1 ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  STEP 2
                </div>
                <div
                  className={`text-sm font-medium mt-1 transition-colors duration-300 ${
                    currentStep >= 2 ? "text-gray-800" : currentStep === 1 ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  Create Surf Activities
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-20">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 3
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : currentStep === 2
                      ? "bg-white border-2 border-orange-500 text-orange-500"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > 3 ? "✓" : "03"}
              </div>
              <div className="mt-3 text-center">
                <div
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    currentStep >= 3 ? "text-orange-600" : currentStep === 2 ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  STEP 3
                </div>
                <div
                  className={`text-sm font-medium mt-1 transition-colors duration-300 ${
                    currentStep >= 3 ? "text-gray-800" : currentStep === 2 ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  Personal Information
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center relative z-20">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= 4
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : currentStep === 3
                      ? "bg-white border-2 border-orange-500 text-orange-500"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > 4 ? "✓" : "04"}
              </div>
              <div className="mt-3 text-center">
                <div
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    currentStep >= 4 ? "text-orange-600" : currentStep === 3 ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  STEP 4
                </div>
                <div
                  className={`text-sm font-medium mt-1 transition-colors duration-300 ${
                    currentStep >= 4 ? "text-gray-800" : currentStep === 3 ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-sm border border-gray-200">
          <div className="p-6">
            {/* Title Section */}
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
              <h1 className="text-xl font-semibold text-cyan-600 uppercase">Design Your Surfing Experience</h1>
            </div>

            {currentStep === 1 && (
              <div className="max-w-5xl mx-auto p-6">
                {/* Lessons & Tours Specifications */}
                <div className="bg-gray-100 p-4 mb-1">
                  <h2 className="text-sm font-semibold text-sky-600 mb-4">Lessons & Tours Specifications</h2>
                </div>

                <div className="p-4 bg-white">
                  {/* Surfing Activities */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-orange-500 w-32">Surfing Activities</span>
                      <div className="flex items-center gap-6">
                        {activitiesList.map((activity) => (
                          <label key={activity.key} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedActivities[activity.key]}
                              onCheckedChange={(checked) =>
                                setSelectedActivities((prev) => ({
                                  ...prev,
                                  [activity.key]: checked as boolean,
                                }))
                              }
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{activity.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {errors.activities && <span className="text-red-500 text-xs ml-32">{errors.activities}</span>}
                  </div>

                  {/* Duration */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-orange-500 w-32">Duration</span>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="w-24 h-8 text-sm">
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
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-orange-500 w-32">
                          Reservation Day {idx + 1}
                        </span>
                        <Input
                          className="w-36 h-8 text-sm"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={res.date}
                          onChange={e => {
                            const newArr = [...reservationDays];
                            newArr[idx].date = e.target.value;
                            setReservationDays(newArr);
                          }}
                        />
                        <Input
                          className="w-28 h-8 text-sm"
                          type="time"
                          value={res.time}
                          onChange={e => {
                            const newArr = [...reservationDays];
                            newArr[idx].time = e.target.value;
                            setReservationDays(newArr);
                          }}
                        />
                        {errors.reservationDays && errors.reservationDays[idx] && (
                          <span className="text-red-500 text-xs ml-32">{errors.reservationDays[idx]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-100 p-4 mb-1">
                  <h2 className="text-sm font-semibold text-sky-600">Personal Information</h2>
                </div>

                <div className="p-4 bg-white">
                  <div className="text-xs text-gray-600 mb-4 space-y-1">
                    <p>Please insert names and surf proficiency level.</p>
                    <p>If you take Intermediate Lesson/ Surf Tour, you must to fill up the surf abilities form.</p>
                    <p>The form is available on the next personal information page.</p>
                  </div>

                  {/* Adult Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-orange-500 w-16">Adult</span>
                      <Select value={adultCount.toString()} onValueChange={val => {
                        const count = parseInt(val);
                        setAdultCount(count);
                        setFormData(prev => ({
                          ...prev,
                          adults: Array.from({ length: count }, (_, i) => prev.adults[i] || { name: "", level: "beginner" })
                        }));
                      }}>
                        <SelectTrigger className="w-16 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 ml-20">
                      {formData.adults.slice(0, adultCount).map((adult, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm w-12">Name</span>
                              <Input
                                className="w-52 h-8 text-sm"
                                value={adult.name}
                                onChange={e => {
                                  const newAdults = [...formData.adults];
                                  newAdults[idx].name = e.target.value;
                                  setFormData(prev => ({ ...prev, adults: newAdults }));
                                }}
                                placeholder="Your name..."
                              />
                            </div>
                            <Select
                              value={adult.level}
                              onValueChange={val => {
                                const newAdults = [...formData.adults];
                                newAdults[idx].level = val;
                                setFormData(prev => ({ ...prev, adults: newAdults }));
                              }}
                            >
                              <SelectTrigger className="w-28 h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {levelOptions.map(opt => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {errors.adults && errors.adults[idx] && (
                            <span className="text-red-500 text-xs ml-12">{errors.adults[idx]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Children Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-16">
                        <span className="text-sm font-semibold text-orange-500">Children</span>
                        <div className="text-xs text-gray-500">7 until 15 years</div>
                      </div>
                      <Select value={childrenCount.toString()} onValueChange={val => {
                        const count = parseInt(val);
                        setChildrenCount(count);
                        setFormData(prev => ({
                          ...prev,
                          children: Array.from({ length: count }, (_, i) => prev.children[i] || { name: "", age: "7-years", level: "beginner" })
                        }));
                      }}>
                        <SelectTrigger className="w-16 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 ml-20">
                      {formData.children.slice(0, childrenCount).map((child, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm w-12">Name</span>
                              <Input
                                className="w-52 h-8 text-sm"
                                value={child.name}
                                onChange={e => {
                                  const newChildren = [...formData.children];
                                  newChildren[idx].name = e.target.value;
                                  setFormData(prev => ({ ...prev, children: newChildren }));
                                }}
                                placeholder="Your name..."
                              />
                            </div>
                            <Select
                              value={child.age}
                              onValueChange={val => {
                                const newChildren = [...formData.children];
                                newChildren[idx].age = val;
                                setFormData(prev => ({ ...prev, children: newChildren }));
                              }}
                            >
                              <SelectTrigger className="w-24 h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 9 }, (_, i) => (
                                  <SelectItem key={i + 7} value={`${i + 7}-years`}>{i + 7} Years</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={child.level}
                              onValueChange={val => {
                                const newChildren = [...formData.children];
                                newChildren[idx].level = val;
                                setFormData(prev => ({ ...prev, children: newChildren }));
                              }}
                            >
                              <SelectTrigger className="w-28 h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {levelOptions.map(opt => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {errors.children && errors.children[idx] && (
                            <span className="text-red-500 text-xs ml-12">{errors.children[idx]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      WHATSAPP
                    </Button>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 text-sm font-semibold flex items-center gap-2"
                        onClick={handleSubmit}
                      >
                        NEXT
                        <Star className="w-4 h-4 fill-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && <Step2Activities onNextStep={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
            {currentStep === 3 && <Step3PersonalInfo onNextStep={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />}
            {currentStep === 4 && <Step4Payment />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Products */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-white">PRODUCTS</h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>Surfing Lessons</li>
                <li>Surfing Packages</li>
                <li>Surfing Schedules</li>
                <li>Surfing Instructors</li>
                <li>Surf Board Rental</li>
                <li>Rates & Pricing</li>
                <li>Surf Equipments</li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-white">ABOUT US</h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>FAQ</li>
                <li>Testimonials</li>
                <li>Photo Gallery</li>
                <li>News & Events</li>
                <li>A board for a smile</li>
                <li>Our Location</li>
                <li>Terms & Conditions</li>
                <li>Partners & Certification</li>
                <li>Careers</li>
                <li>Partnership</li>
                <li>Hot Deals</li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-white">HELP</h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>Blog</li>
                <li>Bali Surfing Information</li>
                <li>Surfing Articles</li>
                <li>Sitemap</li>
                <li>Links</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <div className="text-xs text-gray-300 space-y-1">
                <p>Odysseys Surf School - Mercure Kuta Hotel Arcade</p>
                <p>Jalan Pantai Kuta, Kuta Bali</p>
                <p>📞 Call/ WA/sms +6281766642225</p>
                <p>📧 odysseysurfschool</p>
                <p>🆔 Using ID : Odysseys-Ricmond</p>
                <p>💬 Support with us on Skype</p>
                <p>📠 Fax: (0361) 7631026</p>
                <p>📧 info@odysseysurfschool.com</p>
              </div>

              {/* Language Selector */}
              <div className="mt-4">
                <Select defaultValue="english">
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">ENGLISH</SelectItem>
                    <SelectItem value="indonesian">INDONESIAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Partners Section */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h3 className="text-sm font-bold mb-4 text-gray-400">OUR PARTNERS</h3>
            <div className="flex items-center gap-8">
              <div className="text-white text-lg font-bold">OAKLEY</div>
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex gap-1">
                {[
                  "bg-red-500",
                  "bg-blue-500",
                  "bg-white",
                  "bg-red-600",
                  "bg-blue-600",
                  "bg-orange-500",
                  "bg-gray-600",
                  "bg-orange-600",
                ].map((color, i) => (
                  <div key={i} className={`w-6 h-10 ${color} rounded-sm`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 