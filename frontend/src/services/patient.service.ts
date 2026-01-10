import type { Patient, DailyCheckIn, CarePlan } from '../types/patient.types'

export const patientService = {
  // Get all patients
  async getAll(): Promise<Patient[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const patients: Patient[] = [
          {
            id: '1',
            name: 'Rajesh Kumar',
            age: 45,
            gender: 'male',
            surgeryType: 'Knee Replacement',
            surgeryDate: '2024-01-15',
            language: 'hindi',
            recoveryDay: 7,
            status: 'normal',
            contactNumber: '+91 9876543210',
            doctorId: 'doc1',
            doctorName: 'Dr. Sharma',
            roomNumber: '101',
            admissionDate: '2024-01-14',
            dischargeDate: '2024-01-16',
            notes: 'Patient is recovering well. No complications.',
            createdAt: '2024-01-14T10:00:00Z', // Added
            updatedAt: '2024-01-20T15:30:00Z', // Added
          },
          {
            id: '2',
            name: 'Priya Sharma',
            age: 38,
            gender: 'female',
            surgeryType: 'Cataract Surgery',
            surgeryDate: '2024-01-18',
            language: 'english',
            recoveryDay: 4,
            status: 'attention',
            contactNumber: '+91 9876543211',
            doctorId: 'doc1',
            doctorName: 'Dr. Sharma',
            roomNumber: '102',
            admissionDate: '2024-01-17',
            dischargeDate: '2024-01-19',
            notes: 'Experiencing mild discomfort. Monitoring required.',
            createdAt: '2024-01-17T11:30:00Z', // Added
            updatedAt: '2024-01-19T09:15:00Z', // Added
          },
          {
            id: '3',
            name: 'Amit Patel',
            age: 52,
            gender: 'male',
            surgeryType: 'Hip Replacement',
            surgeryDate: '2024-01-10',
            language: 'hindi',
            recoveryDay: 12,
            status: 'critical',
            contactNumber: '+91 9876543212',
            doctorId: 'doc2',
            doctorName: 'Dr. Verma',
            roomNumber: '103',
            admissionDate: '2024-01-09',
            dischargeDate: '2024-01-12',
            notes: 'Red flag: High fever reported. Immediate attention needed.',
            createdAt: '2024-01-09T14:20:00Z', // Added
            updatedAt: '2024-01-20T22:45:00Z', // Added
          },
        ]
        resolve(patients)
      }, 800)
    })
  },

  // Get patient by ID
  async getById(id: string): Promise<Patient> {
    const patients = await this.getAll()
    const patient = patients.find(p => p.id === id)
    if (!patient) throw new Error('Patient not found')
    return patient
  },

  // Get daily check-ins for a patient
  async getCheckIns(patientId: string): Promise<DailyCheckIn[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
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
            notes: 'Patient is responding well to physical therapy.',
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
            notes: 'Missed exercises due to discomfort.',
          },
        ]
        resolve(checkIns)
      }, 600)
    })
  },

  // Update patient status
  async updateStatus(patientId: string, status: Patient['status']): Promise<void> {
    console.log(`Updating patient ${patientId} status to ${status}`)
    // In production: await api.patch(`/patients/${patientId}/status`, { status })
  },

  // Upload care plan
  async uploadCarePlan(data: {
    patientId: string
    file: File
    title: string
    notes?: string
  }): Promise<CarePlan> {
    const formData = new FormData()
    formData.append('patientId', data.patientId)
    formData.append('file', data.file)
    formData.append('title', data.title)
    if (data.notes) formData.append('notes', data.notes)

    // In production:
    // const response = await api.post('/care-plans/upload', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // })
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'cp1',
          patientId: data.patientId,
          title: data.title,
          fileName: data.file.name,
          fileUrl: URL.createObjectURL(data.file),
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'system',
          notes: data.notes,
        })
      }, 1500)
    })
  },

  // Get patient alerts
  async getAlerts(patientId?: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const alerts = [
          {
            id: '1',
            patientId: '3',
            patientName: 'Amit Patel',
            type: 'critical',
            message: 'High fever (39°C) reported with severe pain',
            timestamp: '2024-01-20T10:30:00',
            resolved: false,
            priority: 'high',
          },
          {
            id: '2',
            patientId: '2',
            patientName: 'Priya Sharma',
            type: 'warning',
            message: 'Missed medication for 2 consecutive days',
            timestamp: '2024-01-20T09:15:00',
            resolved: false,
            priority: 'medium',
          },
        ]
        
        if (patientId) {
          resolve(alerts.filter(alert => alert.patientId === patientId))
        } else {
          resolve(alerts)
        }
      }, 500)
    })
  },
}