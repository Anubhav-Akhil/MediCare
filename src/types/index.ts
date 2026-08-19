export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  prescription: string;
  doctor: string;
  date: string;
  notes: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  totalRecords: number;
  completedAppointments: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Doctor' | 'Admin' | 'Staff' | 'Nurse';
  clinicName?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  clinicName?: string;
  role?: 'Doctor' | 'Admin' | 'Staff' | 'Nurse';
  department?: string;
}

