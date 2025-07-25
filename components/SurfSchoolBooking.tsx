"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { setMasterData } from "@/lib/masterDataHelpers"
import { MasterDataResponse } from "@/lib/masterDataTypes"
import { 
  getSchedulesUrl, 
  getMasterDataUrl, 
  getBookingUrl,
  getApplyVoucherUrl,
  getGenerateNumberUrl,
  getCheckDraftsUrl,
  API_CONFIG 
} from "@/lib/config"
import BookingHeader from "./BookingHeader"
import BookingFooter from "./BookingFooter"
import BookingSummary from "./BookingSummary"
import CustomerInformationForm from "./CustomerInformationForm"
import SurfAbility from "./SurfAbility"
import ParticipantForm from "./ParticipantForm"
import LessonsToursSpecifications from "./LessonsToursSpecifications"
import LoadingSpinner from "./LoadingSpinner"

type ActivityKey = "surfLessons" | "surfTours";

interface AdultForm {
  name: string;
  level: string;
}
interface ChildForm {
  name: string;
  age: string;
  level: string;
}

const activityLabelMap: Record<string, string> = {
  surfLessons: "Surf Lessons",
  surfTours: "Surf Tours",
};

type VoucherData = {
  voucher_code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  net_amount: number;
  promo_no: string;
  message: string;
};

