import { z } from "zod";

export const surfAbilitySchema = z.object({
  stamina: z.string().min(1, "Required"),
  paddling: z.string().min(1, "Required"),
  position: z.string().min(1, "Required"),
  standUp: z.string().min(1, "Required"),
  balancing: z.string().min(1, "Required"),
  safeAwareness: z.string().min(1, "Required"),
  controlBoard: z.string().min(1, "Required"),
  paddleOut: z.string().min(1, "Required"),
  eskimo: z.string().min(1, "Required"),
  catchWave: z.string().min(1, "Required"),
  takeOff: z.string().min(1, "Required"),
  pickUpSpeed: z.string().min(1, "Required"),
  blueWave: z.string().min(1, "Required"),
  selectWave: z.string().min(1, "Required"),
  etiquette: z.string().min(1, "Required"),
});

export const surfExperienceSchema = z.object({
    year: z.string()
    .min(1, "Year is required")
    .pipe(
        z.string().refine(val => /^\d+$/.test(val), { message: "Only numbers allowed" })
    ), 
    months: z.string()
    .min(1, "Months is required")
    .pipe(
        z.string().refine(val => /^\d+$/.test(val), { message: "Only numbers allowed" })
    ),
    weeks: z.string()
    .min(1, "Weeks is required")
    .pipe(
        z.string().refine(val => /^\d+$/.test(val), { message: "Only numbers allowed" })
    ),
    locations: z.string().min(1, "Locations is required"),
    boardSize: z.string().min(1, "Board size is required"),
    stance: z.string().min(1, "Stance is required"),
    stanceOther: z.string().optional(),
    waveSize: z.string().min(1, "Wave size is required"),
    otherSports: z.array(z.string().optional()), // boleh kosong
    lastSurf: z.string().min(1, "Last surf description is required"),
  });

export const formSchema = z.object({
  title: z.string().min(1, "Required"),
  fullName: z.string().min(1, "Full Booking Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  mobilePhone: z.string().optional().refine(val => !val || /^\+?\d+$/.test(val), { message: "Only numbers and + allowed" }),
  hotel: z.string().min(1, "Hotel is required"),
  hotelAddress: z.string().min(1, "Hotel Address is required"),
  bookingName: z.string().min(1, "Booking Name in the Hotel is required"),
  dateOfArrival: z.string().optional().refine(val => !val || /^\d{2}-\d{2}-\d{4}$|^\d{4}-\d{2}-\d{2}$/.test(val), { message: "Date must be DD-MM-YYYY or YYYY-MM-DD" }),
  country: z.string().min(1, "Country is required"),
  nationality: z.string().optional(),
  hotelTransfer: z.string().min(1, "Hotel Transfer Service is required"),
  notes: z.string().optional(),
  surfAbility: surfAbilitySchema,
  surfExperience: surfExperienceSchema,
  agree: z.literal(true, { errorMap: () => ({ message: "You must agree to continue" }) }),
}); 