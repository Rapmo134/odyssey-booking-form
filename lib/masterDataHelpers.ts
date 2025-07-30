import { MasterData, Package, Agent, Member, Bank, Schedule } from './masterDataTypes';

// Master Data Store
let masterDataStore: MasterData | null = null;

// Setter untuk master data
export const setMasterData = (data: MasterData) => {
  masterDataStore = data;
  
  // Console log untuk debugging
  console.log('masterDataHelpers - setMasterData called with:', data);
  console.log('masterDataHelpers - packages count:', data.packages?.length || 0);
  console.log('masterDataHelpers - agents count:', data.agents?.length || 0);
};

// Getter untuk master data
export const getMasterData = (): MasterData | null => {
  return masterDataStore;
};

// Helper functions untuk mengakses data spesifik
export const getPackages = (): Package[] => {
  return masterDataStore?.packages || [];
};

export const getAgents = (): Agent[] => {
  return masterDataStore?.agents || [];
};

export const getMembers = (): Member[] => {
  return masterDataStore?.members || [];
};

export const getBanks = (): Bank[] => {
  return masterDataStore?.banks || [];
};

export const getSchedules = (): Schedule[] => {
  return masterDataStore?.schedules || [];
};

export const getBookingNumber = (): string => {
  return masterDataStore?.booking_number || '';
};

// Helper: Filter recommended packages for a person based on criteria
export interface PersonCriteria {
  level: 'A' | 'I' | 'B';
  age: 'A' | 'Ad' | 'Ch2';
  type: 'L' | 'ST' | Array<'L' | 'ST'>;
  bookingDate?: string; // format: YYYY-MM-DD
  personCount?: number;
}

export const getRecommendedPackagesForPerson = (criteria: PersonCriteria) => {
  const packages = getPackages();

  // Console log untuk debugging
  console.log('masterDataHelpers - getRecommendedPackagesForPerson called with criteria:', criteria);
  console.log('masterDataHelpers - total packages available:', packages.length);

  const filteredPackages = packages.filter(pkg => {
    if (pkg.active !== 'Y') return false;

    // Type check (supports single or array)
    if (criteria.type) {
      const allowedTypes: Array<'L' | 'ST'> = Array.isArray(criteria.type) ? criteria.type : [criteria.type];
      if (!allowedTypes.includes(pkg.type as 'L' | 'ST')) return false;
    }

    // Level check
    const levelPass = !criteria.level || pkg.level === criteria.level;
    if (!levelPass) return false;

    // Age check
    const agePass = !criteria.age || pkg.age === 'A' || pkg.age === criteria.age;
    if (!agePass) return false;

    // Person count check (minimal)
    if (criteria.personCount && pkg.person < criteria.personCount) return false;

    // Booking date check
    if (criteria.bookingDate) {
      const from = new Date(pkg.active_from);
      const to = new Date(pkg.active_to);
      const booking = new Date(criteria.bookingDate);
      if (booking < from || booking > to) return false;
    }

    return true;
  });

  console.log('masterDataHelpers - filtered packages count:', filteredPackages.length);
  console.log('masterDataHelpers - filtered packages:', filteredPackages);

  return filteredPackages;
};


// Helper untuk konversi package dari API ke format yang dibutuhkan UI
export const convertPackageToUIFormat = (pkg: Package) => {
  // Console log untuk debugging
  console.log('masterDataHelpers - convertPackageToUIFormat called with:', pkg);
  
  const converted = {
    // Basic info
    id: parseInt(pkg.code.replace('PKG', '')),
    code: pkg.code,
    name: pkg.name,
    type: pkg.type,
    
    // Descriptions
    desc_short: pkg.desc_short,
    desc_long: pkg.desc_long,
    
    // Package details
    level: pkg.level,
    person: pkg.person,
    age: pkg.age,
    active: pkg.active,
    active_from: pkg.active_from,
    active_to: pkg.active_to,
    
    // Price
    price: parseFloat(pkg.price),
    
    // UI formatting (for backward compatibility)
    title: pkg.name,
    description: pkg.desc_long,
    category: pkg.type === 'L' ? 'Lesson' : pkg.type === 'ST' ? 'Surf Tour' : 'Package',
    categoryBadges: [pkg.type === 'L' ? 'LESSON' : pkg.type === 'ST' ? 'TOUR' : 'PACKAGE'],
    badgeColor: pkg.type === 'L' ? 'bg-blue-500' : pkg.type === 'ST' ? 'bg-orange-400' : 'bg-green-500',
    image: "https://images.pexels.com/photos/1654502/pexels-photo-1654502.jpeg", // Default image
    reviews: 50, // Default value
    rating: 5, // Default value
    duration: "2.5 Hours", // Default value
    maxStudents: pkg.person,
    level_display: pkg.level === 'B' ? 'Beginner' : pkg.level === 'I' ? 'Intermediate' : 'Advanced',
    includes: ["Equipment", "Insurance", "Photos"], // Default includes
  };

  console.log('masterDataHelpers - converted package:', converted);
  return converted;
};

// Helper untuk mendapatkan packages yang sudah dikonversi
export const getConvertedPackages = () => {
  const packages = getPackages();
  return packages.map(convertPackageToUIFormat);
};

// Helper untuk mendapatkan agent berdasarkan code
export const getAgentByCode = (code: string): Agent | undefined => {
  return getAgents().find(agent => agent.code === code);
};

// Helper untuk mendapatkan member berdasarkan code
export const getMemberByCode = (code: string): Member | undefined => {
  return getMembers().find(member => member.code === code);
};

// Helper untuk mendapatkan bank berdasarkan code
export const getBankByCode = (code: string): Bank | undefined => {
  return getBanks().find(bank => bank.code === code);
}; 