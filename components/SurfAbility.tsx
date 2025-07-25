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
        <SelectTrigger className="w-24 min-w-[6rem]"><SelectValue /></SelectTrigger>
        <SelectContent className="w-24 min-w-[6rem]">
          <SelectItem value="Good">Good</SelectItem>
          <SelectItem value="Average">Average</SelectItem>
          <SelectItem value="Poor">Poor</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
      {/* SURF ABILITY */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="font-bold text-lg">SURF ABILITY</span>
          <span className="ml-2 text-sm">(Choose one : GOOD / AVERAGE / POOR)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>Stamina</span>
              <AbilitySelect value={surfAbility.stamina} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, stamina: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Paddling</span>
              <AbilitySelect value={surfAbility.paddling} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, paddling: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Position on the board</span>
              <AbilitySelect value={surfAbility.position} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, position: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>How to stand up on the board</span>
              <AbilitySelect value={surfAbility.standUp} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, standUp: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Balancing</span>
              <AbilitySelect value={surfAbility.balancing} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, balancing: v}))} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>Safe surf awareness</span>
              <AbilitySelect value={surfAbility.safeAwareness} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, safeAwareness: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Control the board</span>
              <AbilitySelect value={surfAbility.controlBoard} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, controlBoard: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Paddle out</span>
              <AbilitySelect value={surfAbility.paddleOut} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, paddleOut: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Eskimo / duck dive technique</span>
              <AbilitySelect value={surfAbility.eskimo} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, eskimo: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>How to catch the wave</span>
              <AbilitySelect value={surfAbility.catchWave} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, catchWave: v}))} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>Take off position</span>
              <AbilitySelect value={surfAbility.takeOff} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, takeOff: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>How to pick up speed</span>
              <AbilitySelect value={surfAbility.pickUpSpeed} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, pickUpSpeed: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Riding the blue wave</span>
              <AbilitySelect value={surfAbility.blueWave} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, blueWave: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Selecting & catching the wave</span>
              <AbilitySelect value={surfAbility.selectWave} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, selectWave: v}))} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Surf etiquette</span>
              <AbilitySelect value={surfAbility.etiquette} onChange={v => setSurfAbility((a: SurfAbilityState) => ({...a, etiquette: v}))} />
            </div>
          </div>
        </div>
      </div>

      {/* SURFING EXPERIENCES */}
      <div>
        <div className="font-bold text-lg mb-2">SURFING EXPERIENCES <span className="font-normal text-base">(Frequently)</span></div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
          <div className="col-span-1">
            <Input placeholder="Year" value={surfExperience.year} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, year: e.target.value}))} />
            {errors.year && <div className="text-red-500 text-xs mt-1">{errors.year}</div>}
          </div>
          <div className="col-span-1">
            <Input placeholder="Months" value={surfExperience.months} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, months: e.target.value}))} />
            {errors.months && <div className="text-red-500 text-xs mt-1">{errors.months}</div>}
          </div>
          <div className="col-span-1">
            <Input placeholder="Weeks" value={surfExperience.weeks} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, weeks: e.target.value}))} />
            {errors.weeks && <div className="text-red-500 text-xs mt-1">{errors.weeks}</div>}
          </div>
          <div className="col-span-2">
            <Input placeholder="Locations" value={surfExperience.locations} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, locations: e.target.value}))} />
            {errors.locations && <div className="text-red-500 text-xs mt-1">{errors.locations}</div>}
          </div>
          <div className="col-span-1">
            <Input placeholder="Board's size" value={surfExperience.boardSize} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, boardSize: e.target.value}))} />
            {errors.boardSize && <div className="text-red-500 text-xs mt-1">{errors.boardSize}</div>}
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span>Style / Stance (Frequently)</span>
          <label className="flex items-center gap-1">
            <input type="radio" name="stance" checked={surfExperience.stance === 'Regular'} onChange={() => setSurfExperience((f: SurfExperienceState) => ({...f, stance: 'Regular'}))} /> Regular
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="stance" checked={surfExperience.stance === 'Goofy'} onChange={() => setSurfExperience((f: SurfExperienceState) => ({...f, stance: 'Goofy'}))} /> Goofy
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="stance" checked={surfExperience.stance === 'Others'} onChange={() => setSurfExperience((f: SurfExperienceState) => ({...f, stance: 'Others'}))} /> Others
            <Input className="ml-2 w-32" placeholder="Others" value={surfExperience.stanceOther} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, stanceOther: e.target.value}))} disabled={surfExperience.stance !== 'Others'} />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm">Size of the waves (Please describe)</label>
          <Input value={surfExperience.waveSize} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, waveSize: e.target.value}))} />
          {errors.waveSize && <div className="text-red-500 text-xs mt-1">{errors.waveSize}</div>}
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">Other sports that you have done before (Please list)</label>
            <Input value={surfExperience.otherSports[0]} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, otherSports: [e.target.value, f.otherSports[1]]}))} />
          </div>
          <div>
            <label className="block text-sm">&nbsp;</label>
            <Input value={surfExperience.otherSports[1]} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, otherSports: [f.otherSports[0], e.target.value]}))} />
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm">Describe the last time you surfed</label>
          <Input value={surfExperience.lastSurf} onChange={e => setSurfExperience((f: SurfExperienceState) => ({...f, lastSurf: e.target.value}))} />
          {errors.lastSurf && <div className="text-red-500 text-xs mt-1">{errors.lastSurf}</div>}
        </div>
      </div>
    </div>
  )
}
