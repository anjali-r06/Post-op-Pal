export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertCategory = 'pain' | 'fever' | 'bleeding' | 'infection' | 'breathing' | 'other'
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'escalated'

export interface EmergencyAlert {
  id: string
  patientId: string
  patientName: string
  category: AlertCategory
  severity: AlertSeverity
  title: string
  description: string
  status: AlertStatus
  createdAt: string
  acknowledgedAt?: string
  resolvedAt?: string
  acknowledgedBy?: string // doctor/staff ID
  notes?: string
  vitals?: {
    temperature?: number
    heartRate?: number
    bloodPressure?: string
    oxygenSaturation?: number
    painLevel?: number
  }
  location?: string // bed/room number
  roomNumber?: string
}

export interface AlertResponse {
  id: string
  alertId: string
  respondedBy: string // doctor/staff name
  respondedAt: string
  action: string
  notes: string
}
