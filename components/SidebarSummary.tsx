import React from "react";

type SidebarSummaryProps = {
  selectedActivityLabels: string;
  durationLabel: string;
  reservationDays?: { date: string; time: string }[];
  adultsSummary: string;
  childrenSummary: string;
  criteria: string;
  initials: string;
  levelLabel: string;
  selectedPackages: { [key: string]: any };
  formData: any;
};

const SidebarSummary: React.FC<SidebarSummaryProps> = ({
  selectedActivityLabels,
  durationLabel,
  reservationDays,
  adultsSummary,
  childrenSummary,
  criteria,
  initials,
  levelLabel,
  selectedPackages,
  formData,
}) => {
  const reservationSummary = (props: { date: string; time: string }[]) =>
    props.map((r, i) => `Day ${i + 1}: ${r.date || '-'} ${r.time || '-'}`).join(' | ');

  const selectedPeople = Object.values(selectedPackages).flatMap((rec: any) => rec.people);
  const allPeople = [
    ...(formData?.adults?.map((a: { name: any }) => a.name) || []),
    ...(formData?.children?.map((c: { name: any }) => c.name) || []),
  ].filter(Boolean);
  const notSelected = allPeople.filter(name => !selectedPeople.includes(name));

  return (
    <div className="w-64 bg-white rounded-xl shadow-lg p-6 sticky top-6 self-start text-sm">
      <h2 className="text-base font-semibold mb-4 border-b pb-2">Booking Selected</h2>

      {/* Basic Info */}
      <div className="space-y-3 mb-5">
        <SectionItem label="Activities" value={selectedActivityLabels} />
        <SectionItem label="Duration" value={durationLabel} />
        {Array.isArray(reservationDays) && reservationDays.length > 0 && (
          <SectionItem label="Reservation" value={reservationSummary(reservationDays)} />
        )}
        <SectionItem label="Adults" value={adultsSummary} />
        <SectionItem label="Children" value={childrenSummary} />
      </div>

      {/* Criteria */}
      <div className="mb-5 border-t pt-4 space-y-3">
        <SectionItem label="Search Criteria" value={criteria} />
        <div className="flex items-start gap-2">
          <span className="w-40 font-medium text-gray-600">Surf Level</span>
          <span className="text-sky-700 flex gap-2 items-center">
            <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded">{initials}</span>
            {levelLabel}
          </span>
        </div>
      </div>

      {/* Selected Packages */}
      <div className="mb-5 border-t pt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Selected Packages</h4>
        {Object.keys(selectedPackages).length === 0 ? (
          <p className="text-xs text-gray-400">No package selected yet.</p>
        ) : (
          <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
            {Object.entries(selectedPackages).map(([personKey, rec]) => (
              <li key={personKey}>
                <span className="font-semibold">{rec.people.join(", ")}</span>: {rec.pkg.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Not Selected */}
      <div className="mb-1 border-t pt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Not Selected</h4>
        {notSelected.length === 0 ? (
          <p className="text-xs text-green-600">All participants have selected a package.</p>
        ) : (
          <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
            {notSelected.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const SectionItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start">
    <span className="w-40 font-medium text-gray-600">{label}</span>
    <span className="text-sky-700">{value}</span>
  </div>
);

export default SidebarSummary;
