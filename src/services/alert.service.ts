import type { EmergencyAlert, AlertResponse } from '../types/alert.types'

export const alertService = {
  // Create emergency alert
  async createAlert(alert: Omit<EmergencyAlert, 'id' | 'createdAt' | 'status'>): Promise<EmergencyAlert> {
    console.log('Creating emergency alert:', alert)
    // In production: const response = await api.post('/alerts', alert)
    // return response.data

    return {
      id: `alert-${Date.now()}`,
      ...alert,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  },

  // Get patient alerts
  async getPatientAlerts(patientId: string): Promise<EmergencyAlert[]> {
    console.log(`Fetching alerts for patient ${patientId}`)
    // Mock data
    return [
      {
        id: 'alert-1',
        patientId,
        patientName: 'Rajesh Kumar',
        category: 'fever',
        severity: 'high',
        title: 'High Fever Detected',
        description: 'Temperature spike to 39.5°C',
        status: 'acknowledged',
        createdAt: '2024-01-20T10:30:00',
        acknowledgedAt: '2024-01-20T10:35:00',
        acknowledgedBy: 'Dr. Sharma',
        vitals: { temperature: 39.5 },
        roomNumber: '101'
      }
    ]
  },

  // Get active alerts for hospital
  async getActiveAlerts(): Promise<EmergencyAlert[]> {
    console.log('Fetching active alerts')
    // In production: const response = await api.get(`/alerts?status=active`)
    // return response.data
    return []
  },

  // Acknowledge alert
  async acknowledgeAlert(alertId: string, doctorId: string): Promise<void> {
    console.log(`Acknowledging alert ${alertId} by doctor ${doctorId}`)
    // In production: await api.patch(`/alerts/${alertId}/acknowledge`, { doctorId })
  },

  // Resolve alert
  async resolveAlert(alertId: string, resolution: string): Promise<void> {
    console.log(`Resolving alert ${alertId}: ${resolution}`)
    // In production: await api.patch(`/alerts/${alertId}/resolve`, { resolution })
  },

  // Escalate alert
  async escalateAlert(alertId: string, reason: string): Promise<void> {
    console.log(`Escalating alert ${alertId}: ${reason}`)
    // In production: await api.patch(`/alerts/${alertId}/escalate`, { reason })
  },

  // Add response to alert
  async addAlertResponse(alertId: string, response: Omit<AlertResponse, 'id' | 'respondedAt'>): Promise<AlertResponse> {
    console.log(`Adding response to alert ${alertId}`, response)
    // In production: const res = await api.post(`/alerts/${alertId}/responses`, response)
    // return res.data

    return {
      id: `response-${Date.now()}`,
      ...response,
      respondedAt: new Date().toISOString()
    }
  },

  // Get alert history
  async getAlertHistory(patientId: string): Promise<EmergencyAlert[]> {
    console.log(`Fetching alert history for patient ${patientId}`)
    // In production: const response = await api.get(`/patients/${patientId}/alert-history`)
    // return response.data
    return []
  }
}
