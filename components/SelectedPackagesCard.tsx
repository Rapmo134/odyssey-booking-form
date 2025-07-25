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
            <Button variant="outline" size="sm" onClick={() => onCancel(rec.recKey || Object.keys(rec).find(key => key !== 'pkg') || '')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectedPackagesCard;
