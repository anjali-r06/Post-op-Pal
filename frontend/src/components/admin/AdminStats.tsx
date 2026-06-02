import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Users, Activity, AlertTriangle, TrendingUp } from 'lucide-react'

const AdminStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Patients',
      value: '142',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Recoveries',
      value: '89',
      change: '+8%',
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      title: 'Red Flag Alerts',
      value: '7',
      change: '-2%',
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      title: 'Recovery Rate',
      value: '94%',
      change: '+3%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>{' '}
              from last week
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default AdminStats