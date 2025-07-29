"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RecommendationCard from "./RecommendationCard"
import { getRecommendedPackagesForPerson, convertPackageToUIFormat } from "@/lib/masterDataHelpers"

interface AdultForm {
  name: string;
  level: string;
  medical?: string[];
  medical_other?: string;
}

interface ChildForm {
  name: string;
  age: string;
  level: string;
  medical?: string[];
  medical_other?: string;
}

interface ParticipantFormProps {
  formData: any;
  setFormData: (data: any) => void;
  adultCount: number;
  setAdultCount: (count: number) => void;
  childrenCount: number;
  setChildrenCount: (count: number) => void;
  selectedPackages: any;
  setSelectedPackages: (packages: any) => void;
  recommendedFromApi: any[];
  selectedActivities: any;
  reservationDays: Array<{ date: string; time: string }>;
  errors: { [key: string]: string };
  getDisplayPrice: (price: any) => string;
  getRecKey: (rec: any) => string;
  handleSelect: (rec: any) => void;
  handleCancel: (recKey: string) => void;
  validateField: (fieldName: string, value: any, context?: any) => void;
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
  handleSelect,
  handleCancel,
  validateField
}: ParticipantFormProps) {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6 mt-12 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>
            <p className="text-sm text-slate-600 mt-1">Please provide participant details and surf proficiency levels</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-sm text-gray-600 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="mb-2">Please insert names and surf proficiency level.</p>
          <p className="mb-2">If you take Intermediate Lesson/ Surf Tour, you must to fill up the surf abilities form.</p>
          <p>The form is available on the next personal information page.</p>
        </div>

        {/* Adult Section */}
        <div>
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-900 mb-2">Adult Participants</h3>
            <p className="text-sm text-gray-600">Add adult participants (16+ years)</p>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Number of Adults:</label>
            <select
              value={adultCount.toString()}
              onChange={(e) => {
                const count = parseInt(e.target.value);
                setAdultCount(count);
                setFormData((prev: any) => ({
                  ...prev,
                  adults: Array.from({ length: count }, (_, i) => prev.adults[i] || { 
                    name: "", 
                    level: "beginner",
                    medical: ["no_medical"],
                    medical_other: ""
                  })
                }));
              }}
              className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="0">0</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {formData.adults.slice(0, adultCount).map((adult: any, idx: number) => {
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
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <h4 className="text-base font-medium text-gray-900">Adult {idx + 1}</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Form Section */}
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <Input
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={adult.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newAdults = [...formData.adults];
                              newAdults[idx].name = e.target.value;
                              setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                            }}
                            placeholder="Enter name..."
                          />
                          {errors[`adult_name_${idx}`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`adult_name_${idx}`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                          <select
                            value={adult.level}
                            onChange={(e) => {
                              const newAdults = [...formData.adults];
                              newAdults[idx].level = e.target.value;
                              setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            {levelOptions.map(opt => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                          {errors[`adult_level_${idx}`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`adult_level_${idx}`]}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Package Status */}
                    {Object.values(selectedPackages || {}).some((pkg: any) =>
                      pkg.people.includes(adult.name) && pkg.pkg?.id
                    ) ? (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h5 className="text-sm font-medium text-green-800">Package Selected</h5>
                        </div>
                        {Object.values(selectedPackages || {}).map((pkg: any) => 
                          pkg.people.includes(adult.name) && pkg.pkg?.id ? (
                            <div key={pkg.pkg.id} className="text-sm text-green-700">
                              <strong>{pkg.pkg.title}</strong> - {pkg.pkg.price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </div>
                          ) : null
                        )}
                      </div>
                    ) : adult.name.trim() !== "" ? (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h5 className="text-sm font-medium text-yellow-800">Package Not Selected</h5>
                        </div>
                        <p className="text-sm text-yellow-700">Please select a package for {adult.name}</p>
                      </div>
                    ) : null}

                    {/* Recommendations Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
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
                          // Show selected packages if no recommendations available (e.g., after reload)
                          Object.values(selectedPackages || {}).some((pkg: any) => pkg.people.includes(adult.name)) ? (
                            Object.values(selectedPackages || {}).filter((pkg: any) => pkg.people.includes(adult.name)).map((pkg: any, recIdx) => (
                              <RecommendationCard
                                key={recIdx}
                                rec={pkg}
                                getDisplayPrice={getDisplayPrice}
                                checked={true}
                                onChange={() => handleCancel(getRecKey(pkg))}
                                isDisabled={false}
                                tooltipMsg={"Selected package"}
                              />
                            ))
                          ) : (
                            <div className="text-gray-500 text-sm italic p-4 bg-gray-50 rounded-lg border border-gray-200">
                              No packages to recommend for this participant.
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Medical Conditions Section - Only show if package is selected */}
                    {Object.values(selectedPackages || {}).some((pkg: any) => 
                      pkg.people.includes(adult.name) && pkg.pkg?.id
                    ) && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h5 className="text-sm font-medium text-red-800">Medical Conditions</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("no_medical") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = ["no_medical"];
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              No medical conditions
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("heart_condition") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("heart_condition");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "heart_condition");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Heart condition
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("asthma") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("asthma");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "asthma");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Asthma
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("epilepsy") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("epilepsy");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "epilepsy");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Epilepsy
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("broken_bones") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("broken_bones");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "broken_bones");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Broken bones
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("dislocated_joints") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("dislocated_joints");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "dislocated_joints");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Dislocated joints
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("diabetes") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("diabetes");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "diabetes");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Diabetes
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("water_contact_lenses") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("water_contact_lenses");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "water_contact_lenses");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Water contact lenses
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("hearing_impairment") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("hearing_impairment");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "hearing_impairment");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Hearing impairment
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("pregnant") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("pregnant");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "pregnant");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Pregnant
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={adult.medical?.includes("other") || false}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  if (!newAdults[idx].medical) newAdults[idx].medical = [];
                                  if (e.target.checked) {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "no_medical");
                                    newAdults[idx].medical.push("other");
                                  } else {
                                    newAdults[idx].medical = newAdults[idx].medical.filter((m: string) => m !== "other");
                                  }
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                className="w-4 h-4"
                              />
                              Other
                            </label>
                          </div>
                          
                          {/* Custom medical condition input */}
                          {(adult.medical?.includes("other") || false) && (
                            <div className="mt-2">
                              <label className="text-xs text-gray-600">Please specify:</label>
                              <Input
                                className="w-full h-8 text-xs mt-1"
                                value={adult.medical_other || ""}
                                onChange={(e) => {
                                  const newAdults = [...formData.adults];
                                  newAdults[idx].medical_other = e.target.value;
                                  setFormData((prev: any) => ({ ...prev, adults: newAdults }));
                                }}
                                placeholder="Describe your medical condition..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* === Peer/Group Recommendations Section === */}
            {/* <div className="max-w-6xl">
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Recommended Peer/Group Packages</h3>
                <div className="space-y-4">

                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Children Section */}
        <div>
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-900 mb-2">Child Participants</h3>
            <p className="text-sm text-gray-600">Add child participants (7-15 years)</p>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Number of Children:</label>
            <select
              value={childrenCount.toString()}
              onChange={(e) => {
                const count = parseInt(e.target.value);
                setChildrenCount(count);
                setFormData((prev: any) => ({
                  ...prev,
                  children: Array.from({ length: count }, (_, i) => prev.children[i] || { 
                    name: "", 
                    age: "7-years",
                    level: "beginner",
                    medical: ["no_medical"],
                    medical_other: ""
                  })
                }));
              }}
              className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="0">0</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {formData.children.slice(0, childrenCount).map((child: any, idx: number) => {
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
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <h4 className="text-base font-medium text-gray-900">Child {idx + 1}</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Form Section */}
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <Input
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={child.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newChildren = [...formData.children];
                              newChildren[idx].name = e.target.value;
                              setFormData((prev: any) => ({ ...prev, children: newChildren }));
                            }}
                            placeholder="Enter name..."
                          />
                          {errors[`child_name_${idx}`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`child_name_${idx}`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                          <select
                            value={child.age}
                            onChange={(e) => {
                              const newChildren = [...formData.children];
                              newChildren[idx].age = e.target.value;
                              setFormData((prev: any) => ({ ...prev, children: newChildren }));
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            {Array.from({ length: 9 }, (_, i) => (
                              <option key={i + 7} value={`${i + 7}-years`}>{i + 7} Years</option>
                            ))}
                          </select>
                          {errors[`child_age_${idx}`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`child_age_${idx}`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                          <select
                            value={child.level}
                            onChange={(e) => {
                              const newChildren = [...formData.children];
                              newChildren[idx].level = e.target.value;
                              setFormData((prev: any) => ({ ...prev, children: newChildren }));
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            {levelOptions.map(opt => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                          {errors[`child_level_${idx}`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`child_level_${idx}`]}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Package Recommendations for Children */}
                    {Object.values(selectedPackages || {}).some((pkg: any) =>
                      pkg.people.includes(child.name) && pkg.pkg?.id
                    ) ? (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="text-xs sm:text-sm font-medium text-green-800 mb-2">✅ Package Selected</h5>
                        {Object.values(selectedPackages || {}).map((pkg: any) => 
                          pkg.people.includes(child.name) && pkg.pkg?.id ? (
                            <div key={pkg.pkg.id} className="text-xs text-green-700">
                              <strong>{pkg.pkg.title}</strong> - {pkg.pkg.price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </div>
                          ) : null
                        )}
                      </div>
                    ) : child.name.trim() !== "" ? (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h5 className="text-xs sm:text-sm font-medium text-yellow-800 mb-2">⚠️ Package Not Selected</h5>
                        <p className="text-xs text-yellow-700">Please select a package for {child.name}</p>
                      </div>
                    ) : null}

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
                          // Show selected packages if no recommendations available (e.g., after reload)
                          Object.values(selectedPackages || {}).some((pkg: any) => pkg.people.includes(child.name)) ? (
                            Object.values(selectedPackages || {}).filter((pkg: any) => pkg.people.includes(child.name)).map((pkg: any, recIdx) => (
                              <RecommendationCard
                                key={recIdx}
                                rec={pkg}
                                getDisplayPrice={getDisplayPrice}
                                checked={true}
                                onChange={() => handleCancel(getRecKey(pkg))}
                                isDisabled={false}
                                tooltipMsg={"Selected package"}
                              />
                            ))
                          ) : (
                            <div className="text-gray-500 text-xs sm:text-sm italic p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                              No packages to recommend for this participant.
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Medical Conditions Section - Only show if package is selected */}
                    {Object.values(selectedPackages || {}).some((pkg: any) => 
                      pkg.people.includes(child.name) && pkg.pkg?.id
                    ) && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <h5 className="text-xs sm:text-sm font-medium text-red-800 mb-3">Medical Conditions</h5>
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("no_medical") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = ["no_medical"];
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              No medical conditions
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("heart_condition") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("heart_condition");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "heart_condition");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Heart condition
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("asthma") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("asthma");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "asthma");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Asthma
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("epilepsy") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("epilepsy");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "epilepsy");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Epilepsy
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("broken_bones") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("broken_bones");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "broken_bones");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Broken bones
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("dislocated_joints") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("dislocated_joints");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "dislocated_joints");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Dislocated joints
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("diabetes") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("diabetes");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "diabetes");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Diabetes
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("water_contact_lenses") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("water_contact_lenses");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "water_contact_lenses");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Water contact lenses
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("hearing_impairment") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("hearing_impairment");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "hearing_impairment");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Hearing impairment
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("pregnant") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("pregnant");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "pregnant");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Pregnant
                            </label>
                            <label className="flex items-center gap-2 text-xs text-red-700">
                              <input
                                type="checkbox"
                                checked={child.medical?.includes("other") || false}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  if (!newChildren[idx].medical) newChildren[idx].medical = [];
                                  if (e.target.checked) {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "no_medical");
                                    newChildren[idx].medical.push("other");
                                  } else {
                                    newChildren[idx].medical = newChildren[idx].medical.filter((m: string) => m !== "other");
                                  }
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                className="w-4 h-4"
                              />
                              Other
                            </label>
                          </div>
                          
                          {/* Custom medical condition input */}
                          {(child.medical?.includes("other") || false) && (
                            <div className="mt-2">
                              <label className="text-xs text-gray-600">Please specify:</label>
                              <Input
                                className="w-full h-8 text-xs mt-1"
                                value={child.medical_other || ""}
                                onChange={(e) => {
                                  const newChildren = [...formData.children];
                                  newChildren[idx].medical_other = e.target.value;
                                  setFormData((prev: any) => ({ ...prev, children: newChildren }));
                                }}
                                placeholder="Describe your medical condition..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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