export default function SurfSchoolBooking() {
  // Add client-side rendering check
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [selectedActivities, setSelectedActivities] = useState<Record<ActivityKey, boolean>>({
    surfLessons: true,
    surfTours: false,
  })

  const [formData, setFormData] = useState<{
    adults: AdultForm[];
    children: ChildForm[];
  }>({
    adults: [],
    children: [],
  })

  const [duration, setDuration] = useState("1-day");

  const [reservationDays, setReservationDays] = useState([
    { date: "", time: "" }, // untuk day 1
  ]);

  const [adultCount, setAdultCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [packageList, setPackageList] = useState([]);

  const [selectedPackages, setSelectedPackages] = useState<{ [key: string]: any }>({});
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const [draftData, setDraftData] = useState<any>(null);

  // Fetch schedules from API
  const fetchSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const response = await fetch(getSchedulesUrl(), {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSchedules(data.data);
      } else {
        console.error('Failed to fetch schedules:', data.message);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Fetch master data from API
  const fetchMasterData = async () => {
    try {
      const response = await fetch(getMasterDataUrl(), {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      const data: MasterDataResponse = await response.json();
      
      if (data.success) {
        setMasterData(data.data); // Store raw master data
      } else {
      }
    } catch (error) {
    }
  };

  // Load schedules on component mount
  useEffect(() => {
    if (isClient) {
      fetchSchedules();
      fetchMasterData();
    }
  }, [isClient]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && isClient) {
      const raw = localStorage.getItem("surf-booking-data");
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setFormData(saved.formData || { adults: [], children: [] });
          setSelectedActivities(saved.selectedActivities || { surfLessons: true, surfTours: false });
          setDuration(saved.duration || "1-day");
          setReservationDays(saved.reservationDays || [{ date: "", time: "" }]);
          setAdultCount(saved.adultCount || 0);
          setChildrenCount(saved.childrenCount || 0);
          setSelectedPackages(saved.selectedPackages || {});
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
      }
    }
  }, [isClient]);

  // Save data to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined" && isClient) {
      localStorage.setItem("surf-booking-data", JSON.stringify({
        formData,
        selectedActivities,
        duration,
        reservationDays,
        adultCount,
        childrenCount,
        selectedPackages,
      }));
    }
  }, [formData, selectedActivities, duration, reservationDays, adultCount, childrenCount, selectedPackages, isClient]);

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

  // Build dynamic summary from props
  const activityLabels = Object.entries(selectedActivities)
    .filter(([_, v]) => v)
    .map(([k]) => activityLabelMap[k] || k)
    .join(", ");
  const durationLabel = duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days";
  const criteria = `${activityLabels} | ${durationLabel} | ${adultCount} Adult${childrenCount > 0 ? ` | ${childrenCount} Children` : ""}`;

  // Ambil level unik dari adults & children
  const allLevels = [
    ...formData.adults.map(a => a.level),
    ...formData.children.map(c => c.level)
  ].filter(Boolean);
  const uniqueLevels = Array.from(new Set(allLevels));
  // Ambil inisial nama pertama (jika ada)
  const firstName = formData.adults[0]?.name || formData.children[0]?.name || "-";
  const initials = firstName ? firstName.split(" ").map(s => s[0]).join("").slice(0,3).toLowerCase() : "-";
  const levelLabel = uniqueLevels.length > 0 ? uniqueLevels.join(", ") : "-";

  // Currency state & options
  const [currency, setCurrency] = useState("IDR");
  const currencyOptions = [
    { code: "IDR", label: "Indonesian Rupiah", rate: 1 },
    { code: "USD", label: "United State Dollar", rate: 0.000065 },
    { code: "AUD", label: "Australian Dollar", rate: 0.0001 },
    { code: "SGD", label: "Singapore Dollar", rate: 0.00009 },
    { code: "JPY", label: "Japanese Yen", rate: 0.0098 },
    { code: "EUR", label: "Euro", rate: 0.00006 },
  ];
  const selectedCurrency = currencyOptions.find(c => c.code === currency) || currencyOptions[0];

  function getDisplayPrice(price: any) {
    let num = typeof price === 'number' ? price : parseFloat((price || '').toString().replace(/,/g, ''));
    num = Math.round(num * selectedCurrency.rate);
    return isNaN(num) ? '-' : `${selectedCurrency.code} ${num.toLocaleString()}`;
  }

  const selectedActivityLabels = Object.entries(selectedActivities)
    .filter(([_, v]) => v)
    .map(([k]) => activityLabelMap[k] || k)
    .join(", ");

  const adultsSummary = formData.adults.length
    ? formData.adults.map((a, i) => `${a.name || '-'} (${a.level || '-'})`).join(', ')
    : '-';
  const childrenSummary = formData.children.length
    ? formData.children.map((c, i) => `${c.name || '-'} (${c.age || '-'}, ${c.level || '-'})`).join(', ')
    : '-';

  // State for activity selection logic (individual/peer)
  const [selectedActivityType, setSelectedActivityType] = useState<"individual" | "peer" | null>(null);
  
  // State for last alert message
  const [alerts, setAlerts] = useState<string[]>([]);

  // Toast alert function
  function showAlert(msg: string) {
    setAlerts(alerts => [...alerts, msg]);
    setTimeout(() => {
      setAlerts(alerts => alerts.slice(1));
    }, 4000);
  }

  // Helper: get key for a recommendation (for individual: name, for peer: joined names)
  function getRecKey(rec: any) {
    return rec.people.join("|");
  }

  // Handler when a package is selected
  function handleSelect(rec: any) {
    const isIndividual = rec.people.length === 1;
    const isPeer = rec.people.length > 1;
    let newSelected = { ...selectedPackages };

    if (isIndividual) {
      Object.entries(newSelected).forEach(([key, selRec]) => {
        if (selRec.people.length > 1 && selRec.people.includes(rec.people[0])) {
          delete newSelected[key];
        }
      });
      Object.entries(newSelected).forEach(([key, selRec]) => {
        if (selRec.people.length === 1 && selRec.people[0] === rec.people[0]) {
          delete newSelected[key];
        }
      });
      newSelected[getRecKey(rec)] = rec;
    } else if (isPeer) {
      rec.people.forEach((person: string) => {
        Object.entries(newSelected).forEach(([key, selRec]) => {
          if (selRec.people.length === 1 && selRec.people[0] === person) {
            delete newSelected[key];
          }
        });
      });
      Object.entries(newSelected).forEach(([key, selRec]) => {
        if (selRec.people.length > 1 && selRec.people.some((p: string) => rec.people.includes(p))) {
          delete newSelected[key];
        }
      });
      newSelected[getRecKey(rec)] = rec;
    }
    setSelectedPackages(newSelected);
  }

  function handleCancel(recKey: string) {
    setSelectedPackages(prev => {
      const newSelected = { ...prev };
      delete newSelected[recKey];
      return newSelected;
    });
  }

  // Helper: get all participant names
  const allParticipantNames = [
    ...formData.adults.map(a => a.name),
    ...formData.children.map(c => c.name)
  ].filter(Boolean);

  // Helper: check if a participant is covered by any selected package
  function isParticipantCovered(name: string) {
    return Object.values(selectedPackages).some((rec: any) => rec.people.includes(name));
  }

  // Validation: are all participants covered?
  const allParticipantsSelected = allParticipantNames.length > 0 && allParticipantNames.every(isParticipantCovered);
  
  const [formData2, setFormData2] = useState({
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

  const [surfAbility, setSurfAbility] = useState({
    stamina: "Good",
    paddling: "Good",
    position: "Good",
    standUp: "Good",
    balancing: "Good",
    safeAwareness: "Good",
    controlBoard: "Good",
    paddleOut: "Good",
    eskimo: "Good",
    catchWave: "Good",
    takeOff: "Good",
    pickUpSpeed: "Good",
    blueWave: "Good",
    selectWave: "Good",
    etiquette: "Good",
  });

  const dummySurfExperience = {
    year: '2023',
    months: '6',
    weeks: '3',
    locations: 'Bali, Lombok, Mentawai',
    boardSize: '6.2 ft',
    stance: 'Regular',
    stanceOther: '',
    waveSize: 'Medium to large (4 - 6 ft)',
    otherSports: ['Skateboarding', 'Snowboarding'],
    lastSurf: 'Two weeks ago at Kuta Beach, Bali',
  };

  const [surfExperience, setSurfExperience] = useState(dummySurfExperience);

  const [errors, setErrors] = useState<any>({});

  // Validasi terpusat untuk semua form
  function validateAll() {
    const newErrors: any = {};

    // Validasi customer info
    if (!formData2.fullName) newErrors.fullName = "Full name is required";
    if (!formData2.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData2.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData2.hotel) newErrors.hotel = "Hotel is required";
    if (!formData2.hotelAddress) newErrors.hotelAddress = "Hotel address is required";
    if (!formData2.bookingName) newErrors.bookingName = "Booking name is required";
    if (!formData2.hotelTransfer) newErrors.hotelTransfer = "Hotel transfer is required";

    // Validasi aktivitas
    if (!Object.values(selectedActivities).some(Boolean)) {
      newErrors.activities = "Please select at least one surfing activity";
    }

    // Validasi peserta
    if (adultCount === 0 && childrenCount === 0) {
      newErrors.participants = "At least one participant required";
    }
    formData.adults.forEach((a, i) => {
      if (!a.name) newErrors[`adult_name_${i}`] = "Name required";
      if (!a.level) newErrors[`adult_level_${i}`] = "Level required";
    });
    formData.children.forEach((c, i) => {
      if (!c.name) newErrors[`child_name_${i}`] = "Name required";
      if (!c.age) newErrors[`child_age_${i}`] = "Age required";
      if (!c.level) newErrors[`child_level_${i}`] = "Level required";
    });

    // Validasi reservation
    reservationDays.forEach((r, i) => {
      if (!r.date) newErrors[`reservation_date_${i}`] = "Date required";
      if (!r.time) newErrors[`reservation_time_${i}`] = "Time required";
      // else if (r.date) {
      //   const today = new Date();
      //   const resDate = new Date(r.date);
      //   if (resDate < new Date(today.toISOString().split('T')[0])) {
      //     newErrors[`reservation_date_${i}`] = "Date cannot be in the past";
      //   }
      // }
    });

    // Validasi paket
    if (Object.keys(selectedPackages).length === 0) {
      newErrors.selectedPackages = "Please select at least one package";
    }

    // Validasi payment
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

    return newErrors;
  }

  // Handler tombol Payment
  async function handlePayment() {
    const validationErrors = validateAll();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      // Show toast with validation errors
      const errorMessages = Object.values(validationErrors).join('\n');
      showAlert(`Please complete the following data:\n\n${errorMessages}`);
      return;
    }
  
    try {
      // 0. Check draft booking for agent_code (default AGT001)
      const agentCode = "AGT001";
      const draft = await checkDrafts("agent", agentCode);
      setDraftData?.(draft);
      
      if (draft?.count > 0) {
        showAlert(`There are ${draft.count} draft bookings for agent ${agentCode}. Please complete or delete drafts before creating a new booking.`);
        return;
      }
  
      // 1. Generate booking number
      const bookingNumber = await generateBookingNumber();
  
      // 2. Mapping data ke payload backend
      const totalQty = (adultCount || 0) + (childrenCount || 0);
      const gross = totalAmount || 0;
      const disc = voucherData?.discount_amount ? Math.round(Number(voucherData.discount_amount)) : 0;
      const discp = voucherData?.discount_type === "percentage" ? Number(voucherData.discount_value || 0) : 0;
      const nett = voucherData?.net_amount ? Math.round(Number(voucherData.net_amount)) : gross;
      const promo_no = voucherData?.promo_no || "";
      const voucher_code = voucherData?.voucher_code || "";
  
      const booking_details = Object.values(selectedPackages || {}).map((pkg: any) => ({
        code: pkg.pkg?.id ? `PKG${pkg.pkg.id.toString().padStart(3, '0')}` : "",
        name: pkg.pkg?.title || "",
        price: pkg.pkg?.price || 0,
        qty: 1, // asumsikan 1 per paket
        gross: pkg.pkg?.price || 0,
        disc: 0,
        discp: 0,
        nett: pkg.pkg?.price || 0,
      }));
  
      const booking_persons = [
        ...(formData?.adults || []).map((a: any) => ({ name: a.name, medical: "" })),
        ...(formData?.children || []).map((c: any) => ({ name: c.name, medical: "" })),
      ];
  
      const bookingPayload = {
        booking_number: bookingNumber,
        date: reservationDays?.[0]?.date || "",
        type: "W",
        agent: "Y",
        agent_code: agentCode,
        comm: 0,
        member_code: "MEM001",
        member_type: "I",
        qty: totalQty,
        gross,
        disc,
        discp,
        nett,
        paid_b: paymentMethod === "bank" ? nett : 0,
        paid_c: paymentMethod === "cash" ? nett : 0,
        paid_o: paymentMethod === "paypal" ? nett : 0,
        paid_s: paymentMethod === "midtrans" ? nett : 0,
        bank_code_b: "",
        promo_no,
        voucher_code,
        save_as_draft: false,
        booking_details,
        booking_persons,
      };
  
      const response = await fetch(getBookingUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.TOKEN}`,
        },
        body: JSON.stringify(bookingPayload),
        credentials: "omit",
      });
  
      const data = await response.json();
  
      if (data.success) {
        showAlert(`Booking successful! Booking number: ${bookingNumber}`);
        // TODO: redirect to success page or display booking number in UI
      } else {
        showAlert(data.message || "Booking failed");
      }
    } catch (err: any) {
      showAlert(err?.message || "An error occurred while processing the booking.");
      console.error("Booking error:", err);
    }
  }

  const [paymentMethod, setPaymentMethod] = useState("midtrans")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);

  // Load formData2 and other states from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && isClient) {
      const raw = localStorage.getItem("surf-booking-data");
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setFormData2(saved.formData2 || {
            title: "Mr",
            fullName: "",
            email: "",
            mobilePhone: "",
            hotel: "",
            hotelAddress: "",
            bookingName: "",
            dateOfArrival: "",
            country: "Indonesia",
            nationality: "",
            hotelTransfer: "No",
            notes: "",
          });
          setSurfAbility(saved.surfAbility || {
            stamina: "Good",
            paddling: "Good",
            position: "Good",
            standUp: "Good",
            balancing: "Good",
            safeAwareness: "Good",
            controlBoard: "Good",
            paddleOut: "Good",
            eskimo: "Good",
            catchWave: "Good",
            takeOff: "Good",
            pickUpSpeed: "Good",
            blueWave: "Good",
            selectWave: "Good",
            etiquette: "Good",
          });
          setSurfExperience(saved.surfExperience || dummySurfExperience);
          setAgreeTerms(saved.agreeTerms || false);
        } catch (error) {
          console.error('Error parsing localStorage data for formData2:', error);
        }
      }
    }
  }, [isClient]);

  // Save formData2 and other states to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && isClient) {
      try {
        const existing = localStorage.getItem("surf-booking-data");
        const existingData = existing ? JSON.parse(existing) : {};
        localStorage.setItem("surf-booking-data", JSON.stringify({
          ...existingData,
          formData2,
          surfAbility,
          surfExperience,
          agreeTerms,
        }));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [formData2, surfAbility, surfExperience, agreeTerms, isClient]);

  const bookingData2 = {
    dateOfLesson: "19-07-2025",
    duration: "1 Day",
    pax: "1 Adult | 1 Children",
  }

  const customerInfo = {
    fullName: formData2.fullName,
    email: formData2.email,
    mobile: formData2.mobilePhone,
    hotel: formData2.hotel,
    hotelAddress: formData2.hotelAddress,
    bookingName: formData2.bookingName,
    dateOfArrival: formData2.dateOfArrival,
    country: formData2.country,
    nationality: formData2.nationality,
    notes: formData2.notes,
  }

  const selectedPackagesArr = Object.values(selectedPackages);
  const totalAmount = selectedPackagesArr.reduce((sum, pkg) => {
    const price = pkg?.pkg?.price || pkg?.price || 0;
    return sum + (typeof price === 'number' ? price : 0);
  }, 0);

  async function applyVoucher() {
    setPromoMessage("");
    setPromoSuccess(false);

    try {
      const response = await fetch(getApplyVoucherUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.TOKEN}`,
        },
        body: JSON.stringify({
          voucher_code: promoCode,
          gross_amount: totalAmount,
        }),
        credentials: "omit",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPromoMessage(data.message || "Voucher not valid.");
        setPromoSuccess(false);
        setVoucherData(null);
        return;
      }

      setPromoMessage(data.data?.message || data.message || "Voucher applied successfully!");
      setPromoSuccess(true);
      setVoucherData(data.data);
    } catch (err) {
      setPromoMessage("Failed to apply voucher. Please try again.");
      setPromoSuccess(false);
      setVoucherData(null);
    }
  }

  async function generateBookingNumber() {
    try {
      const response = await fetch(getGenerateNumberUrl(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.TOKEN}`,
        },
        credentials: "omit",
      });
      const data = await response.json();
      if (data.success) {
        return data.data.booking_number;
      } else {
        throw new Error(data.message || "Failed to generate booking number");
      }
    } catch (err) {
      throw new Error("Failed to generate booking number");
    }
  }

  async function checkDrafts(type: string, code: string) {
    try {
      const response = await fetch(getCheckDraftsUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.TOKEN}`,
        },
        body: JSON.stringify({ type, code }),
        credentials: "omit",
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to check drafts");
      }
    } catch (err) {
      throw new Error("Failed to check drafts");
    }
  }

  // Prevent hydration error by not rendering until client-side
  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      <BookingHeader />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-sm border border-gray-200">
          <div className="p-6">
            {/* Title Section */}
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
              <h1 className="text-xl font-semibold text-cyan-600 uppercase">Your Surf Booking</h1>
            </div>

            {/* Currency Selector */}
            <LessonsToursSpecifications
              currency={currency}
              setCurrency={setCurrency}
              currencyOptions={currencyOptions}
              selectedActivities={selectedActivities}
              setSelectedActivities={setSelectedActivities}
              duration={duration}
              setDuration={setDuration}
              reservationDays={reservationDays}
              setReservationDays={setReservationDays}
              schedules={schedules}
              errors={errors}
            />

            <ParticipantForm
              formData={formData}
              setFormData={setFormData}
              adultCount={adultCount}
              setAdultCount={setAdultCount}
              childrenCount={childrenCount}
              setChildrenCount={setChildrenCount}
              selectedActivities={selectedActivities}
              reservationDays={reservationDays}
              selectedPackages={selectedPackages}
              errors={errors}
              getDisplayPrice={getDisplayPrice}
              getRecKey={getRecKey}
              handleSelect={handleSelect}
            />

            {/* Toast Alert Container */}
            <div className="fixed bottom-6 right-6 z-50 space-y-2">
              {alerts.map((msg, i) => (
                <div key={i} className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded px-4 py-3 shadow">
                  {msg}
                </div>
              ))}
            </div>

            <CustomerInformationForm 
              formData2={formData2}
              setFormData2={setFormData2}
              errors={errors}
            />

            <SurfAbility 
              surfAbility={surfAbility} 
              setSurfAbility={setSurfAbility}
              surfExperience={surfExperience}
              setSurfExperience={setSurfExperience}
              errors={errors}
            />

            {/* Information Box */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
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
          </div>
        </div>
      </div>

      <BookingSummary
        reservationDays={reservationDays}
        duration={duration}
        adultCount={adultCount}
        childrenCount={childrenCount}
        customerInfo={customerInfo}
        selectedPackages={selectedPackages} 
        getDisplayPrice={getDisplayPrice}
        handleCancel={handleCancel}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        applyVoucher={applyVoucher}
        promoMessage={promoMessage}
        promoSuccess={promoSuccess}
        totalAmount={totalAmount}
        voucherData={voucherData}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        agreeTerms={agreeTerms}
        setAgreeTerms={setAgreeTerms}
        handlePayment={handlePayment}
        errors={errors}
      />

      <BookingFooter />

      {/* Tampilkan error global jika ada */}
      {errors.selectedPackages && (
        <div className="text-red-500 text-sm mb-2">{errors.selectedPackages}</div>
      )}
      {errors.participants && (
        <div className="text-red-500 text-sm mb-2">{errors.participants}</div>
      )}
    </div>
  )
} 