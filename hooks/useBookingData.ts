"use client"

// /hooks/useBookingData.ts
import { useEffect, useState } from "react";
import { getBookingData, getMasterData, getRecommendedPackages } from "@/service/bookingApi";

export const useBookingData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getBookingData().then((res) => {
      setData(res.data.data);
    });
  }, []);

  return data;
};

// Hook untuk recommended packages
export const useRecommendedPackages = (criteria: {
  activities: string[];
  duration: string;
  adultCount: number;
  childrenCount: number;
  levels: string[];
}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (criteria.activities.length > 0) {
      setLoading(true);
      setError(null);
      
      getRecommendedPackages(criteria)
        .then((res) => {
          setPackages(res.data.data || []);
        })
        .catch((err) => {
          setError(err.message);
          // Fallback ke dummy data jika API error
          setPackages([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [criteria]);

  return { packages, loading, error };
};
