"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RecommendationCard from "./RecommendationCard"
import { getRecommendedPackagesForPerson, convertPackageToUIFormat } from "@/lib/masterDataHelpers"

interface AdultForm {
  name: string;
  level: string;
}

interface ChildForm {
  name: string;
  age: string;
  level: string;
}

interface ParticipantFormProps {
  formData: {
    adults: AdultForm[];
    children: ChildForm[];
  };
  setFormData: (data: any) => void;
  adultCount: number;
  setAdultCount: (count: number) => void;
  childrenCount: number;
  setChildrenCount: (count: number) => void;
  selectedActivities: Record<string, boolean>;
  reservationDays: Array<{ date: string; time: string }>;
  selectedPackages: { [key: string]: any };
  errors: { [key: string]: string };
  getDisplayPrice: (price: any) => string;
  getRecKey: (rec: any) => string;
  handleSelect: (rec: any) => void;
}

const levelOptions = ["beginner", "intermediate", "advanced"];

export default function ParticipantForm({
  formData,
  setFormData,
  adultCount,
  setAdultCount,
  childrenCount,
  setChildrenCount,
  selectedActivities,
  reservationDays,
  selectedPackages,
  errors,
  getDisplayPrice,
  getRecKey,
  handleSelect
}: ParticipantFormProps) {
  return (
    <>
      {/* Personal Information */}
      <div className="bg-gray-100 p-3 sm:p-4 mb-1 rounded-lg">
        <h2 className="text-xs sm:text-sm font-semibold text-sky-600">Personal Information</h2>
      </div>
      
      <div className="p-3 sm:p-4 bg-white">
        <div className="text-xs text-gray-600 mb-4 space-y-1">
          <p>Please insert names and surf proficiency level.</p>
          <p>If you take Intermediate Lesson/ Surf Tour, you must to fill up the surf abilities form.</p>
          <p>The form is available on the next personal information page.</p>
        </div>

        {/* Adult Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <span className="text-xs sm:text-sm font-semibold text-orange-500 w-16">Adult</span>
            <Select value={adultCount.toString()} onValueChange={val => {
              const count = parseInt(val);
              setAdultCount(count);
              setFormData((prev: any) => ({
                ...prev,
                adults: Array.from({ length: count }, (_, i) => prev.adults[i] || { name: "", level: "beginner" })
              }));
            }}>
              <SelectTrigger className="w-16 h-8 text-xs sm:text-sm">
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 sm:ml-20">
            {formData.adults.slice(0, adultCount).map((adult, idx) => {
              // Generate recommendations for this specific adult
              let typeCriteria: 'L' | 'ST' | Array<'L' | 'ST'> = 'L';
              if (selectedActivities.surfLessons && selectedActivities.surfTours) {
                typeCriteria = ['L', 'ST'];
              } else if (selectedActivities.surfTours) {
                typeCriteria = 'ST';
              } else {
                typeCriteria = 'L';
              }
              const adultCriteria = {
                level: (adult.level === 'beginner' ? 'B' : adult.level === 'intermediate' ? 'I' : 'A') as 'B' | 'I' | 'A',
                age: 'Ad' as 'Ad',
                type: typeCriteria,
                bookingDate: reservationDays[0]?.date,
                personCount: 1,
              };
              const recommendedFromApi = getRecommendedPackagesForPerson(adultCriteria).map(pkg => ({
                pkg: convertPackageToUIFormat(pkg),
                people: [adult.name],
                type: 'adult',
                level: adult.level
              }));
              
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                  <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Form Section */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-xs sm:text-sm w-12 font-medium">Name</span>
                          <Input
                            className="w-full sm:w-52 h-8 text-xs sm:text-sm"
                            value={adult.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newAdults = [...formData.adults];
                              newAdults[idx].name = e.target.value;
                              setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                            }}
                            placeholder="Your name..."
                          />
                        </div>
                        <Select
                          value={adult.level}
                          onValueChange={val => {
                            const newAdults = [...formData.adults];
                            newAdults[idx].level = val;
                            setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                          }}
                        >
                          <SelectTrigger className="w-full sm:w-28 h-8 text-xs sm:text-sm">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {levelOptions.map(opt => (
                              <SelectItem key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors[`adult_name_${idx}`] && (
                        <span className="text-red-500 text-xs ml-0 sm:ml-12">{errors[`adult_name_${idx}`]}</span>
                      )}
                      {errors[`adult_level_${idx}`] && (
                        <span className="text-red-500 text-xs ml-0 sm:ml-12">{errors[`adult_level_${idx}`]}</span>
                      )}
                    </div>

                    {/* Recommendations Section */}
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Recommended Packages for {adult.name || `Adult ${idx + 1}`}
                      </h4>
                      <div className="space-y-2">
                        {recommendedFromApi.length > 0 ? (
                          recommendedFromApi.map((rec, recIdx) => {
                            const recKey = getRecKey(rec);
                            const checked = selectedPackages[recKey]?.pkg?.id === rec.pkg.id;
                            
                            return (
                              <RecommendationCard
                                key={recIdx}
                                rec={rec}
                                getDisplayPrice={getDisplayPrice}
                                checked={checked}
                                onChange={() => handleSelect(rec)}
                                isDisabled={false}
                                tooltipMsg={""}
                              />
                            );
                          })
                        ) : (
                          <div className="text-gray-500 text-xs sm:text-sm italic p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                            No packages to recommend for this participant.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* === Peer/Group Recommendations Section === */}
            <div className="max-w-6xl">
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Recommended Peer/Group Packages</h3>
                <div className="space-y-4">
                  {/* Placeholder for peer/group recommendations */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <div className="w-16">
              <span className="text-xs sm:text-sm font-semibold text-orange-500">Children</span>
              <div className="text-xs text-gray-500">7 until 15 years</div>
            </div>
            <Select value={childrenCount.toString()} onValueChange={val => {
              const count = parseInt(val);
              setChildrenCount(count);
              setFormData((prev: any) => ({
                ...prev,
                children: Array.from({ length: count }, (_, i) => prev.children[i] || { name: "", age: "7-years", level: "beginner" })
              }));
            }}>
              <SelectTrigger className="w-16 h-8 text-xs sm:text-sm">
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 sm:ml-20">
            {formData.children.slice(0, childrenCount).map((child, idx) => {
              // Generate recommendations for this specific child
              let typeCriteriaChild: 'L' | 'ST' | Array<'L' | 'ST'> = 'L';
              if (selectedActivities.surfLessons && selectedActivities.surfTours) {
                typeCriteriaChild = ['L', 'ST'];
              } else if (selectedActivities.surfTours) {
                typeCriteriaChild = 'ST';
              } else {
                typeCriteriaChild = 'L';
              }
              const childCriteria = {
                level: (child.level === 'beginner' ? 'B' : child.level === 'intermediate' ? 'I' : 'A') as 'B' | 'I' | 'A',
                age: 'Ch2' as 'Ch2',
                type: typeCriteriaChild,
                bookingDate: reservationDays[0]?.date,
                personCount: 1,
              };
              const recommendedFromApi = getRecommendedPackagesForPerson(childCriteria).map(pkg => ({
                pkg: convertPackageToUIFormat(pkg),
                people: [child.name],
                type: 'children',
                level: child.level
              }));
              
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                  <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Form Section */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-xs sm:text-sm w-12 font-medium">Name</span>
                          <Input
                            className="w-full sm:w-52 h-8 text-xs sm:text-sm"
                            value={child.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newChildren = [...formData.children];
                              newChildren[idx].name = e.target.value;
                              setFormData((prev: any) => ({ ...prev, children: newChildren }));
                            }}
                            placeholder="Your name..."
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <Select
                            value={child.age}
                            onValueChange={val => {
                              const newChildren = [...formData.children];
                              newChildren[idx].age = val;
                              setFormData((prev: any) => ({ ...prev, children: newChildren }));
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-24 h-8 text-xs sm:text-sm">
                              <SelectValue placeholder="Select age" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 9 }, (_, i) => (
                                <SelectItem key={i + 7} value={`${i + 7}-years`}>{i + 7} Years</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={child.level}
                            onValueChange={val => {
                              const newChildren = [...formData.children];
                              newChildren[idx].level = val;
                              setFormData((prev: any) => ({ ...prev, children: newChildren }));
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-28 h-8 text-xs sm:text-sm">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {levelOptions.map(opt => (
                                <SelectItem key={opt} value={opt}>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {errors[`child_name_${idx}`] && (
                        <span className="text-red-500 text-xs ml-0 sm:ml-12">{errors[`child_name_${idx}`]}</span>
                      )}
                      {errors[`child_age_${idx}`] && (
                        <span className="text-red-500 text-xs ml-0 sm:ml-12">{errors[`child_age_${idx}`]}</span>
                      )}
                      {errors[`child_level_${idx}`] && (
                        <span className="text-red-500 text-xs ml-0 sm:ml-12">{errors[`child_level_${idx}`]}</span>
                      )}
                    </div>

                    {/* Recommendations Section */}
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Recommended Packages for {child.name || `Child ${idx + 1}`}
                      </h4>
                      <div className="space-y-2">
                        {recommendedFromApi.length > 0 ? (
                          recommendedFromApi.map((rec, recIdx) => {
                            const recKey = getRecKey(rec);
                            const checked = selectedPackages[recKey]?.pkg?.id === rec.pkg.id;
                            
                            return (
                              <RecommendationCard
                                key={recIdx}
                                rec={rec}
                                getDisplayPrice={getDisplayPrice}
                                checked={checked}
                                onChange={() => handleSelect(rec)}
                                isDisabled={false}
                                tooltipMsg={""}
                              />
                            );
                          })
                        ) : (
                          <div className="text-gray-500 text-xs sm:text-sm italic p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                            No packages to recommend for this participant.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
} 