import React from 'react'
import { useQuery } from 'react-query'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { Loader } from './Loader'
import { alertService } from '../../services/alert.service'
import { formatDate } from '../../utils/formatDate'

interface AlertHistoryProps {
  patientId: string
}

const AlertHistory: React.FC<AlertHistoryProps> = ({ patientId }) => {
  const { data: alerts = [], isLoading } = useQuery(
    ['alert-history', patientId],
    () => alertService.getAlertHistory(patientId)
  )

  if (isLoading) return <Loader />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No alerts in history</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-3">Time</th>
                  <th className="text-left py-3 px-3">Category</th>
                  <th className="text-left py-3 px-3">Severity</th>
                  <th className="text-left py-3 px-3">Status</th>
                  <th className="text-left py-3 px-3">Acknowledged By</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3">{formatDate.withTime(alert.createdAt)}</td>
                    <td className="py-3 px-3 capitalize">{alert.category}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'destructive'
                            : alert.severity === 'high'
                            ? 'warning'
                            : 'default'
                        }
                        className="text-xs"
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={alert.status === 'resolved' ? 'success' : 'warning'}
                        className="text-xs"
                      >
                        {alert.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">{alert.acknowledgedBy || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AlertHistory
