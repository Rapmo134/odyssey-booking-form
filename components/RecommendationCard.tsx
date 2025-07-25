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
        className={`mb-4 border rounded-lg shadow-sm flex bg-white overflow-hidden ${
          checked ? "ring-2 ring-orange-500" : ""
        }`}
        style={{ borderColor: "#e5e7eb" }}
      >
        <div className="w-40 relative flex-shrink-0">
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
            className="object-cover rounded-l-lg"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-800 text-base">{rec.pkg.title}</span>
            {rec.pkg.categoryBadges?.map((badge: string, i: number) => (
              <span key={i} className={`px-2 py-1 text-xs font-bold text-white rounded ${rec.pkg.badgeColor}`}>
                {badge}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-700 mb-2">{rec.pkg.description}</div>
          <div className="grid grid-cols-4 gap-4 text-xs mb-2">
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
          <div className="flex flex-wrap gap-1 mb-2">
            {rec.pkg.includes?.map((item: string, i: number) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {item}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-lg font-bold text-gray-800">{getDisplayPrice(rec.pkg.price)}</div>
            <div className="flex gap-3">
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
                      className={`px-6 py-2 font-semibold rounded transition-colors text-white text-sm
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
                className="px-3 py-1.5 text-sm font-medium text-blue-500 border border-blue-400 rounded-sm hover:bg-blue-500 hover:text-white transition duration-150 ease-in-out"
              >
                Lihat Detail
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">{rec.pkg.title}</h2>
            <p className="text-sm text-gray-700 mb-3">{rec.pkg.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
              {rec.pkg.includes?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="text-sm mb-1">
              <strong>Duration:</strong> {rec.pkg.duration}
            </div>
            <div className="text-sm mb-1">
              <strong>Level:</strong> {rec.pkg.level}
            </div>
            <div className="text-sm mb-1">
              <strong>Max Students:</strong> {rec.pkg.maxStudents}
            </div>
            <div className="text-sm">
              <strong>Reviews:</strong> {rec.pkg.reviews}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendationCard;
