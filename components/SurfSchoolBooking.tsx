"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Star } from "lucide-react"
import { setMasterData } from "@/lib/masterDataHelpers"
import { MasterDataResponse } from "@/lib/masterDataTypes"
import { 
  getSchedulesUrl, 
  getMasterDataUrl, 
  getBookingUrl,
  getWithoutPaymentUrl,
  getApplyVoucherUrl,
  getGenerateNumberUrl,
  getUpdatePaymentStatusUrl,
  API_CONFIG,
  MIDTRANS_CONFIG,
  PAYPAL_CONFIG
} from "@/lib/config"
import BookingHeader from "./BookingHeader"
import BookingFooter from "./BookingFooter"
import BookingSummary from "./BookingSummary"
import CustomerInformationForm from "./CustomerInformationForm"
import ParticipantForm from "./ParticipantForm"
import LessonsToursSpecifications from "./LessonsToursSpecifications"
import LoadingSpinner from "./LoadingSpinner"
import BookingSuccessModal from "./BookingSuccessModal"
import PayPalModal from "./PayPalModal"
import BookingConfirmationModal from "./BookingConfirmationModal"
import { AlertContainer } from "./AlertToast"

type ActivityKey = "surfLessons" | "surfTours";

interface AdultForm {
  name: string;
  level: string;
  medical?: string[];
  medical_other?: string;
}

interface ChildForm {
  name: string;
  age: string;
  level: string;
  medical?: string[];
  medical_other?: string;
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



  // Agent and split payment states
  const [agentCode, setAgentCode] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [splitPayments, setSplitPayments] = useState<any[]>([]);
  const [loadingAgent, setLoadingAgent] = useState(false);

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
        
        // Console log untuk debugging
        // console.log('SurfSchoolBooking - Master data received:', data.data);
        // console.log('SurfSchoolBooking - Packages:', data.data.packages);
        // console.log('SurfSchoolBooking - Agents:', data.data.agents);
        
