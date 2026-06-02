import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Thermometer,
  Calendar,
  Target,
  Award
} from 'lucide-react'

const RecoveryStatus: React.FC = () => {
  const recoveryMetrics = [
    {
      label: 'Pain Level',
      value: '3/10',
      change: '-2',
      trend: 'down',
      icon: Activity,
      target: '2/10',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Medication Adherence',
      value: '100%',
      change: '+5%',
      trend: 'up',
      icon: Heart,
      target: '95%',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Exercise Completion',
      value: '85%',
      change: '+10%',
      trend: 'up',
      icon: Target,
      target: '90%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Temperature',
      value: '98.6°F',
      change: '-0.5',
      trend: 'down',
      icon: Thermometer,
      target: '98.6°F',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ]

  const milestones = [
    { name: 'Hospital Discharge', completed: true, date: 'Jan 16, 2024', icon: Award },
    { name: 'First Follow-up', completed: true, date: 'Jan 20, 2024', icon: Calendar },
    { name: 'Physical Therapy Start', completed: true, date: 'Jan 22, 2024', icon: Activity },
    { name: 'Medication Reduction', completed: false, date: 'Jan 25, 2024', icon: Heart },
    { name: 'Full Mobility', completed: false, date: 'Feb 1, 2024', icon: TrendingUp },
    { name: 'Complete Recovery', completed: false, date: 'Feb 15, 2024', icon: Award },
  ]

  const recoveryTips = [
    'Continue deep breathing exercises 3 times daily',
    'Gradually increase walking distance each day',
    'Keep surgical area clean and dry',
    'Report any fever above 100.4°F immediately',
    'Stay hydrated and maintain protein-rich diet'
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recovery Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Overall Recovery Progress</h3>
              <p className="text-sm text-gray-600">Day 7 of 30-day recovery plan</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">65%</div>
              <div className="text-sm text-gray-600">On track</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: '65%' }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Day 0</span>
            <span>Day 15</span>
            <span>Day 30</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recoveryMetrics.map((metric) => (
            <div
              key={metric.label}
              className={`p-4 rounded-lg ${metric.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <Badge
                  variant={metric.trend === 'up' ? 'success' : 'warning'}
                  className="text-xs"
                >
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
              <div className="text-xs text-gray-500 mt-2">
                Target: {metric.target}
              </div>
            </div>
          ))}
        </div>

        {/* Recovery Milestones */}
        <div>
          <h3 className="font-medium mb-4">Recovery Milestones</h3>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.name}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <milestone.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{milestone.name}</div>
                  <div className="text-sm text-gray-600">{milestone.date}</div>
                </div>
                <Badge variant={milestone.completed ? 'success' : 'secondary'}>
                  {milestone.completed ? 'Completed' : 'Pending'}
                </Badge>
                <div className="text-xs text-gray-400">
                  {index + 1}/{milestones.length}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium mb-3 text-blue-800">Today's Recovery Tips</h3>
          <ul className="space-y-2">
            {recoveryTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="outline" className="w-full">
            Download Recovery Report
          </Button>
          <Button className="w-full">
            Update Recovery Status
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecoveryStatus