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
