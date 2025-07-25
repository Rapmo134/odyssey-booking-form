// Master Data Types
export interface Agent {
  code: string;
  name: string;
  email: string;
  phone: string;
  bank_no: string;
  payment: string;
  type: string;
  website: string;
  pic_name: string;
  pic_email: string;
  pic_phone: string;
  pic_position: string;
  fin_name: string;
  fin_email: string;
  fin_phone: string;
}

export interface Member {
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  hobby: string;
  active: string;
  created_at: string;
}

export interface Package {
  code: string;
  type: string;
  name: string;
  level: string;
  person: number;
  age: string;
  active: string;
  active_from: string;
  active_to: string;
  desc_short: string;
  desc_long: string;
  price: string;
}

export interface Bank {
  code: string;
  name: string;
}

export interface Schedule {
  date: string;
  time1: string;
  time2: string;
}

export interface MasterData {
  booking_number: string;
  agents: Agent[];
  members: Member[];
  packages: Package[];
  banks: Bank[];
  schedules: Schedule[];
}

export interface MasterDataResponse {
  success: boolean;
  data: MasterData;
  message: string;
} 