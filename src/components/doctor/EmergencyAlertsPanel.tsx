import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Card, CardContent } from '../common/Card'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { Modal } from '../common/Modal'
import { AlertTriangle, CheckCircle, AlertCircle, Phone } from 'lucide-react'
import { alertService } from '../../services/alert.service'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import type { EmergencyAlert } from '../../types/alert.types'

const EmergencyAlertsPanel: React.FC = () => {
  const { user } = useAuth()
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null)

  const { data: activeAlerts = [] } = useQuery(
    'active-alerts',
    () => alertService.getActiveAlerts(),
    { refetchInterval: 5000 } // Refresh every 5 seconds
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const handleAcknowledge = (alertId: string) => {
    alertService.acknowledgeAlert(alertId, user?.id || '')
    toast.success('Alert acknowledged')
  }

  const handleResolve = (alertId: string) => {
    alertService.resolveAlert(alertId, 'Alert resolved')
    toast.success('Alert marked as resolved')
  }

  const unacknowledgedCount = activeAlerts.filter(a => a.status === 'active').length

  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-900">Active Emergencies</p>
                <p className="text-sm text-red-700">{unacknowledgedCount} alerts requiring attention</p>
              </div>
            </div>
            <Badge className="bg-red-600 text-white">{unacknowledgedCount}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts List */}
      <div className="space-y-3">
        {activeAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No active emergency alerts
            </CardContent>
          </Card>
        ) : (
          activeAlerts.map(alert => (
            <Card key={alert.id} className={`${getSeverityColor(alert.severity)} border`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{alert.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div><span className="font-medium">Patient:</span> {alert.patientName}</div>
                      <div><span className="font-medium">Room:</span> {alert.roomNumber}</div>
                      <div><span className="font-medium">Time:</span> {new Date(alert.createdAt).toLocaleTimeString()}</div>
                      <div><span className="font-medium">Status:</span> {alert.status}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <Button
                      onClick={() => setSelectedAlert(alert)}
                      variant="outline"
                      size="sm"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    {alert.status === 'active' && (
                      <Button
                        onClick={() => handleAcknowledge(alert.id)}
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={selectedAlert.title}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Alert Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Patient:</span> {selectedAlert.patientName}</p>
                <p><span className="font-medium">Category:</span> {selectedAlert.category}</p>
                <p><span className="font-medium">Severity:</span> {selectedAlert.severity}</p>
                <p><span className="font-medium">Status:</span> {selectedAlert.status}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm">{selectedAlert.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Vitals (if available)</h4>
              <div className="space-y-2 text-sm">
                {selectedAlert.vitals?.temperature && <p>Temperature: {selectedAlert.vitals.temperature}°C</p>}
                {selectedAlert.vitals?.heartRate && <p>Heart Rate: {selectedAlert.vitals.heartRate} bpm</p>}
                {selectedAlert.vitals?.painLevel && <p>Pain Level: {selectedAlert.vitals.painLevel}/10</p>}
                {selectedAlert.vitals?.oxygenSaturation && <p>Oxygen Saturation: {selectedAlert.vitals.oxygenSaturation}%</p>}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  handleAcknowledge(selectedAlert.id)
                  setSelectedAlert(null)
                }}
                className="flex-1"
              >
                Acknowledge & Close
              </Button>
              <Button
                onClick={() => {
                  handleResolve(selectedAlert.id)
                  setSelectedAlert(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Mark Resolved
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default EmergencyAlertsPanel
