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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{rec.pkg.title}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {rec.pkg.categoryBadges?.map((badge: string, i: number) => (
                <span key={i} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-lg sm:text-xl font-bold text-gray-900">{getDisplayPrice(rec.pkg.price)}</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onCancel(rec.recKey || Object.keys(rec).find(key => key !== 'pkg') || '')}
              className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
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
