"use client"
import Image from "next/image"
import { Star, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function Step2Activities({ onNextStep, onBack }: { onNextStep: () => void, onBack: () => void }) {
  // This shows the summary from Step 1, not interactive filters
  const step1Summary = {
    surfingActivities: ["Surf Lessons"],
    duration: "1 Day",
    reservationDate: "28-06-2025",
    reservationTime: "7:00 AM",
    adults: 2,
    children: 3,
    proficiencyLevels: ["Beginner", "Intermediate"],
  }

  const recommendedPackages = [
    {
      id: 1,
      category: "INDIVIDUAL ACTIVITIES",
      categoryBadges: ["5"],
      badgeColor: "bg-blue-500",
      title: "Private Lesson",
      description:
        "Private lesson with your personal instructor. If you want to get personalized attention, then this is it. We recommend this private lesson for those who are serious about surfing and advancing their surf skills.",
      image: "/placeholder.svg?height=120&width=160",
      details: {
        ageGroup: "10+ Years",
        duration: "Max: 2.5 hours",
        price: "IDR 750,000",
        date: "28-06-2025",
        difficulty: "All Levels",
      },
      rating: 5,
      reviews: 3,
      bookingCode: "ITSBOOK",
    },
    {
      id: 2,
      category: "INDIVIDUAL ACTIVITIES",
      categoryBadges: ["5"],
      badgeColor: "bg-blue-500",
      title: "Group Lesson",
      description:
        "Combine surf for the new beginners. 1 to 4 about. Your students maximum supported by one instructor. Suitable for those who are looking to share in the lesson expense.",
      image: "/placeholder.svg?height=120&width=160",
      details: {
        ageGroup: "10+ Years",
        duration: "Max: 2.5 hours",
        price: "IDR 450,000",
        date: "28-06-2025",
        difficulty: "Beginner",
      },
      rating: 5,
      reviews: 1,
      bookingCode: "ITSBOOK",
    },
    {
      id: 3,
      category: "ACTIVITIES WITH PEERS",
      categoryBadges: ["2", "5"],
      badgeColor: "bg-green-500",
      title: "Adult Private Lesson",
      description:
        "Perfect for couples, 2 friends or 2 children aged maximum 15 y.o. Few students and experienced by one instructor. We ensure you to be able to catch up on your board in the shortest time possible. The full time instructor will guide you through the whole lesson.",
      image: "/placeholder.svg?height=120&width=160",
      details: {
        ageGroup: "Adult",
        duration: "Max: 2.5 hours",
        price: "IDR 950,000",
        date: "28-06-2025",
        difficulty: "All Levels",
      },
      rating: 5,
      reviews: 1,
      bookingCode: "ITSBOOK",
    },
  ]

  const groupedPackages = recommendedPackages.reduce(
    (acc, pkg) => {
      if (!acc[pkg.category]) {
        acc[pkg.category] = []
      }
      acc[pkg.category].push(pkg)
      return acc
    },
    {} as Record<string, typeof recommendedPackages>,
  )

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      {/* Left Sidebar - Search Criteria Summary */}
      <div className="w-64 bg-white rounded-lg shadow-sm p-4">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Search Criteria</h3>

          {/* Surf Proficiency Level Summary */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-blue-600 mb-3">Surf Proficiency Level</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={step1Summary.proficiencyLevels.includes("Beginner")} disabled />
                <span className="text-blue-500">Beginner</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={step1Summary.proficiencyLevels.includes("Intermediate")} disabled />
                <span className="text-blue-500">Intermediate</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={step1Summary.proficiencyLevels.includes("Advanced")} disabled />
                <span className="text-blue-500">Advanced</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={false} disabled />
                <span className="text-blue-500">Kids</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={true} disabled />
                <span className="text-blue-500">Adults</span>
              </label>
            </div>
          </div>

          {/* Other Criteria Summary */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <strong>Activities:</strong> {step1Summary.surfingActivities.join(", ")}
            </p>
            <p>
              <strong>Duration:</strong> {step1Summary.duration}
            </p>
            <p>
              <strong>Date:</strong> {step1Summary.reservationDate}
            </p>
            <p>
              <strong>Time:</strong> {step1Summary.reservationTime}
            </p>
            <p>
              <strong>Adults:</strong> {step1Summary.adults}
            </p>
            <p>
              <strong>Children:</strong> {step1Summary.children}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Recommended Packages */}
      <div className="flex-1">
        {Object.entries(groupedPackages).map(([category, packages]) => (
          <div key={category} className="mb-8">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-orange-400 fill-orange-400" />
              <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
              {packages[0].categoryBadges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-bold text-white rounded ${packages[0].badgeColor}`}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Package Cards */}
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex">
                    {/* Package Image */}
                    <div className="w-40 h-32 relative">
                      <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
                    </div>

                    {/* Package Details */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{pkg.title}</h3>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-blue-600">({pkg.reviews} reviews)</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{pkg.description}</p>

                      {/* Package Info Grid */}
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-gray-500">Age</div>
                          <div className="font-medium">{pkg.details.ageGroup}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Duration</div>
                          <div className="font-medium">{pkg.details.duration}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Date</div>
                          <div className="font-medium">{pkg.details.date}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Level</div>
                          <div className="font-medium">{pkg.details.difficulty}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Social Icons */}
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">PRICE/PERSON</div>
                            <div className="text-lg font-bold text-gray-800">{pkg.details.price}</div>
                          </div>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-semibold">
                            BOOK
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            WHATSAPP
          </Button>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 font-semibold"
            onClick={onBack}
          >ENQUIRE</Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold"
            onClick={onNextStep}
          >
            CONTINUE BOOKING
          </Button>
        </div>
      </div>
    </div>
  )
}
