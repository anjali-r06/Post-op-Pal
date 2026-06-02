export interface Doctor {
  id: string
  name: string
  email: string
  specialization: string
  department: string
  experience: number // years
  qualifications: string[]
  licenseNumber: string
  contactNumber: string
  availability: {
    days: string[] // ['monday', 'tuesday', etc.]
    hours: {
      start: string // '09:00'
      end: string   // '17:00'
    }
  }
  currentPatientLoad: number
  maxPatientCapacity: number
  rating?: number
  languages: string[]
  status: 'available' | 'busy' | 'on_leave'
  avatar?: string
  bio?: string
}