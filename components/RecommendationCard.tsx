"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";

interface RecommendationCardProps {
  rec: any;
  getDisplayPrice: (price: any) => string;
  checked: boolean;
  onChange: () => void;
  isDisabled: boolean;
  tooltipMsg?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  rec,
  getDisplayPrice,
  checked,
  onChange,
  isDisabled,
  tooltipMsg,
}) => {
  const [showModal, setShowModal] = useState(false);

  // Console log untuk debugging
  // console.log('RecommendationCard - rec:', rec);
  // console.log('RecommendationCard - rec.pkg:', rec.pkg);

  return (
    <>
      <div
        className={`mb-3 sm:mb-4 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row bg-white overflow-hidden transition-all duration-200 hover:shadow-md ${
          checked ? "ring-2 ring-blue-500 border-blue-200" : "hover:border-gray-300"
        }`}
      >
        {/* Image Section */}
        <div className="w-full sm:w-40 h-40 sm:h-auto relative flex-shrink-0">
          <Image
            src={
              rec.pkg?.image && typeof rec.pkg.image === "string" && rec.pkg.image.length > 0
                ? rec.pkg.image
                : "/placeholder.svg"
            }
            alt={
              rec.pkg?.title && typeof rec.pkg.title === "string" && rec.pkg.title.length > 0
                ? rec.pkg.title
                : "Package image"
            }
            fill
            priority
            className="object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 sm:p-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">{rec.pkg.name}</span>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {/* Package Code Badge */}
              <span className="px-2 sm:px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                {rec.pkg.code}
              </span>
              {/* Type Badge */}
              <span className="px-2 sm:px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full">
                {rec.pkg.type === 'ST' ? 'Surf Tour' : rec.pkg.type === 'L' ? 'Surf Lesson' : rec.pkg.type}
              </span>
              {/* Level Badge */}
              <span className="px-2 sm:px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full">
                Level {rec.pkg.level}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
            <div className="mb-1 sm:mb-2">{rec.pkg.desc_short}</div>
            <div className="text-xs text-gray-500">{rec.pkg.desc_long}</div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
            <div>
              <span className="text-gray-500 text-xs">Capacity:</span>
              <span className="font-medium text-gray-900 ml-1">{rec.pkg.person} Person</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Age Group:</span>
              <span className="font-medium text-gray-900 ml-1">
                {rec.pkg.age === 'A' ? 'All Ages' :
                  rec.pkg.age === 'Ch1' ? 'Child (7-10)' : 
                  rec.pkg.age === 'Ch2' ? 'Child (11-15)' : 
                  rec.pkg.age === 'Ad' ? 'Adult' : rec.pkg.age}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Level:</span>
              <span className="font-medium text-gray-900 ml-1">
                {rec.pkg.level === 'A' ? 'Advanced' : 
                 rec.pkg.level === 'B' ? 'Beginner' : 
                 rec.pkg.level === 'I' ? 'Intermediate' : rec.pkg.level}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Status:</span>
              <span className={`font-medium ml-1 ${rec.pkg.active === 'Y' ? 'text-green-600' : 'text-red-600'}`}>
                {rec.pkg.active === 'Y' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Validity Period */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            <span className="text-xs bg-gray-50 text-gray-700 px-2 sm:px-3 py-1 rounded-full border border-gray-200">
              Valid: {new Date(rec.pkg.active_from).toLocaleDateString()} - {new Date(rec.pkg.active_to).toLocaleDateString()}
            </span>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{getDisplayPrice(parseFloat(rec.pkg.price))}</div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Tooltip content={isDisabled ? (tooltipMsg || "") : ""}>
                <span>
                  <label className="inline-flex items-center cursor-pointer select-none">
                    <input
                      type="radio"
                      checked={checked}
                      onChange={onChange}
                      disabled={isDisabled}
                      className="hidden"
                      aria-label={`Select ${rec.pkg.title}`}
                    />
                    <span
                      className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 font-semibold rounded-lg transition-all duration-200 text-white text-xs sm:text-sm md:text-base text-center
                        ${checked ? "bg-blue-600 shadow-md" : isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 hover:shadow-md"}
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                      `}
                      tabIndex={0}
                      role="radio"
                      aria-checked={checked}
                      aria-disabled={isDisabled}
                      onKeyDown={(e) => {
                        if (!isDisabled && (e.key === " " || e.key === "Enter")) onChange();
                      }}
                    >
                      {checked ? "SELECTED" : "BOOK"}
                    </span>
                  </label>
                </span>
              </Tooltip>

              {/* Detail Button */}
              <button
                onClick={() => setShowModal(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                See Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl max-w-md w-full shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl transition-colors"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 pr-8 text-gray-900">{rec.pkg.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">{rec.pkg.desc_long}</p>
            
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-3 sm:mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Package Code:</span>
                <span className="font-medium text-gray-900">{rec.pkg.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium text-gray-900">
                  {rec.pkg.type === 'ST' ? 'Surf Tour' : rec.pkg.type === 'L' ? 'Surf Lesson' : rec.pkg.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Level:</span>
                <span className="font-medium text-gray-900">
                  {rec.pkg.level === 'A' ? 'Advanced' : 
                   rec.pkg.level === 'B' ? 'Beginner' : 
                   rec.pkg.level === 'I' ? 'Intermediate' : rec.pkg.level}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Capacity:</span>
                <span className="font-medium text-gray-900">{rec.pkg.person} Person</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Age Group:</span>
                <span className="font-medium text-gray-900">
                  {rec.pkg.age === 'A' ? 'All Ages' :
                    rec.pkg.age === 'Ch1' ? 'Child (7-10)' : 
                    rec.pkg.age === 'Ch2' ? 'Child (11-15)' : 
                    rec.pkg.age === 'Ad' ? 'Adult' : rec.pkg.age}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-medium ${rec.pkg.active === 'Y' ? 'text-green-600' : 'text-red-600'}`}>
                  {rec.pkg.active === 'Y' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valid From:</span>
                <span className="font-medium text-gray-900">{new Date(rec.pkg.active_from).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valid To:</span>
                <span className="font-medium text-gray-900">{new Date(rec.pkg.active_to).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendationCard;
