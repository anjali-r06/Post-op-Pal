import React from 'react'
import { useQuery } from 'react-query'
import { patientService } from '../../services/patient.service'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { AlertTriangle, Clock, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const AlertsPanel: React.FC = () => {
  const navigate = useNavigate()
  const { data: alerts, refetch } = useQuery('alerts', () => patientService.getAlerts())

  const handleResolve = async (alertId: string) => {
    // In production, call API to resolve alert
    console.log('Resolving alert:', alertId)
    // Then refetch alerts
    refetch()
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Alerts
          </span>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {alerts?.filter((a: any) => !a.resolved).length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {alerts?.map((alert: any) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${alert.resolved ? 'bg-gray-50' : 'bg-red-50 border-red-200'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <span className="font-medium">{alert.patientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {format(new Date(alert.timestamp), 'HH:mm')}
                  </span>
                </div>
              </div>
              <p className="text-sm mb-3">{alert.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {format(new Date(alert.timestamp), 'MMM d, yyyy')}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/doctor/patients/${alert.patientId}`)}
                  >
                    View
                  </Button>
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(alert.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default AlertsPanel