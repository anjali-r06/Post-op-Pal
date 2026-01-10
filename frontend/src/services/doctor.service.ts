
import type { Patient, DailyCheckIn, CarePlan } from '../types/patient.types'

export interface DoctorSchedule {
  id: string
  date: string
  time: string
  patientId: string
  patientName: string
  type: 'consultation' | 'follow-up' | 'surgery' | 'emergency'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  duration: number // in minutes
  notes?: string
  location?: string
}

export interface DoctorStats {
  totalPatients: number
  activePatients: number
  appointmentsToday: number
  pendingMessages: number
  patientSatisfaction: number
  avgRecoveryTime: number
}

export const doctorService = {
  // Get doctor's statistics
  async getStats(): Promise<DoctorStats> {
    // Mock implementation
    return {
      totalPatients: 24,
      activePatients: 18,
      appointmentsToday: 8,
      pendingMessages: 12,
      patientSatisfaction: 92,
      avgRecoveryTime: 28, // days
    }
  },

  // Get doctor's patients
  async getMyPatients(): Promise<Patient[]> {
    // In production: const response = await api.get('/doctor/patients')
    // return response.data

    // Mock implementation
    const patients: Patient[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        age: 45,
        gender: 'male' as const,
        surgeryType: 'Knee Replacement',
        surgeryDate: '2024-01-15',
        language: 'hindi' as const,
        recoveryDay: 7,
        status: 'normal',
        contactNumber: '+91 9876543210',
        doctorId: 'doc1',
        doctorName: 'Dr. Sharma',
        roomNumber: '101',
        admissionDate: '2024-01-14',
        dischargeDate: '2024-01-16',
        nextAppointment: '2024-01-25',
        bloodGroup: 'O+',
        allergies: ['Penicillin'],
        comorbidities: ['Hypertension'],
        emergencyContact: {
          name: 'Sunita Kumar',
          relationship: 'Wife',
          phone: '+91 9876543219',
        },
        notes: 'Patient is recovering well. No complications reported.',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-20',
      },
      {
        id: '2',
        name: 'Priya Sharma',
        age: 38,
        gender: 'female' as const,
        surgeryType: 'Cataract Surgery',
        surgeryDate: '2024-01-18',
        language: 'english' as const,
        recoveryDay: 4,
        status: 'attention',
        contactNumber: '+91 9876543211',
        doctorId: 'doc1',
        doctorName: 'Dr. Sharma',
        roomNumber: '102',
        admissionDate: '2024-01-17',
        dischargeDate: '2024-01-19',
        nextAppointment: '2024-01-24',
        bloodGroup: 'A+',
        allergies: ['Sulfa'],
        emergencyContact: {
          name: 'Rahul Sharma',
          relationship: 'Husband',
          phone: '+91 9876543218',
        },
        notes: 'Experiencing mild discomfort. Monitoring required.',
        createdAt: '2024-01-17',
        updatedAt: '2024-01-20',
      },
    ]
    return patients
  },

  // Get doctor's schedule
  async getSchedule(date?: string): Promise<DoctorSchedule[]> {
    const schedule: DoctorSchedule[] = [
      {
        id: '1',
        date: '2024-01-20',
        time: '09:00',
        patientId: '1',
        patientName: 'Rajesh Kumar',
        type: 'follow-up',
        status: 'scheduled',
        duration: 30,
        notes: 'Post-op knee replacement check',
        location: 'Room 101',
      },
      {
        id: '2',
        date: '2024-01-20',
        time: '10:30',
        patientId: '2',
        patientName: 'Priya Sharma',
        type: 'follow-up',
        status: 'scheduled',
        duration: 20,
        notes: 'Cataract surgery follow-up',
        location: 'Room 102',
      },
      {
        id: '3',
        date: '2024-01-20',
        time: '14:00',
        patientId: '3',
        patientName: 'Amit Patel',
        type: 'consultation',
        status: 'scheduled',
        duration: 45,
        notes: 'Pre-op consultation for hip replacement',
        location: 'Consultation Room 3',
      },
      {
        id: '4',
        date: '2024-01-20',
        time: '16:15',
        patientId: '4',
        patientName: 'Suresh Verma',
        type: 'emergency',
        status: 'scheduled',
        duration: 60,
        notes: 'Emergency follow-up - fever spike',
        location: 'Emergency Room',
      },
    ]

    if (date) {
      return schedule.filter(appointment => appointment.date === date)
    }

    return schedule
  },

  // Send message to patient
  async sendMessage(patientId: string, message: string): Promise<void> {
    console.log(`Sending message to patient ${patientId}: ${message}`)
    // In production: await api.post(`/doctor/patients/${patientId}/message`, { message })
  },

  // Update patient care plan
  async updateCarePlan(patientId: string, carePlan: Partial<CarePlan>): Promise<CarePlan> {
    console.log(`Updating care plan for patient ${patientId}`, carePlan)
    // In production: const response = await api.put(`/doctor/patients/${patientId}/care-plan`, carePlan)
    // return response.data

    return {
      id: 'cp1',
      patientId,
      title: carePlan.title || 'Updated Recovery Plan',
      fileName: carePlan.fileName || 'recovery-plan.pdf',
      fileUrl: carePlan.fileUrl || '#',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'doctor',
      notes: carePlan.notes,
    }
  },

  // Get patient daily check-ins
  async getPatientCheckIns(patientId: string): Promise<DailyCheckIn[]> {
    const checkIns: DailyCheckIn[] = [
      {
        id: '1',
        patientId,
        date: '2024-01-20',
        painLevel: 3,
        medicationCompliance: true,
        exercisesCompleted: true,
        symptoms: ['mild swelling', 'stiffness'],
        temperature: 98.6,
        bloodPressure: '120/80',
        heartRate: 72,
        oxygenSaturation: 98,
        weight: 75,
        mood: 'good',
        appetite: 'good',
        sleepQuality: 'good',
        notes: 'Patient is responding well to physical therapy. No complications reported.',
      },
      {
        id: '2',
        patientId,
        date: '2024-01-19',
        painLevel: 4,
        medicationCompliance: true,
        exercisesCompleted: false,
        symptoms: ['swelling', 'pain'],
        temperature: 99.1,
        bloodPressure: '125/82',
        heartRate: 75,
        oxygenSaturation: 97,
        weight: 75.5,
        mood: 'moderate',
        appetite: 'moderate',
        sleepQuality: 'moderate',
        notes: 'Missed exercises due to discomfort. Pain managed with medication.',
      },
      {
        id: '3',
        patientId,
        date: '2024-01-18',
        painLevel: 5,
        medicationCompliance: true,
        exercisesCompleted: true,
        symptoms: ['pain', 'fatigue'],
        temperature: 98.8,
        bloodPressure: '118/78',
        heartRate: 70,
        oxygenSaturation: 98,
        weight: 76,
        mood: 'moderate',
        appetite: 'good',
        sleepQuality: 'poor',
        notes: 'Experiencing pain during exercises but completing them as instructed.',
      },
    ]

    return checkIns
  },

  // Add note to patient record
  async addPatientNote(patientId: string, note: string): Promise<void> {
    console.log(`Adding note for patient ${patientId}: ${note}`)
    // In production: await api.post(`/doctor/patients/${patientId}/notes`, { note })
  },

  // Update patient status
  async updatePatientStatus(patientId: string, status: Patient['status']): Promise<void> {
    console.log(`Updating patient ${patientId} status to ${status}`)
    // In production: await api.patch(`/doctor/patients/${patientId}/status`, { status })
  },

  // Schedule appointment
  async scheduleAppointment(appointment: Omit<DoctorSchedule, 'id' | 'status'>): Promise<DoctorSchedule> {
    console.log('Scheduling appointment:', appointment)
    // In production: const response = await api.post('/doctor/schedule', appointment)
    // return response.data

    return {
      id: 'new-1',
      ...appointment,
      status: 'scheduled',
    }
  },

  // Get today's appointments
  async getTodaysAppointments(): Promise<DoctorSchedule[]> {
    const today = new Date().toISOString().split('T')[0]
    const schedule = await this.getSchedule(today)
    return schedule
  },

  // Mark appointment as completed
  async completeAppointment(appointmentId: string, notes?: string): Promise<void> {
    console.log(`Completing appointment ${appointmentId}`, notes)
    // In production: await api.patch(`/doctor/appointments/${appointmentId}/complete`, { notes })
  },
}