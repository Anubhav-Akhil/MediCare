import { Patient, Appointment, MedicalRecord, DashboardStats } from '@/types';

const PATIENTS_KEY = 'pms_patients';
const APPOINTMENTS_KEY = 'pms_appointments';
const RECORDS_KEY = 'pms_records';
const SEEDED_KEY = 'pms_seeded';

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function getItem<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Patients ─────────────────────────────────────────────────────────────────

export function getPatients(): Patient[] {
  return getItem<Patient>(PATIENTS_KEY);
}

export function getPatientById(id: string): Patient | undefined {
  return getPatients().find((p) => p.id === id);
}

export function savePatient(patient: Omit<Patient, 'id' | 'createdAt'>): Patient {
  const patients = getPatients();
  const newPatient: Patient = {
    ...patient,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  patients.push(newPatient);
  setItem(PATIENTS_KEY, patients);
  return newPatient;
}

export function updatePatient(id: string, data: Partial<Patient>): Patient | null {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return null;
  patients[index] = { ...patients[index], ...data };
  setItem(PATIENTS_KEY, patients);
  return patients[index];
}

export function deletePatient(id: string): boolean {
  const patients = getPatients();
  const filtered = patients.filter((p) => p.id !== id);
  if (filtered.length === patients.length) return false;
  setItem(PATIENTS_KEY, filtered);
  return true;
}

// ── Appointments ─────────────────────────────────────────────────────────────

export function getAppointments(): Appointment[] {
  return getItem<Appointment>(APPOINTMENTS_KEY);
}

export function getAppointmentById(id: string): Appointment | undefined {
  return getAppointments().find((a) => a.id === id);
}

export function saveAppointment(
  appointment: Omit<Appointment, 'id' | 'createdAt'>
): Appointment {
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  setItem(APPOINTMENTS_KEY, appointments);
  return newAppointment;
}

export function updateAppointment(
  id: string,
  data: Partial<Appointment>
): Appointment | null {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) return null;
  appointments[index] = { ...appointments[index], ...data };
  setItem(APPOINTMENTS_KEY, appointments);
  return appointments[index];
}

export function deleteAppointment(id: string): boolean {
  const appointments = getAppointments();
  const filtered = appointments.filter((a) => a.id !== id);
  if (filtered.length === appointments.length) return false;
  setItem(APPOINTMENTS_KEY, filtered);
  return true;
}

// ── Medical Records ──────────────────────────────────────────────────────────

export function getMedicalRecords(): MedicalRecord[] {
  return getItem<MedicalRecord>(RECORDS_KEY);
}

export function getMedicalRecordById(id: string): MedicalRecord | undefined {
  return getMedicalRecords().find((r) => r.id === id);
}

export function saveMedicalRecord(
  record: Omit<MedicalRecord, 'id' | 'createdAt'>
): MedicalRecord {
  const records = getMedicalRecords();
  const newRecord: MedicalRecord = {
    ...record,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  setItem(RECORDS_KEY, records);
  return newRecord;
}

export function updateMedicalRecord(
  id: string,
  data: Partial<MedicalRecord>
): MedicalRecord | null {
  const records = getMedicalRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;
  records[index] = { ...records[index], ...data };
  setItem(RECORDS_KEY, records);
  return records[index];
}

export function deleteMedicalRecord(id: string): boolean {
  const records = getMedicalRecords();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length === records.length) return false;
  setItem(RECORDS_KEY, filtered);
  return true;
}

// ── Dashboard Stats ──────────────────────────────────────────────────────────

export function getDashboardStats(): DashboardStats {
  const patients = getPatients();
  const appointments = getAppointments();
  const records = getMedicalRecords();
  const today = new Date().toISOString().split('T')[0];

  return {
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter((a) => a.date === today).length,
    pendingAppointments: appointments.filter((a) => a.status === 'Scheduled').length,
    totalRecords: records.length,
    completedAppointments: appointments.filter((a) => a.status === 'Completed').length,
  };
}

// ── Seed Data ────────────────────────────────────────────────────────────────

