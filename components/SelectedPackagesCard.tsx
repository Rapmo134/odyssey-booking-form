"use client";

import { useState } from "react";
import Image from "next/image";
import { Info, Star } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "./ui/button";

interface SelectedPackagesCardProps {
  rec: any;
  getDisplayPrice: (price: any) => string;
  checked: boolean;
  onCancel: (recKey: string) => void;
}

const SelectedPackagesCard: React.FC<SelectedPackagesCardProps> = ({
  rec,
  getDisplayPrice,
  checked,
  onCancel,
}) => {

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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">{rec.pkg.name}</span>
            </div>
            <div className="flex flex-wrap gap-1">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{getDisplayPrice(rec.pkg.price)}</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onCancel(rec.recKey || Object.keys(rec).find(key => key !== 'pkg') || '')}
              className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectedPackagesCard;
