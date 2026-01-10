export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  surgeryType: string
  surgeryDate: string
  language: 'english' | 'hindi' | 'other'
  recoveryDay: number
  status: 'normal' | 'attention' | 'critical'
  contactNumber: string
  doctorId: string
  doctorName?: string
  roomNumber?: string
  bedNumber?: string
  admissionDate: string
  dischargeDate?: string
  nextAppointment?: string
  bloodGroup?: string
  allergies?: string[]
  comorbidities?: string[]
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DailyCheckIn {
  id: string
  patientId: string
  date: string
  painLevel: number // 1-10
  medicationCompliance: boolean
  exercisesCompleted: boolean
  symptoms: string[]
  temperature?: number
  bloodPressure?: string
  heartRate?: number
  oxygenSaturation?: number
  weight?: number
  mood?: 'good' | 'moderate' | 'poor'
  appetite?: 'good' | 'moderate' | 'poor'
  sleepQuality?: 'good' | 'moderate' | 'poor'
  notes?: string
}

export interface CarePlan {
  id: string
  patientId: string
  title: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  uploadedBy: string
  notes?: string
}

export interface Alert {
  id: string
  patientId: string
  patientName: string
  type: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
  resolved: boolean
  priority: 'low' | 'medium' | 'high'
  actionTaken?: string
  actionBy?: string
}

export interface RecoveryProgress {
  patientId: string
  overallProgress: number // 0-100
  milestones: {
    name: string
    completed: boolean
    targetDate: string
    actualDate?: string
  }[]
  recommendations: string[]
  challenges: string[]
}