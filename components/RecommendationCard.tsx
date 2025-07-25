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
        className={`mb-4 border rounded-lg shadow-sm flex flex-col sm:flex-row bg-white overflow-hidden ${
          checked ? "ring-2 ring-orange-500" : ""
        }`}
        style={{ borderColor: "#e5e7eb" }}
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
            className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-800 text-sm sm:text-base">{rec.pkg.title}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {rec.pkg.categoryBadges?.map((badge: string, i: number) => (
                <span key={i} className={`px-2 py-1 text-xs font-bold text-white rounded ${rec.pkg.badgeColor}`}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-gray-700 mb-3">{rec.pkg.description}</div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs mb-3">
            <div>
              <span className="text-gray-500">Duration:</span>{" "}
              <span className="font-medium">{rec.pkg.duration}</span>
            </div>
            <div>
              <span className="text-gray-500">Max Students:</span>{" "}
              <span className="font-medium">{rec.pkg.maxStudents}</span>
            </div>
            <div>
              <span className="text-gray-500">Level:</span>{" "}
              <span className="font-medium">{rec.pkg.level}</span>
            </div>
            <div>
              <span className="text-gray-500">Reviews:</span>{" "}
              <span className="font-medium">{rec.pkg.reviews}</span>
            </div>
          </div>

          {/* Includes */}
          <div className="flex flex-wrap gap-1 mb-3">
            {rec.pkg.includes?.map((item: string, i: number) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {item}
              </span>
            ))}
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-base sm:text-lg font-bold text-gray-800">{getDisplayPrice(rec.pkg.price)}</div>
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
                      className={`px-4 sm:px-6 py-2 font-semibold rounded transition-colors text-white text-xs sm:text-sm text-center
                        ${checked ? "bg-orange-600" : isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}
                        shadow focus:outline-none focus:ring-2 focus:ring-orange-400
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
                className="px-3 py-2 text-xs sm:text-sm font-medium text-blue-500 border border-blue-400 rounded-sm hover:bg-blue-500 hover:text-white transition duration-150 ease-in-out"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl sm:text-2xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-2 pr-8">{rec.pkg.title}</h2>
            <p className="text-xs sm:text-sm text-gray-700 mb-3">{rec.pkg.description}</p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 mb-3">
              {rec.pkg.includes?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="space-y-1 text-xs sm:text-sm">
              <div>
                <strong>Duration:</strong> {rec.pkg.duration}
              </div>
              <div>
                <strong>Level:</strong> {rec.pkg.level}
              </div>
              <div>
                <strong>Max Students:</strong> {rec.pkg.maxStudents}
              </div>
              <div>
                <strong>Reviews:</strong> {rec.pkg.reviews}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendationCard;
