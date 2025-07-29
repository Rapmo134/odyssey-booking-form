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

  return (
    <>
      <div
        className={`mb-4 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row bg-white overflow-hidden transition-all duration-200 hover:shadow-md ${
          checked ? "ring-2 ring-blue-500 border-blue-200" : "hover:border-gray-300"
        }`}
      >
        {/* Image Section */}
        <div className="w-full sm:w-40 h-48 sm:h-auto relative flex-shrink-0">
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
        <div className="flex-1 p-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900 text-sm sm:text-base">{rec.pkg.title}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rec.pkg.categoryBadges?.map((badge: string, i: number) => (
                <span key={i} className={`px-3 py-1 text-xs font-medium text-white rounded-full ${rec.pkg.badgeColor}`}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-gray-600 mb-4 leading-relaxed">{rec.pkg.description}</div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-sm mb-4">
            <div>
              <span className="text-gray-500 text-xs">Duration:</span>
              <span className="font-medium text-gray-900 ml-1">{rec.pkg.duration}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Max Students:</span>
              <span className="font-medium text-gray-900 ml-1">{rec.pkg.maxStudents}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Level:</span>
              <span className="font-medium text-gray-900 ml-1">{rec.pkg.level}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Reviews:</span>
              <span className="font-medium text-gray-900 ml-1">{rec.pkg.reviews}</span>
            </div>
          </div>

          {/* Includes */}
          <div className="flex flex-wrap gap-2 mb-4">
            {rec.pkg.includes?.map((item: string, i: number) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                {item}
              </span>
            ))}
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-lg sm:text-xl font-bold text-gray-900">{getDisplayPrice(rec.pkg.price)}</div>
            <div className="flex flex-col sm:flex-row gap-3">
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
                      className={`px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 text-white text-sm text-center
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
                className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                See Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-3 pr-8 text-gray-900">{rec.pkg.title}</h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{rec.pkg.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
              {rec.pkg.includes?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium text-gray-900">{rec.pkg.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Level:</span>
                <span className="font-medium text-gray-900">{rec.pkg.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Max Students:</span>
                <span className="font-medium text-gray-900">{rec.pkg.maxStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reviews:</span>
                <span className="font-medium text-gray-900">{rec.pkg.reviews}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendationCard;
