import Image from "next/image"
import { Star, Facebook, Instagram, Youtube, HelpCircle } from "lucide-react"

export default function BookingHeader() {
  return (
    <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full overflow-hidden">
      <Image
        src="https://images.pexels.com/photos/6299936/pexels-photo-6299936.jpeg"
        alt="Surf School Header"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Logo Top Left */}
      <div className="absolute top-2 sm:top-4 left-3 sm:left-6 flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white fill-white" />
        </div>
        <div className="text-black font-bold text-xs sm:text-sm leading-tight">
          <div>ODYSSEYS</div>
          <div>SURF</div>
          <div>SCHOOL</div>
        </div>
      </div>

      {/* Social Icons Top Right */}
      <div className="absolute top-2 sm:top-4 right-3 sm:right-6 flex gap-1 sm:gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
          <Facebook className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gray-600" />
        </div>
        <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
          <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gray-600" />
        </div>
        <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
          <Youtube className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gray-600" />
        </div>
        <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
          <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gray-600" />
        </div>
      </div>
    </div>
  )
} 