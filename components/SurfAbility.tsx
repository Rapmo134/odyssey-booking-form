import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface SurfAbilityState {
  stamina: string;
  paddling: string;
  position: string;
  standUp: string;
  balancing: string;
  safeAwareness: string;
  controlBoard: string;
  paddleOut: string;
  eskimo: string;
  catchWave: string;
  takeOff: string;
  pickUpSpeed: string;
  blueWave: string;
  selectWave: string;
  etiquette: string;
}

interface SurfExperienceState {
  year: string;
  months: string;
  weeks: string;
  locations: string;
  boardSize: string;
  stance: string;
  stanceOther: string;
  waveSize: string;
  otherSports: string[];
  lastSurf: string;
}

interface SurfAbilityProps {
  surfAbility: SurfAbilityState;
  setSurfAbility: (ability: SurfAbilityState | ((prev: SurfAbilityState) => SurfAbilityState)) => void;
  surfExperience: SurfExperienceState;
  setSurfExperience: (experience: SurfExperienceState | ((prev: SurfExperienceState) => SurfExperienceState)) => void;
  errors: any;
}

export default function SurfAbility({ surfAbility, setSurfAbility, surfExperience, setSurfExperience, errors }: SurfAbilityProps) {
  // Komponen reusable untuk dropdown skill
  function AbilitySelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-20 sm:w-24 min-w-[5rem] sm:min-w-[6rem] text-xs sm:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-20 sm:w-24 min-w-[5rem] sm:min-w-[6rem]">
          <SelectItem value="Good">Good</SelectItem>
          <SelectItem value="Average">Average</SelectItem>
          <SelectItem value="Poor">Poor</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // Mapping untuk Surf Ability items
  const surfAbilityItems = [
    // Column 1
    [
      { key: 'stamina', label: 'Stamina' },
      { key: 'paddling', label: 'Paddling' },
      { key: 'position', label: 'Position on the board' },
      { key: 'standUp', label: 'How to stand up on the board' },
      { key: 'balancing', label: 'Balancing' }
    ],
    // Column 2
    [
      { key: 'safeAwareness', label: 'Safe surf awareness' },
      { key: 'controlBoard', label: 'Control the board' },
      { key: 'paddleOut', label: 'Paddle out' },
      { key: 'eskimo', label: 'Eskimo / duck dive technique' },
      { key: 'catchWave', label: 'How to catch the wave' }
    ],
    // Column 3
    [
      { key: 'takeOff', label: 'Take off position' },
      { key: 'pickUpSpeed', label: 'How to pick up speed' },
      { key: 'blueWave', label: 'Riding the blue wave' },
      { key: 'selectWave', label: 'Selecting & catching the wave' },
      { key: 'etiquette', label: 'Surf etiquette' }
    ]
  ];

  // Mapping untuk Experience fields
  const experienceFields = [
    { key: 'year', placeholder: 'Year', colSpan: 'sm:col-span-1' },
    { key: 'months', placeholder: 'Months', colSpan: 'sm:col-span-1' },
    { key: 'weeks', placeholder: 'Weeks', colSpan: 'sm:col-span-1' },
    { key: 'locations', placeholder: 'Locations', colSpan: 'sm:col-span-2' },
    { key: 'boardSize', placeholder: "Board's size", colSpan: 'sm:col-span-1' }
  ];

  // Mapping untuk Stance options
  const stanceOptions = [
    { value: 'Regular', label: 'Regular' },
    { value: 'Goofy', label: 'Goofy' },
    { value: 'Others', label: 'Others' }
  ];

  return (
    <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
      {/* SURF ABILITY */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
          <span className="font-bold text-base sm:text-lg">SURF ABILITY</span>
          <span className="text-xs sm:text-sm text-gray-600">(Choose one : GOOD / AVERAGE / POOR)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {surfAbilityItems.map((column, columnIndex) => (
            <div key={columnIndex} className={`space-y-3 ${columnIndex === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              {column.map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs sm:text-sm">{item.label}</span>
                  <AbilitySelect 
                    value={surfAbility[item.key as keyof SurfAbilityState] as string} 
                    onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, [item.key]: v}))} 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SURFING EXPERIENCES */}
      <div>
        <div className="font-bold text-base sm:text-lg mb-4">
          SURFING EXPERIENCES 
          <span className="font-normal text-sm sm:text-base ml-2">(Frequently)</span>
        </div>
        
        {/* Experience Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
          {experienceFields.map((field) => (
            <div key={field.key} className={field.colSpan}>
              <Input 
                placeholder={field.placeholder} 
                value={surfExperience[field.key as keyof SurfExperienceState] as string} 
                onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, [field.key]: e.target.value}))} 
                className="text-sm"
              />
              {errors[field.key] && <div className="text-red-500 text-xs mt-1">{errors[field.key]}</div>}
            </div>
          ))}
        </div>

        {/* Stance Selection - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <span className="text-sm sm:text-base font-medium">Style / Stance (Frequently)</span>
          <div className="flex flex-col sm:flex-row gap-3">
            {stanceOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm">
                <input 
                  type="radio" 
                  name="stance" 
                  checked={surfExperience.stance === option.value} 
                  onChange={() => setSurfExperience((f: SurfExperienceState) => ({...f, stance: option.value}))} 
                /> 
                {option.label}
                {option.value === 'Others' && (
                  <Input 
                    className="ml-2 w-24 sm:w-32 text-sm" 
                    placeholder="Others" 
                    value={surfExperience.stanceOther} 
                    onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, stanceOther: e.target.value}))} 
                    disabled={surfExperience.stance !== 'Others'} 
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Wave Size */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Size of the waves (Please describe)</label>
          <Input 
            value={surfExperience.waveSize} 
            onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, waveSize: e.target.value}))} 
            className="text-sm"
          />
          {errors.waveSize && <div className="text-red-500 text-xs mt-1">{errors.waveSize}</div>}
        </div>

        {/* Other Sports */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1].map((index) => (
            <div key={index}>
              <label className="block text-sm mb-2">
                {index === 0 ? "Other sports that you have done before (Please list)" : "\u00A0"}
              </label>
              <Input 
                value={surfExperience.otherSports[index]} 
                onChange={e => setSurfExperience((f: SurfExperienceState) => {
                  const newOtherSports = [...f.otherSports];
                  newOtherSports[index] = e.target.value;
                  return {...f, otherSports: newOtherSports};
                })} 
                className="text-sm"
              />
            </div>
          ))}
        </div>

        {/* Last Surf */}
        <div className="mb-2">
          <label className="block text-sm mb-2">Describe the last time you surfed</label>
          <Input 
            value={surfExperience.lastSurf} 
            onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, lastSurf: e.target.value}))} 
            className="text-sm"
          />
          {errors.lastSurf && <div className="text-red-500 text-xs mt-1">{errors.lastSurf}</div>}
        </div>
      </div>
    </div>
  )
}
