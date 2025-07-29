import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingFooter() {
  return (
    <footer className="bg-black text-white mt-4 sm:mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Products */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-white">PRODUCTS</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs text-gray-300">
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
            <h3 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-white">ABOUT US</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs text-gray-300">
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
            <h3 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-white">HELP</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs text-gray-300">
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
            <div className="mt-3 sm:mt-4">
              <select
                defaultValue="english"
                className="w-24 sm:w-32 bg-gray-800 border-gray-600 text-white text-xs"
              >
                <option value="english">ENGLISH</option>
                <option value="indonesian">INDONESIAN</option>
              </select>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800">
          <h3 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-gray-400">OUR PARTNERS</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="text-white text-sm sm:text-lg font-bold">OAKLEY</div>
            <div className="flex gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-700 rounded-full"></div>
            </div>
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
                <div key={i} className={`w-4 h-6 sm:w-5 sm:h-8 lg:w-6 lg:h-10 ${color} rounded-sm`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 