export function seedData(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(SEEDED_KEY)) return;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const patients: Patient[] = [
    {
      id: 'p1',
      firstName: 'Aarav',
      lastName: 'Sharma',
      age: 32,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'aarav.sharma@email.com',
      address: '12 MG Road, Bengaluru, Karnataka',
      bloodGroup: 'O+',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'p2',
      firstName: 'Priya',
      lastName: 'Patel',
      age: 28,
      gender: 'Female',
      phone: '+91 87654 32109',
      email: 'priya.patel@email.com',
      address: '45 Jubilee Hills, Hyderabad, Telangana',
      bloodGroup: 'A+',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'p3',
      firstName: 'Rohan',
      lastName: 'Gupta',
      age: 45,
      gender: 'Male',
      phone: '+91 76543 21098',
      email: 'rohan.gupta@email.com',
      address: '78 Connaught Place, New Delhi',
      bloodGroup: 'B+',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'p4',
      firstName: 'Ananya',
      lastName: 'Reddy',
      age: 35,
      gender: 'Female',
      phone: '+91 65432 10987',
      email: 'ananya.reddy@email.com',
      address: '23 Banjara Hills, Hyderabad, Telangana',
      bloodGroup: 'AB+',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'p5',
      firstName: 'Vikram',
      lastName: 'Singh',
      age: 52,
      gender: 'Male',
      phone: '+91 54321 09876',
      email: 'vikram.singh@email.com',
      address: '90 Sector 17, Chandigarh',
      bloodGroup: 'O-',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'p6',
      firstName: 'Meera',
      lastName: 'Nair',
      age: 41,
      gender: 'Female',
      phone: '+91 43210 98765',
      email: 'meera.nair@email.com',
      address: '56 Marine Drive, Mumbai, Maharashtra',
      bloodGroup: 'A-',
      createdAt: new Date().toISOString(),
    },
  ];

  const appointments: Appointment[] = [
    {
      id: 'a1',
      patientId: 'p1',
      patientName: 'Aarav Sharma',
      doctor: 'Dr. Rajesh Kumar',
      department: 'Cardiology',
      date: today,
      time: '10:00',
      status: 'Scheduled',
      notes: 'Routine cardiac checkup',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'a2',
      patientId: 'p2',
      patientName: 'Priya Patel',
      doctor: 'Dr. Sunita Verma',
      department: 'Dermatology',
      date: today,
      time: '11:30',
      status: 'Scheduled',
      notes: 'Skin allergy follow-up',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'a3',
      patientId: 'p3',
      patientName: 'Rohan Gupta',
      doctor: 'Dr. Amit Mehta',
      department: 'Orthopedics',
      date: yesterday,
      time: '09:00',
      status: 'Completed',
      notes: 'Knee pain assessment',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'a4',
      patientId: 'p4',
      patientName: 'Ananya Reddy',
      doctor: 'Dr. Priya Deshmukh',
      department: 'Gynecology',
      date: today,
      time: '14:00',
      status: 'Scheduled',
      notes: 'Prenatal checkup',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'a5',
      patientId: 'p5',
      patientName: 'Vikram Singh',
      doctor: 'Dr. Rajesh Kumar',
      department: 'Cardiology',
      date: yesterday,
      time: '15:30',
      status: 'Completed',
      notes: 'ECG and blood pressure monitoring',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'a6',
      patientId: 'p6',
      patientName: 'Meera Nair',
      doctor: 'Dr. Sunita Verma',
      department: 'Dermatology',
      date: yesterday,
      time: '16:00',
      status: 'Cancelled',
      notes: 'Rescheduled by patient',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const records: MedicalRecord[] = [
    {
      id: 'r1',
      patientId: 'p1',
      patientName: 'Aarav Sharma',
      diagnosis: 'Mild Hypertension',
      prescription: 'Amlodipine 5mg once daily, low sodium diet recommended',
      doctor: 'Dr. Rajesh Kumar',
      date: yesterday,
      notes: 'Blood pressure 140/90. Advised lifestyle changes and follow-up in 2 weeks.',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'r2',
      patientId: 'p2',
      patientName: 'Priya Patel',
      diagnosis: 'Contact Dermatitis',
      prescription: 'Hydrocortisone cream 1%, Cetirizine 10mg',
      doctor: 'Dr. Sunita Verma',
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      notes: 'Allergic reaction to new skincare product. Patch test scheduled.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'r3',
      patientId: 'p3',
      patientName: 'Rohan Gupta',
      diagnosis: 'Osteoarthritis - Right Knee',
      prescription: 'Diclofenac 50mg twice daily, Physiotherapy 3x/week',
      doctor: 'Dr. Amit Mehta',
      date: yesterday,
      notes: 'X-ray shows mild degenerative changes. MRI recommended if pain persists.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'r4',
      patientId: 'p5',
      patientName: 'Vikram Singh',
      diagnosis: 'Type 2 Diabetes Mellitus',
      prescription: 'Metformin 500mg twice daily, Glimepiride 1mg once daily',
      doctor: 'Dr. Rajesh Kumar',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      notes: 'HbA1c 7.8%. Advised strict diet control and regular exercise.',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  ];

  setItem(PATIENTS_KEY, patients);
  setItem(APPOINTMENTS_KEY, appointments);
  setItem(RECORDS_KEY, records);
  localStorage.setItem(SEEDED_KEY, 'true');
}