        // Store agents data if available
        if (data.data.agents) {
          // Agents data is available in master data
          // console.log('Agents loaded from master data:', data.data.agents.length);
        }
      } else {
        console.error('Failed to fetch master data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  // Fetch agent by code from master data
  const fetchAgentByCode = async (code: string) => {
    try {
      // Validate input
      if (!code || code.trim() === '') {
        showAlert('Please enter an agent code', 'warning');
        return;
      }

      setLoadingAgent(true);

      // Get agents from master data
      const response = await fetch(getMasterDataUrl(), {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.agents) {
        const agent = data.data.agents.find((a: any) => a.code === code.toUpperCase());
        
        if (agent) {
          setSelectedAgent(agent);
          setAgentCode(code.toUpperCase());
          showAlert(`Agent ${agent.name} found successfully!`, 'success');
        } else {
          // Agent not found - this is normal, not an error
          showAlert(`Agent with code "${code.toUpperCase()}" not found. Please check the code and try again.`, 'warning');
          setSelectedAgent(null);
          setAgentCode(code.toUpperCase());
        }
      } else {
        console.error('Failed to fetch master data:', data.message);
        showAlert('Unable to fetch agent data. Please try again later.', 'error');
        setSelectedAgent(null);
      }
    } catch (error: any) {
      console.error('Error fetching agent:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showAlert('Network error. Please check your internet connection and try again.', 'error');
              } else if (error.message.includes('HTTP error')) {
          showAlert('Server error. Please try again later.', 'error');
        } else {
          showAlert('An unexpected error occurred. Please try again.', 'error');
        }
      
      setSelectedAgent(null);
    } finally {
      setLoadingAgent(false);
    }
  };

  // Load schedules on component mount
  useEffect(() => {
    if (isClient) {
      fetchSchedules();
      fetchMasterData();
    }
  }, [isClient]);

  // Load data from localStorage on mount - DISABLED
  // useEffect(() => {
  //   if (typeof window !== "undefined" && isClient) {
  //     const raw = localStorage.getItem("surf-booking-data");
  //     if (raw) {
  //       try {
  //         const saved = JSON.parse(raw);
  //         setFormData(saved.formData || { 
  //           adults: [], 
  //           children: [] 
  //         });
  //         setSelectedActivities(saved.selectedActivities || { surfLessons: true, surfTours: false });
  //         setDuration(saved.duration || "1-day");
  //         setReservationDays(saved.reservationDays || [{ date: "", time: "" }]);
  //         setAdultCount(saved.adultCount || 0);
  //         setChildrenCount(saved.childrenCount || 0);
  //         setSelectedPackages(saved.selectedPackages || {});
  //       } catch (error) {
  //         console.error('Error parsing localStorage data:', error);
  //       }
  //     }
  //   }
  // }, [isClient]);

  // Save data to localStorage on change - DISABLED
  // useEffect(() => {
  //   if (typeof window !== "undefined" && isClient) {
  //     localStorage.setItem("surf-booking-data", JSON.stringify({
  //       formData,
  //       selectedActivities,
  //       duration,
  //       reservationDays,
  //       adultCount,
  //       childrenCount,
  //       selectedPackages,
  //     }));
  //   }
  // }, [formData, selectedActivities, duration, reservationDays, adultCount, childrenCount, selectedPackages, isClient]);

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
  const currencyOptions = useMemo(() => [
    { code: "IDR", label: "Indonesian Rupiah", rate: 1 },
    { code: "USD", label: "United State Dollar", rate: 0.000065 },
    { code: "AUD", label: "Australian Dollar", rate: 0.0001 },
    { code: "SGD", label: "Singapore Dollar", rate: 0.00009 },
    { code: "JPY", label: "Japanese Yen", rate: 0.0098 },
    { code: "EUR", label: "Euro", rate: 0.00006 },
  ], []);
  const selectedCurrency = currencyOptions.find(c => c.code === currency) || currencyOptions[0];

  // Memoize setCurrency function to prevent unnecessary re-renders
  const handleSetCurrency = useCallback((newCurrency: string) => {
    setCurrency(newCurrency);
  }, []);

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
  const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);

  // State for booking success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState<{
    bookingNumber: string;
    bookingDetails?: {
      date: string;
      duration: string;
      participants: string;
      totalAmount: string;
      customerName: string;
    };
  } | null>(null);

  // State for Midtrans payment
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [showMidtransModal, setShowMidtransModal] = useState(false);



  // State for PayPal payment
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [showBookingConfirmationModal, setShowBookingConfirmationModal] = useState(false);
  const [bookingConfirmationData, setBookingConfirmationData] = useState<any>(null);
  const [isProcessingPayPal, setIsProcessingPayPal] = useState(false);



  // Add payment status modal states
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const [showPaymentSettlementModal, setShowPaymentSettlementModal] = useState(false);
  const [showPaymentPendingModal, setShowPaymentPendingModal] = useState(false);
  const [showPaymentExpiredModal, setShowPaymentExpiredModal] = useState(false);
  const [showPaymentDeniedModal, setShowPaymentDeniedModal] = useState(false);

  // Toast alert function
  function showAlert(msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    const id = Date.now().toString();
    setAlerts(alerts => [...alerts, { id, message: msg, type }]);
    setTimeout(() => {
      setAlerts(alerts => alerts.filter(alert => alert.id !== id));
    }, 4000);
  }

  // Helper: get key for a recommendation (for individual: name, for peer: joined names)
  function getRecKey(rec: any) {
    return rec.people.join("|");
  }

  // Handler when a package is selected
  function handleSelect(rec: any) {
    // Validasi nama sebelum memilih paket
    const missingNames: string[] = [];
    
    rec.people.forEach((personName: string) => {
      // Skip jika nama kosong atau hanya whitespace
      if (!personName || personName.trim() === "") {
        missingNames.push("Participant");
        return;
      }
      
      // Cari participant berdasarkan nama
      const adult = formData.adults.find((a: any) => a.name === personName);
      const child = formData.children.find((c: any) => c.name === personName);
      
      if (!adult && !child) {
        missingNames.push(personName);
      }
    });
    
    if (missingNames.length > 0) {
      const participantType = missingNames.length === 1 ? 'participant' : 'participants';
      const namesList = missingNames.includes("Participant") ? "participant" : missingNames.join(', ');
      showAlert(`Please fill in the name for ${participantType}: ${namesList}`, 'warning');
      return;
    }
    
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
    title: "",
    fullName: "",
    email: "",
    mobilePhone: "",
    hotel: "",
    hotelAddress: "",
    bookingName: "",
    dateOfArrival: "",
    country: "",
    nationality: "",
    hotelTransfer: "No",
    roomNumber: "", // ✅ Added room number field
    notes: "",
  })

  const [agreeAndContinue, setAgreeAndContinue] = useState(false)

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
    const selectedDates = reservationDays.map(r => r.date).filter(Boolean);
    const uniqueDates = [...new Set(selectedDates)];
    
    reservationDays.forEach((r, i) => {
      if (!r.date) {
        newErrors[`reservation_date_${i}`] = "Date required";
      } else {
        // Check for duplicate dates
        const dateCount = selectedDates.filter(date => date === r.date).length;
        if (dateCount > 1) {
          newErrors[`reservation_date_${i}`] = "Each day must have a different date";
        }
      }
      
      if (!r.time) {
        newErrors[`reservation_time_${i}`] = "Time required";
      }
      
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

    // Validasi payment method
    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    } else {
      // Check if payment method is valid for selected currency and agent
      if (currency === 'USD') {
        if (selectedAgent) {
          // USD + Agent: This combination is not allowed
          newErrors.paymentMethod = "Agent payments are not available with USD currency. Please use IDR currency for agent payments.";
        } else {
          // USD + No Agent: Only PayPal allowed
          if (paymentMethod !== 'paypal') {
            newErrors.paymentMethod = "USD currency without agent only supports PayPal payments";
          }
        }
      } else {
        // IDR currency
        if (paymentMethod === 'paypal') {
          newErrors.paymentMethod = "PayPal only supports USD currency";
        } else if (selectedAgent) {
          // Validasi untuk agent payment
          const agentPaymentMethods = selectedAgent.payment || '';
          const availableMethods = [];
          
          if (agentPaymentMethods.includes('B')) availableMethods.push('bank');
          if (agentPaymentMethods.includes('C')) availableMethods.push('credit_card');
          if (agentPaymentMethods.includes('O')) availableMethods.push('onsite');
          if (agentPaymentMethods.includes('S')) availableMethods.push('saldo');
          
          if (!availableMethods.includes(paymentMethod)) {
            newErrors.paymentMethod = `Please select a valid payment method. Available methods: ${availableMethods.join(', ')}`;
          }
          
          // Validasi untuk agent: pastikan setidaknya satu payment method dipilih
          if (splitPayments.length === 0) {
            newErrors.paymentMethod = "Please enter payment amount for at least one payment method";
          } else {
            // Validasi bahwa setidaknya satu payment method memiliki amount > 0
            const hasValidPayment = splitPayments.some(payment => (payment.amount || 0) > 0);
            if (!hasValidPayment) {
              newErrors.paymentMethod = "Please enter payment amount for at least one payment method";
            }
          }
          
          // Validasi split payment jika ada
          if (splitPayments.length > 0) {
            const totalSplitAmount = splitPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
            const netAmount = voucherData?.net_amount || totalAmount;
            
            if (totalSplitAmount !== netAmount) {
              newErrors.splitPayment = `Split payment total (${getDisplayPrice(totalSplitAmount)}) must equal total amount (${getDisplayPrice(netAmount)})`;
            }
            
            // Validasi saldo limit
            const saldoPayment = splitPayments
              .filter(payment => payment.method === 'saldo')
              .reduce((sum, payment) => sum + (payment.amount || 0), 0);
            const maxSaldo = selectedAgent?.saldo ? parseFloat(selectedAgent.saldo) : 0;
            
            if (saldoPayment > maxSaldo) {
              newErrors.splitPayment = `Saldo payment (${getDisplayPrice(saldoPayment)}) exceeds available balance (${getDisplayPrice(maxSaldo)})`;
            }
          }
        } else {
          // Validasi untuk non-agent payment (Midtrans/PayPal)
          const validNonAgentMethods = ['midtrans', 'paypal'];
          if (!validNonAgentMethods.includes(paymentMethod)) {
            newErrors.paymentMethod = "Please select a valid payment method (Midtrans or PayPal)";
          }
        }
      }
    }

    // Validasi payment
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

    return newErrors;
  }

  // Get available payment methods based on currency and agent
  const getAvailablePaymentMethods = () => {
    if (currency === 'USD') {
      // USD currency only supports PayPal when NO agent is selected
      if (selectedAgent) {
        // Agent is selected with USD - this should not be allowed
        // Return empty array to indicate no valid payment methods
        return [];
      } else {
        // No agent selected with USD - show PayPal only
        return [
          { code: 'paypal', name: 'PayPal', description: 'International payment (USD)', icon: '💳' }
        ];
      }
    } else {
      // IDR currency supports agent payments and Midtrans
      if (selectedAgent) {
        // Agent is selected, use agent's payment methods
        const agentPaymentMethods = selectedAgent.payment || '';
        const methods = [];
        
        if (agentPaymentMethods.includes('B')) methods.push({ code: 'bank', name: 'Bank Transfer', description: 'BCA, Mandiri, BNI', icon: '🏛️' });
        if (agentPaymentMethods.includes('C')) methods.push({ code: 'credit_card', name: 'Credit Card', description: 'Local credit card', icon: '💳' });
        if (agentPaymentMethods.includes('O')) methods.push({ code: 'onsite', name: 'Onsite Payment', description: 'Pay at location', icon: '🏪' });
        if (agentPaymentMethods.includes('S')) methods.push({ code: 'saldo', name: 'Saldo/Balance', description: 'Account balance', icon: '💰' });
        
        return methods;
      } else {
        // No agent selected, use Midtrans for IDR
        return [
          { code: 'midtrans', name: 'Midtrans', description: 'Local payment gateway', icon: '🏦' }
        ];
      }
    }
  };

  // Handler tombol Payment
  async function handlePayment() {
    const validationErrors = validateAll();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      // Show toast with validation errors
      const errorMessages = Object.values(validationErrors).join('\n');
      showAlert(`Please complete the following data:\n\n${errorMessages}`, 'error');
      return;
    }
  
    try {
      // Handle PayPal payment separately
      if (paymentMethod === 'paypal') {
        // PayPal payment - show confirmation modal first
        const bookingNumber = await generateBookingNumber();
        const confirmationData = {
          bookingNumber,
          date: reservationDays?.[0]?.date || "N/A",
          duration: duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days",
          participants: `${adultCount > 0 ? `${adultCount} Adult` : ''}${adultCount > 0 && childrenCount > 0 ? ' | ' : ''}${childrenCount > 0 ? `${childrenCount} Children` : ''}`,
          totalAmount: getDisplayPrice(voucherData?.net_amount || totalAmount),
          customerName: formData2?.fullName || "N/A",
          hotel: formData2?.hotel || "N/A",
          hotelAddress: formData2?.hotelAddress || "N/A",
          bookingName: formData2?.bookingName || "N/A",
          hotelTransfer: formData2?.hotelTransfer || "N/A",
          packages: Object.values(selectedPackages || {}).map((pkg: any) => ({
            name: pkg.pkg?.title || "N/A",
            price: pkg.pkg?.price || 0
          }))
        };

        setBookingConfirmationData(confirmationData);
        setShowBookingConfirmationModal(true);
        return; // Skip the general booking API call for PayPal
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
        ...(formData?.adults || []).map((a: any) => {
          // Find the package for this adult
          const selectedPackage = Object.values(selectedPackages || {}).find((pkg: any) => 
            pkg.people.includes(a.name)
          );
          
          return { 
            code: selectedPackage?.pkg?.id ? `PKG${selectedPackage.pkg.id.toString().padStart(3, '0')}` : "",
            name: a.name, 
            medical: a.medical || ["no_medical"],
            medical_other: a.medical_other || ""
          };
        }),
        ...(formData?.children || []).map((c: any) => {
          // Find the package for this child
          const selectedPackage = Object.values(selectedPackages || {}).find((pkg: any) => 
            pkg.people.includes(c.name)
          );
          
          return { 
            code: selectedPackage?.pkg?.id ? `PKG${selectedPackage.pkg.id.toString().padStart(3, '0')}` : "",
            name: c.name, 
            medical: c.medical || ["no_medical"],
            medical_other: c.medical_other || ""
          };
        }),
      ];
  
      // Calculate payment amounts based on agent and split payment
      let paid_b = 0, paid_c = 0, paid_o = 0, paid_s = 0;
      let bank_code_b = "";

      if (selectedAgent && splitPayments.length > 0) {
        // Split payment mode - user can combine any available payment methods
        splitPayments.forEach(payment => {
          const amount = payment.amount || 0;
          switch (payment.method) {
            case 'bank':
              paid_b += amount;
              bank_code_b = "BCA"; // Default bank
              break;
            case 'credit_card':
              paid_c += amount;
              break;
            case 'onsite':
              paid_o += amount;
              break;
            case 'saldo':
              paid_s += amount;
              break;
          }
        });
        
        // Validate split payment total
        const totalSplitAmount = paid_b + paid_c + paid_o + paid_s;
        if (totalSplitAmount !== nett) {
          showAlert(`Split payment total (${getDisplayPrice(totalSplitAmount)}) must equal total amount (${getDisplayPrice(nett)})`, 'error');
          return;
        }
        
        // Validate saldo limit
        const maxSaldo = selectedAgent?.saldo ? parseFloat(selectedAgent.saldo) : 0;
        if (paid_s > maxSaldo) {
          showAlert(`Saldo payment (${getDisplayPrice(paid_s)}) exceeds available balance (${getDisplayPrice(maxSaldo)})`, 'error');
          return;
        }
      } else {
        // Single payment mode
        switch (paymentMethod) {
          case 'bank':
            paid_b = nett;
            bank_code_b = "BCA";
            break;
          case 'credit_card':
            paid_c = nett;
            break;
          case 'onsite':
            paid_o = nett;
            break;
          case 'saldo':
            paid_s = nett;
            break;
          case 'midtrans':
          case 'paypal':
            // For default payment methods, use bank as default
            paid_b = nett;
            bank_code_b = "BCA";
            break;
        }
      }

      const bookingPayload = {
        booking_number: bookingNumber,
        date: reservationDays?.[0]?.date || "",
        type: "W",
        agent: selectedAgent ? "Y" : "N",
        agent_code: selectedAgent?.code || "AGT001",
        comm: 0,
        member_code: null,
        member_type: "I",
        qty: totalQty,
        gross,
        disc,
        discp,
        nett,
        paid_b,
        paid_c,
        paid_o,
        paid_s,
        bank_code_b,
        promo_no,
        voucher_code,
        save_as_draft: false,
        booking_details,
        booking_persons,
        email: formData2?.email || "",
        phone: formData2?.mobilePhone || "",
        country: formData2?.country || "", // ✅ Added country from Customer Information
        room_number: formData2?.roomNumber || "", // ✅ Added room number from Customer Information
        hotel_transport_requested: formData2?.hotelTransfer === "Yes" ? "Y" : "N", // ✅ Added hotel transport request
        hotel_name: formData2?.hotel || "", // ✅ Added hotel name
        booking_nameinhotel: formData2?.bookingName || "", // ✅ Added booking name in hotel
      };

      // Determine which endpoint to use based on payment method
      const isAgentPayment = selectedAgent && (paymentMethod === 'bank' || paymentMethod === 'credit_card' || paymentMethod === 'onsite' || paymentMethod === 'saldo');
      
      // Use appropriate endpoint based on payment method
      let endpoint;
      if (isAgentPayment) {
        endpoint = getBookingUrl(); // BCOS (Agent payments) use /booking
      } else if (paymentMethod === 'midtrans') {
        endpoint = getWithoutPaymentUrl(); // Midtrans use /booking/without-payment
      } else if (paymentMethod === 'paypal') {
        // PayPal uses direct API call to /paypal/create-booking-payment
        // This will be handled separately in PayPal confirmation
        endpoint = getWithoutPaymentUrl(); // Placeholder for now
      } else {
        endpoint = getWithoutPaymentUrl(); // Draft/without payment
      }
      
      const response = await fetch(endpoint, {
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
        if (isAgentPayment) {
          // Agent payment - show success modal
          const bookingDetails = {
            date: reservationDays?.[0]?.date || "N/A",
            duration: duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days",
            participants: `${adultCount > 0 ? `${adultCount} Adult` : ''}${adultCount > 0 && childrenCount > 0 ? ' | ' : ''}${childrenCount > 0 ? `${childrenCount} Children` : ''}`,
            totalAmount: getDisplayPrice(voucherData?.net_amount || totalAmount),
            customerName: formData2?.fullName || "N/A"
          };

          setSuccessBookingData({
            bookingNumber,
            bookingDetails
          });
          setShowSuccessModal(true);
        } else {
          // Handle different payment methods
          if (paymentMethod === 'midtrans') {
            // Midtrans payment - handle snap token
            if (data.data && data.data.snap_token) {
              setSnapToken(data.data.snap_token);
              setShowMidtransModal(true);
              
              // Set success data for after payment completion
              const bookingDetails = {
                date: reservationDays?.[0]?.date || "N/A",
                duration: duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days",
                participants: `${adultCount > 0 ? `${adultCount} Adult` : ''}${adultCount > 0 && childrenCount > 0 ? ' | ' : ''}${childrenCount > 0 ? `${childrenCount} Children` : ''}`,
                totalAmount: getDisplayPrice(voucherData?.net_amount || totalAmount),
                customerName: formData2?.fullName || "N/A"
              };

              setSuccessBookingData({
                bookingNumber,
                bookingDetails
              });
              // Don't show success modal yet - wait for payment completion
            } else {
              showAlert("Booking created but payment token not received. Please contact support.", 'error');
            }

          } else if (paymentMethod === 'paypal') {
            // PayPal payment - show confirmation modal first
            const confirmationData = {
              bookingNumber,
              date: reservationDays?.[0]?.date || "N/A",
              duration: duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days",
              participants: `${adultCount > 0 ? `${adultCount} Adult` : ''}${adultCount > 0 && childrenCount > 0 ? ' | ' : ''}${childrenCount > 0 ? `${childrenCount} Children` : ''}`,
              totalAmount: getDisplayPrice(voucherData?.net_amount || totalAmount),
              customerName: formData2?.fullName || "N/A",
              hotel: formData2?.hotel || "N/A",
              hotelAddress: formData2?.hotelAddress || "N/A",
              bookingName: formData2?.bookingName || "N/A",
              hotelTransfer: formData2?.hotelTransfer || "N/A",
              packages: Object.values(selectedPackages || {}).map((pkg: any) => ({
                name: pkg.pkg?.title || "N/A",
                price: pkg.pkg?.price || 0
              }))
            };

            setBookingConfirmationData(confirmationData);
            setShowBookingConfirmationModal(true);
            return; // Skip the general booking API call for PayPal
          }
        }
      } else {
        showAlert(data.message || "Booking failed", 'error');
      }
    } catch (err: any) {
      showAlert(err?.message || "An error occurred while processing the booking.", 'error');
      console.error("Booking error:", err);
    }
  }

  const [paymentMethod, setPaymentMethod] = useState("bank")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);

  // Load formData2 and other states from localStorage - DISABLED
  // useEffect(() => {
  //   if (typeof window !== "undefined" && isClient) {
  //     const raw = localStorage.getItem("surf-booking-data");
  //     if (raw) {
  //       try {
  //           const saved = JSON.parse(raw);
  //           setFormData2(saved.formData2 || {
  //             title: "Mr",
  //             fullName: "",
  //             email: "",
  //             mobilePhone: "",
  //             hotel: "",
  //             hotelAddress: "",
  //             bookingName: "",
  //             dateOfArrival: "",
  //             country: "Indonesia",
  //             nationality: "",
  //             hotelTransfer: "No",
  //             notes: "",
  //           });
  //           setSurfExperience(saved.surfExperience || dummySurfExperience);
  //           setAgreeTerms(saved.agreeTerms || false);
  //           
  //           // Auto-fill customer info if available
  //           if (saved.customerInfo) {
  //             setFormData2(prev => ({
  //               ...prev,
  //               fullName: saved.customerInfo.fullName || prev.fullName,
  //               email: saved.customerInfo.email || prev.email,
  //               mobilePhone: saved.customerInfo.mobile || prev.mobilePhone,
  //               hotel: saved.customerInfo.hotel || prev.hotel,
  //               hotelAddress: saved.customerInfo.hotelAddress || prev.hotelAddress,
  //               bookingName: saved.customerInfo.bookingName || prev.bookingName,
  //               dateOfArrival: saved.customerInfo.dateOfArrival || prev.dateOfArrival,
  //               country: saved.customerInfo.country || prev.country,
  //               nationality: saved.customerInfo.nationality || prev.nationality,
  //               notes: saved.customerInfo.notes || prev.notes,
  //             }));
  //           }
  //         } catch (error) {
  //           console.error('Error parsing localStorage data for formData2:', error);
  //         }
  //       }
  //     }
  //   }, [isClient]);

  // Save formData2 and other states to localStorage - DISABLED
  // useEffect(() => {
  //   if (typeof window !== "undefined" && isClient) {
  //     try {
  //       const existing = localStorage.getItem("surf-booking-data");
  //       const existingData = existing ? JSON.parse(existing) : {};
  //       localStorage.setItem("surf-booking-data", JSON.stringify({
  //         ...existingData,
  //         formData2,
  //         surfExperience,
  //         agreeTerms,
  //       }));
  //     } catch (error) {
  //       console.error('Error saving to localStorage:', error);
  //     }
  //   }
  // }, [formData2, surfExperience, agreeTerms, isClient]);

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
    roomNumber: formData2.roomNumber,
    hotelTransfer: formData2.hotelTransfer, // ✅ Added hotel transfer
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
        showAlert(data.message || "Voucher not valid.", 'error');
        return;
      }

      setPromoMessage(data.data?.message || data.message || "Voucher applied successfully!");
      setPromoSuccess(true);
      setVoucherData(data.data);
      showAlert("Voucher applied successfully!", 'success');
    } catch (err) {
      setPromoMessage("Failed to apply voucher. Please try again.");
      setPromoSuccess(false);
      setVoucherData(null);
      showAlert("Failed to apply voucher. Please try again.", 'error');
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



  // Function to reset all form data
  function resetAllData() {
    // Clear localStorage (disabled - no longer saving to localStorage)
    // if (typeof window !== "undefined") {
    //   localStorage.removeItem("surf-booking-data");
    // }

    // Reset all state to initial values
    setFormData({
      adults: [],
      children: [],
    });
    setSelectedActivities({
      surfLessons: true,
      surfTours: false,
    });
    setDuration("1-day");
    setReservationDays([{ date: "", time: "" }]);
    setAdultCount(0);
    setChildrenCount(0);
    setPackageList([]);
    setSelectedPackages({});
    setSchedules([]);
    setLoadingSchedules(false);

    setAgentCode('');
    setSelectedAgent(null);
    setSplitPayments([]);
    setCurrency("IDR");
    setSelectedActivityType(null);
    setAlerts([]);
    setShowSuccessModal(false);
    setSuccessBookingData(null);
    setFormData2({
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
      roomNumber: "",
      notes: "",
    });
    setAgreeAndContinue(false);
    setSurfExperience(dummySurfExperience);
    setErrors({});
    setPaymentMethod("bank");
    setAgreeTerms(false);
    setPromoCode("");
    setPromoMessage("");
    setPromoSuccess(false);
    setVoucherData(null);
  }

  // Clean up selected packages when participant count changes
  useEffect(() => {
    if (typeof window !== "undefined" && isClient) {
      const allParticipantNames = [
        ...formData.adults.map(a => a.name),
        ...formData.children.map(c => c.name)
      ].filter(name => name.trim() !== "");

      // If no participants, clear all packages
      if (allParticipantNames.length === 0) {
        setSelectedPackages({});
        return;
      }

      // Remove packages that reference non-existent participants
      const cleanedPackages = { ...selectedPackages };
      Object.keys(cleanedPackages).forEach(key => {
        const packageData = cleanedPackages[key];
        if (packageData.people) {
          // Filter out people that no longer exist
          const validPeople = packageData.people.filter((person: string) => 
            allParticipantNames.includes(person)
          );
          
          if (validPeople.length === 0) {
            // Remove package if no valid people remain
            delete cleanedPackages[key];
          } else if (validPeople.length !== packageData.people.length) {
            // Update package with only valid people
            cleanedPackages[key] = {
              ...packageData,
              people: validPeople
            };
          }
        }
      });

      // Only update if there are changes
      if (JSON.stringify(cleanedPackages) !== JSON.stringify(selectedPackages)) {
        setSelectedPackages(cleanedPackages);
      }
    }
  }, [adultCount, childrenCount, formData.adults, formData.children, isClient]);

  // Clean up packages when participant names change
  useEffect(() => {
    if (typeof window !== "undefined" && isClient && Object.keys(selectedPackages).length > 0) {
      const allParticipantNames = [
        ...formData.adults.map(a => a.name),
        ...formData.children.map(c => c.name)
      ].filter(name => name.trim() !== "");

      // Check if any packages reference non-existent participants
      let hasChanges = false;
      const cleanedPackages = { ...selectedPackages };
      
      Object.keys(cleanedPackages).forEach(key => {
        const packageData = cleanedPackages[key];
        if (packageData.people) {
          const validPeople = packageData.people.filter((person: string) => 
            allParticipantNames.includes(person)
          );
          
          if (validPeople.length === 0) {
            // Remove package if no valid people remain
            delete cleanedPackages[key];
            hasChanges = true;
          } else if (validPeople.length !== packageData.people.length) {
            // Update package with only valid people
            cleanedPackages[key] = {
              ...packageData,
              people: validPeople
            };
            hasChanges = true;
          }
        }
      });

      // Only update if there are changes
      if (hasChanges) {
        setSelectedPackages(cleanedPackages);
      }
    }
  }, [formData.adults, formData.children, isClient]);

  // Add Midtrans Snap script loading
  useEffect(() => {
    if (isClient) {
      // Load Midtrans Snap script
      const script = document.createElement('script');
      script.src = `${MIDTRANS_CONFIG.BASE_URL}/snap/snap.js`;
      script.setAttribute('data-client-key', MIDTRANS_CONFIG.CLIENT_KEY);
      script.async = true;
      
      script.onload = () => {
        // console.log('Midtrans Snap script loaded successfully');
      };
      
      script.onerror = () => {
        console.error('Failed to load Midtrans Snap script');
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Cleanup script on unmount
        const existingScript = document.querySelector(`script[src="${script.src}"]`);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [isClient]);

  // Add function to handle Midtrans payment
  const handleMidtransPayment = (snapToken: string) => {
    if (typeof window !== 'undefined' && (window as any).snap) {
      try {
        (window as any).snap.pay(snapToken, {
          onSuccess: function(result: any) {
            // console.log('Payment success:', result);
            
            // Show success modal directly since Midtrans handles the status
            setShowSuccessModal(true);
            setShowMidtransModal(false);
            setSnapToken(null);
          },
          onPending: function(result: any) {
            // console.log('Payment pending:', result);
            
            // Show pending modal
            setShowPaymentPendingModal(true);
            setShowMidtransModal(false);
            setSnapToken(null);
          },
          onError: function(result: any) {
            // console.log('Payment error:', result);
            
            // Show error modal
            setShowPaymentFailedModal(true);
            setShowMidtransModal(false);
            setSnapToken(null);
          },
          onClose: function() {
            // console.log('Payment modal closed');
            
            // Show error modal
            setShowPaymentFailedModal(true);
            setShowMidtransModal(false);
            setSnapToken(null);
          }
        });
      } catch (error) {
        console.error('Error initializing Midtrans payment:', error);
        
        // Show error modal
        setShowPaymentFailedModal(true);
        setShowMidtransModal(false);
        setSnapToken(null);
      }
    } else {
      console.error('Midtrans Snap not loaded');
      showAlert('Payment system not ready. Please refresh the page and try again.', 'error');
    }
  };

  // Add function to handle PayPal payment confirmation
  const handlePayPalConfirmation = async () => {
    if (!bookingConfirmationData) return;
    
    setIsProcessingPayPal(true);
    
    try {
      // ✅ Generate fresh booking number for PayPal to avoid duplicates
      const freshBookingNumber = await generateBookingNumber();
      
      // Recalculate values for PayPal
      const totalQty = (adultCount || 0) + (childrenCount || 0);
      const gross = totalAmount || 0;
      const disc = voucherData?.discount_amount ? Math.round(Number(voucherData.discount_amount)) : 0;
      const discp = voucherData?.discount_type === "percentage" ? Number(voucherData.discount_value || 0) : 0;
      const nett = voucherData?.net_amount ? Math.round(Number(voucherData.net_amount)) : gross;
      const voucher_code = voucherData?.voucher_code || "";

      // Calculate USD amount based on exchange rate (assuming 1 USD = 15000 IDR for now)
      const exchangeRate = 15000; // This should come from CurrencySelector
      const usd_amount = Math.round(nett / exchangeRate * 100) / 100; // Round to 2 decimal places

      const booking_details = Object.values(selectedPackages || {}).map((pkg: any) => {
        const packagePrice = pkg.pkg?.price || 0;
        const packageUsdPrice = Math.round(packagePrice / exchangeRate * 100) / 100;
        
        return {
          code: pkg.pkg?.id ? `PKG${pkg.pkg.id.toString().padStart(3, '0')}` : "",
          name: pkg.pkg?.title || "",
          price: packagePrice,
          qty: 1,
          gross: packagePrice,
          disc: 0,
          discp: 0,
          nett: packagePrice,
          price_usd: packageUsdPrice
        };
      });

      const booking_persons = [
        ...(formData?.adults || []).map((a: any) => {
          const selectedPackage = Object.values(selectedPackages || {}).find((pkg: any) => 
            pkg.people.includes(a.name)
          );
          
          return { 
            code: selectedPackage?.pkg?.id ? `PKG${selectedPackage.pkg.id.toString().padStart(3, '0')}` : "",
            name: a.name, 
            medical: a.medical || ["no_medical"],
            medical_other: a.medical_other || ""
          };
        }),
        ...(formData?.children || []).map((c: any) => {
          const selectedPackage = Object.values(selectedPackages || {}).find((pkg: any) => 
            pkg.people.includes(c.name)
          );
          
          return { 
            code: selectedPackage?.pkg?.id ? `PKG${selectedPackage.pkg.id.toString().padStart(3, '0')}` : "",
            name: c.name, 
            medical: c.medical || ["no_medical"],
            medical_other: c.medical_other || ""
          };
        }),
      ];

      const paypalBookingData = {
        booking_no: freshBookingNumber, // ✅ Use fresh booking number instead of cached one
        date: reservationDays?.[0]?.date || new Date().toISOString().split('T')[0],
        type: 'W', // Walk-in
        agent: 'N', // No agent
        member_type: 'I', // Individual
        qty: totalQty,
        gross: gross,
        disc: disc,
        discp: discp,
        nett: nett,
        usd_amount: usd_amount,
        booking_details: booking_details,
        booking_persons: booking_persons,
        voucher_code: voucher_code,
        currency: 'USD',
        email: formData2?.email || "", // ✅ Added email from Customer Information
        phone: formData2?.mobilePhone || "", // ✅ Added phone from Customer Information
        country: formData2?.country || "", // ✅ Added country from Customer Information
        room_number: formData2?.roomNumber || "", // ✅ Added room number from Customer Information
        hotel_transport_requested: formData2?.hotelTransfer === "Yes" ? "Y" : "N", // ✅ Added hotel transport request
        hotel_name: formData2?.hotel || "", // ✅ Added hotel name
        booking_nameinhotel: formData2?.bookingName || "" // ✅ Added booking name in hotel
      };

      const paypalResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paypal/create-booking-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paypalBookingData)
      });

      const paypalData = await paypalResponse.json();

              if (paypalData.success) {
          // Close confirmation modal
          setShowBookingConfirmationModal(false);
          
          // ✅ Redirect to PayPal approval URL
          if (paypalData.data?.approval_url) {
            // Show success message before redirect
            showAlert('PayPal payment created successfully! Redirecting to PayPal...', 'success');
            
            // Redirect to PayPal approval URL
            window.open(paypalData.data.approval_url, '_blank');
            
            // Optional: Show booking details
            console.log('PayPal Payment Details:', {
              booking_no: paypalData.data.booking_no,
              payment_id: paypalData.data.payment_id,
              amount: paypalData.data.amount,
              usd_amount: paypalData.data.usd_amount,
              currency: paypalData.data.currency,
              status: paypalData.data.status
            });
          } else {
            showAlert('PayPal approval URL not received', 'error');
          }
        } else {
          // Handle specific error cases from documentation
          if (paypalData.message?.includes('already exists')) {
            showAlert('Payment processing error. Please try again.', 'error');
          } else if (paypalData.message?.includes('active PayPal payment')) {
            showAlert('Booking already has an active PayPal payment', 'error');
          } else if (paypalData.errors) {
            // Handle validation errors
            const errorMessages = Object.values(paypalData.errors).flat().join(', ');
            showAlert(`Validation error: ${errorMessages}`, 'error');
          } else {
            showAlert(paypalData.message || 'Failed to create PayPal payment', 'error');
          }
        }
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      showAlert('Failed to create PayPal payment. Please try again.', 'error');
    } finally {
      setIsProcessingPayPal(false);
    }
  };

  // Add function to handle PayPal payment
  const handlePayPalPayment = async (paymentDetails: any, bookingNumber: string) => {
    try {
      // console.log('PayPal payment details:', paymentDetails);
      
      // Execute PayPal payment using backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paypal/execute-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId: paymentDetails.id,
          PayerID: paymentDetails.payer.payer_id,
          booking_no: bookingNumber
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // PayPal payment success - don't show success modal
        // const bookingDetails = {
        //   date: reservationDays?.[0]?.date || "N/A",
        //   duration: duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days",
        //   participants: `${adultCount > 0 ? `${adultCount} Adult` : ''}${adultCount > 0 && childrenCount > 0 ? ' | ' : ''}${childrenCount > 0 ? `${childrenCount} Children` : ''}`,
        //   totalAmount: getDisplayPrice(voucherData?.net_amount || totalAmount),
        //   customerName: formData2?.fullName || "N/A"
        // };

        // setSuccessBookingData({
        //   bookingNumber,
        //   bookingDetails
        // });
        // setShowSuccessModal(true);
        setShowPayPalModal(false);
        showAlert('PayPal payment completed successfully!', 'success');
      } else {
        showAlert(data.message || 'Payment verification failed. Please contact support.', 'error');
      }
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      showAlert('Payment processing failed. Please try again.', 'error');
    }
  };





  // Real-time validation function
  function validateField(fieldName: string, value: any, context?: any) {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'fullName':
        if (!value || value.trim() === '') {
          newErrors.fullName = "Full name is required";
        } else {
          delete newErrors.fullName;
        }
        break;
        
      case 'email':
        if (!value || value.trim() === '') {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'hotel':
        if (!value || value.trim() === '') {
          newErrors.hotel = "Hotel is required";
        } else {
          delete newErrors.hotel;
        }
        break;
        
      case 'hotelAddress':
        if (!value || value.trim() === '') {
          newErrors.hotelAddress = "Hotel address is required";
        } else {
          delete newErrors.hotelAddress;
        }
        break;
        
      case 'bookingName':
        if (!value || value.trim() === '') {
          newErrors.bookingName = "Booking name is required";
        } else {
          delete newErrors.bookingName;
        }
        break;
        
      case 'hotelTransfer':
        if (!value) {
          newErrors.hotelTransfer = "Hotel transfer is required";
        } else {
          delete newErrors.hotelTransfer;
        }
        break;
        
      case 'participantName':
        const { participantType, index } = context;
        const fieldKey = `${participantType}_name_${index}`;
        if (!value || value.trim() === '') {
          newErrors[fieldKey] = "Name required";
        } else {
          delete newErrors[fieldKey];
        }
        break;
        
      case 'participantLevel':
        const { participantType: levelType, index: levelIndex } = context;
        const levelFieldKey = `${levelType}_level_${levelIndex}`;
        if (!value) {
          newErrors[levelFieldKey] = "Level required";
        } else {
          delete newErrors[levelFieldKey];
        }
        break;
        
      case 'childAge':
        const { index: ageIndex } = context;
        const ageFieldKey = `child_age_${ageIndex}`;
        if (!value) {
          newErrors[ageFieldKey] = "Age required";
        } else {
          delete newErrors[ageFieldKey];
        }
        break;
        
      case 'reservationDate':
        const { index: dateIndex } = context;
        const dateFieldKey = `reservation_date_${dateIndex}`;
        if (!value) {
          newErrors[dateFieldKey] = "Date required";
        } else {
          // Check for duplicate dates
          const selectedDates = reservationDays.map(r => r.date).filter(Boolean);
          const dateCount = selectedDates.filter(date => date === value).length;
          if (dateCount > 1) {
            newErrors[dateFieldKey] = "Each day must have a different date";
          } else {
            delete newErrors[dateFieldKey];
          }
        }
        break;
        
      case 'reservationTime':
        const { index: timeIndex } = context;
        const timeFieldKey = `reservation_time_${timeIndex}`;
        if (!value) {
          newErrors[timeFieldKey] = "Time required";
        } else {
          delete newErrors[timeFieldKey];
        }
        break;
        
      case 'activities':
        if (!Object.values(selectedActivities).some(Boolean)) {
          newErrors.activities = "Please select at least one surfing activity";
        } else {
          delete newErrors.activities;
        }
        break;
        
      case 'participants':
        if (adultCount === 0 && childrenCount === 0) {
          newErrors.participants = "At least one participant required";
        } else {
          delete newErrors.participants;
        }
        break;
        
      case 'selectedPackages':
        if (Object.keys(selectedPackages).length === 0) {
          newErrors.selectedPackages = "Please select at least one package";
        } else {
          // Check if all participants have packages
          const allParticipantNames = [
            ...formData.adults.map(a => a.name),
            ...formData.children.map(c => c.name)
          ].filter(name => name.trim() !== "");

          const participantsWithPackages = Object.values(selectedPackages || {}).flatMap((pkg: any) => 
            pkg.people || []
          );

          const participantsWithoutPackages = allParticipantNames.filter(name => 
            !participantsWithPackages.includes(name)
          );

          if (participantsWithoutPackages.length > 0) {
            newErrors.packageSelection = `The following participants haven't selected a package: ${participantsWithoutPackages.join(', ')}`;
          } else {
            delete newErrors.packageSelection;
          }
          delete newErrors.selectedPackages;
        }
        break;
        
      case 'agreeTerms':
        if (!value) {
          newErrors.agreeTerms = "You must agree to the terms";
        } else {
          delete newErrors.agreeTerms;
        }
        break;
    }
    
    setErrors(newErrors);
  }

  // Prevent hydration error by not rendering until client-side
  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingHeader />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="p-6">
            {/* Title Section */}
            <div className="border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Your Surf Booking</h1>
                  <p className="text-sm sm:text-sm md:text-base text-gray-600 mt-1">Complete your surfing adventure</p>
                </div>
              </div>
            </div>

            {/* Currency Selector */}
            <LessonsToursSpecifications
              currency={currency}
              setCurrency={handleSetCurrency}
              onRateChange={(rate) => {
                // Handle exchange rate change
                // console.log('Exchange rate changed:', rate);
              }}
              paymentMethod={paymentMethod}
              selectedActivities={selectedActivities}
              setSelectedActivities={setSelectedActivities}
              duration={duration}
              setDuration={setDuration}
              reservationDays={reservationDays}
              setReservationDays={setReservationDays}
              schedules={schedules}
              errors={errors}
              validateField={validateField}
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
              setSelectedPackages={setSelectedPackages}
              errors={errors}
              getDisplayPrice={getDisplayPrice}
              getRecKey={getRecKey}
              handleSelect={handleSelect}
              handleCancel={handleCancel}
              validateField={validateField}
            />

            {/* Toast Alert Container */}
            <AlertContainer 
              alerts={alerts}
              onRemove={(id: string) => setAlerts(alerts => alerts.filter(alert => alert.id !== id))}
            />

            <CustomerInformationForm 
              formData2={formData2} 
              setFormData2={setFormData2} 
              errors={errors}
              validateField={validateField}
            />

            {/* Information Box */}
            {/* <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
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
            </div> */}

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
              formData={formData}
              agentCode={agentCode}
              setAgentCode={setAgentCode}
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
              fetchAgentByCode={fetchAgentByCode}
              splitPayments={splitPayments}
              setSplitPayments={setSplitPayments}
              loadingAgent={loadingAgent}
              currency={currency}
              setCurrency={handleSetCurrency}
              onRateChange={(rate) => {
              }}
            />
          </div>
        </div>
      </div>

      <BookingFooter />

      {/* Booking Success Modal */}
      {successBookingData && (
        <BookingSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setSuccessBookingData(null);
          }}
          onReset={() => {
            setShowSuccessModal(false);
            setSuccessBookingData(null);
            // Reset all form data and clear localStorage
            resetAllData();
            // Reload page to ensure complete fresh start
            window.location.reload();
          }}
          bookingNumber={successBookingData.bookingNumber}
          bookingDetails={successBookingData.bookingDetails}
        />
      )}

      {/* Midtrans Payment Modal */}
      {showMidtransModal && snapToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Secure Payment
              </h2>
              <p className="text-gray-600">
                Your booking has been created successfully. Please complete the payment to confirm your reservation.
              </p>
            </div>
            
            {/* Payment Details */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <div className="font-bold text-lg text-gray-900">
                    {getDisplayPrice(voucherData?.net_amount || totalAmount)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Booking:</span>
                  <div className="font-semibold text-gray-900">
                    {successBookingData?.bookingNumber || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Info */}
            <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600">🔒</span>
                <span className="font-semibold text-yellow-800">Secure Payment Gateway</span>
              </div>
              <p className="text-sm text-yellow-700">
                You'll be redirected to Midtrans secure payment page. Multiple payment methods available including credit cards, bank transfer, and e-wallets.
              </p>
            </div>



            <div className="space-y-3">
              <button
                onClick={() => {
                  handleMidtransPayment(snapToken);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>💳</span>
                  <span>Proceed to Secure Payment</span>
                </span>
              </button>
              
              <button
                onClick={() => {
                  setShowMidtransModal(false);
                  setSnapToken(null);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel Payment
              </button>
            </div>
            
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                <strong>Debug Info:</strong><br/>
                Snap Token: {snapToken.substring(0, 20)}...<br/>
                Client Key: {MIDTRANS_CONFIG.CLIENT_KEY}<br/>
                Environment: {MIDTRANS_CONFIG.IS_PRODUCTION ? 'Production' : 'Sandbox'}
              </div>
            )}
          </div>
        </div>
      )}



             {/* Payment Failed Modal */}
       {showPaymentFailedModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
           <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
             <div className="text-center mb-6">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">❌</span>
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">
                 Payment Failed
               </h2>
               <p className="text-gray-600">
                 Your payment was unsuccessful. Please try again or contact support.
               </p>
             </div>
             
             {/* Error Info */}
             <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-red-600">⚠️</span>
                 <span className="font-semibold text-red-800">Possible reasons:</span>
               </div>
               <ul className="text-sm text-red-700 space-y-1">
                 <li>• Insufficient funds in your account</li>
                 <li>• Card was declined by your bank</li>
                 <li>• Network connection issues</li>
                 <li>• Payment gateway temporarily unavailable</li>
               </ul>
             </div>
             
             <div className="space-y-3">
               <button
                 onClick={() => {
                   setShowPaymentFailedModal(false);
                   setShowMidtransModal(true);
                   // Re-initialize payment
                   if (snapToken) {
                     handleMidtransPayment(snapToken);
                   }
                 }}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
               >
                 <span className="flex items-center justify-center gap-2">
                   <span>🔄</span>
                   <span>Try Again</span>
                 </span>
               </button>
               <button
                 onClick={() => {
                   setShowPaymentFailedModal(false);
                   setShowMidtransModal(false);
                   setSnapToken(null);
                 }}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
               >
                 Cancel Payment
               </button>
             </div>
           </div>
         </div>
       )}

             {/* Payment Settlement Modal */}
       {showPaymentSettlementModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
           <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
             <div className="text-center mb-6">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">✅</span>
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">
                 Payment Successful
               </h2>
               <p className="text-gray-600">
                 Your payment has been settled. Your booking is now confirmed.
               </p>
             </div>
             
             {/* Booking Details */}
             <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6 border-2 border-green-300">
               <h3 className="font-semibold text-gray-900 mb-3">📋 Booking Details</h3>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <span className="text-gray-600">Booking Number:</span>
                   <div className="font-bold text-gray-900">
                     {successBookingData?.bookingNumber || "N/A"}
                   </div>
                 </div>
                 <div>
                   <span className="text-gray-600">Amount:</span>
                   <div className="font-bold text-green-600">
                     {getDisplayPrice(voucherData?.net_amount || totalAmount)}
                   </div>
                 </div>
                 <div>
                   <span className="text-gray-600">Date:</span>
                   <div className="font-semibold text-gray-900">
                     {reservationDays?.[0]?.date || "N/A"}
                   </div>
                 </div>
                 <div>
                   <span className="text-gray-600">Duration:</span>
                   <div className="font-semibold text-gray-900">
                     {duration === "1-day" ? "1 Day" : duration === "2-days" ? "2 Days" : "3 Days"}
                   </div>
                 </div>
                 <div className="col-span-2">
                   <span className="text-gray-600">Participants:</span>
                   <div className="font-semibold text-gray-900">
                     {`${adultCount > 0 ? `${adultCount} Adult` : ''}${adultCount > 0 && childrenCount > 0 ? ' | ' : ''}${childrenCount > 0 ? `${childrenCount} Children` : ''}`}
                   </div>
                 </div>
                 <div className="col-span-2">
                   <span className="text-gray-600">Customer:</span>
                   <div className="font-semibold text-gray-900">
                     {formData2?.fullName || "N/A"}
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="space-y-3">
               <button
                 onClick={() => {
                   setShowPaymentSettlementModal(false);
                   setShowMidtransModal(false);
                   setSnapToken(null);
                   
                   // Reset form for new booking
                   resetAllData();
                 }}
                 className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
               >
                 <span className="flex items-center justify-center gap-2">
                   <span>🎉</span>
                   <span>Start New Booking</span>
                 </span>
               </button>
               <button
                 onClick={() => {
                   setShowPaymentSettlementModal(false);
                   setShowMidtransModal(false);
                   setSnapToken(null);
                 }}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}

             {/* Payment Pending Modal */}
       {showPaymentPendingModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
           <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
             <div className="text-center mb-6">
               <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">⏳</span>
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">
                 Payment Pending
               </h2>
               <p className="text-gray-600">
                 Your payment is being processed. We'll notify you once it's completed.
               </p>
             </div>
             
             {/* Status Info */}
             <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-yellow-600">ℹ️</span>
                 <span className="font-semibold text-yellow-800">What happens next?</span>
               </div>
               <ul className="text-sm text-yellow-700 space-y-1">
                 <li>• We're checking your payment status every 5 seconds</li>
                 <li>• You'll receive a notification when payment is confirmed</li>
                 <li>• Your booking will be automatically confirmed</li>
                 <li>• You can close this modal and check back later</li>
               </ul>
             </div>
             
             <div className="space-y-3">
               <button
                 onClick={() => {
                   setShowPaymentPendingModal(false);
                   setShowMidtransModal(false);
                   setSnapToken(null);
                 }}
                 className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
               >
                 <span className="flex items-center justify-center gap-2">
                   <span>⏳</span>
                   <span>Continue Monitoring</span>
                 </span>
               </button>
               <button
                 onClick={() => {
                   setShowPaymentPendingModal(false);
                   setShowMidtransModal(false);
                   setSnapToken(null);
                 }}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}

             {/* Payment Expired Modal */}
       {showPaymentExpiredModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
           <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
             <div className="text-center mb-6">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">⏰</span>
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">
                 Payment Expired
               </h2>
               <p className="text-gray-600">
                 Your payment session has expired. Please try again with a new payment session.
               </p>
             </div>
             
             {/* Expiry Info */}
             <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-orange-600">⏰</span>
                 <span className="font-semibold text-orange-800">Why did this happen?</span>
               </div>
               <ul className="text-sm text-orange-700 space-y-1">
                 <li>• Payment session timeout (usually 15 minutes)</li>
                 <li>• Browser was closed during payment</li>
                 <li>• Network interruption during payment</li>
                 <li>• Payment gateway session expired</li>
               </ul>
             </div>
             
             <div className="space-y-3">
               <button
                 onClick={() => {
                   setShowPaymentExpiredModal(false);
                   setShowMidtransModal(true);
                   // Re-initialize payment
                   if (snapToken) {
                     handleMidtransPayment(snapToken);
                   }
                 }}
                 className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
               >
                 <span className="flex items-center justify-center gap-2">
                   <span>🔄</span>
                   <span>Try Again</span>
                 </span>
               </button>
               <button
                 onClick={() => {
                   setShowPaymentExpiredModal(false);
                   setShowMidtransModal(false);
                   setSnapToken(null);
                 }}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
               >
                 Cancel Payment
               </button>
             </div>
           </div>
         </div>
       )}

             {/* Payment Denied Modal */}
       {showPaymentDeniedModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
           <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
             <div className="text-center mb-6">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">🚫</span>
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">
                 Payment Denied
               </h2>
               <p className="text-gray-600">
                 Your payment was denied by the payment processor. Please try again or contact support.
               </p>
             </div>
             
             {/* Denial Info */}
             <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-red-600">🚫</span>
                 <span className="font-semibold text-red-800">Why was payment denied?</span>
               </div>
               <ul className="text-sm text-red-700 space-y-1">
                 <li>• Card was blocked by your bank</li>
                 <li>• Suspicious transaction detected</li>
                 <li>• Payment method not supported</li>
                 <li>• Transaction limit exceeded</li>
               </ul>
             </div>
             
             <div className="space-y-3">
               <button
                 onClick={() => {
                   setShowPaymentDeniedModal(false);
                   setShowMidtransModal(true);
                   // Re-initialize payment
                   if (snapToken) {
                     handleMidtransPayment(snapToken);
                   }
                 }}
                 className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
               >
                 <span className="flex items-center justify-center gap-2">
                   <span>🔄</span>
                   <span>Try Again</span>
                 </span>
               </button>
               <button
                 onClick={() => {
                   setShowPaymentDeniedModal(false);
                   setShowMidtransModal(false);
                   setSnapToken(null);
                 }}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
               >
                 Cancel Payment
               </button>
             </div>
           </div>
         </div>
       )}

      {/* PayPal Payment Modal */}
      <PayPalModal
        isOpen={showPayPalModal}
        onClose={() => setShowPayPalModal(false)}
        amount={voucherData?.net_amount || totalAmount}
        bookingCode={successBookingData?.bookingNumber || ''}
        onSuccess={(paymentDetails) => {
          const bookingNumber = successBookingData?.bookingNumber || '';
          handlePayPalPayment(paymentDetails, bookingNumber);
        }}
        onError={(error) => {
          console.error('PayPal payment error:', error);
          showAlert('PayPal payment failed. Please try again.', 'error');
          setShowPayPalModal(false);
        }}
      />

      {/* Booking Confirmation Modal */}
      {showBookingConfirmationModal && bookingConfirmationData && (
        <BookingConfirmationModal
          isOpen={showBookingConfirmationModal}
          onClose={() => setShowBookingConfirmationModal(false)}
          onConfirm={handlePayPalConfirmation}
          bookingData={bookingConfirmationData}
          isLoading={isProcessingPayPal}
        />
      )}
    </div>
  )
} 