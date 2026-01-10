import React, { useState } from 'react'
import { CheckCircle, Circle, AlertCircle, Clock, Calendar, Bell } from 'lucide-react'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import toast from 'react-hot-toast'

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  time: string
  category: 'medication' | 'exercise' | 'measurement' | 'check-in'
  priority: 'high' | 'medium' | 'low'
}

const DailyChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      title: 'Morning Medication',
      description: 'Take prescribed pain medication (Ibuprofen 400mg)',
      completed: true,
      time: '08:00 AM',
      category: 'medication',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Breathing Exercises',
      description: 'Deep breathing exercises for lung expansion',
      completed: true,
      time: '10:00 AM',
      category: 'exercise',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Leg Exercises',
      description: 'Ankle pumps and quad sets (10 reps each)',
      completed: false,
      time: '02:00 PM',
      category: 'exercise',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Pain Assessment',
      description: 'Record pain level on scale of 1-10',
      completed: false,
      time: '04:00 PM',
      category: 'check-in',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Temperature Check',
      description: 'Measure and record body temperature',
      completed: false,
      time: '06:00 PM',
      category: 'measurement',
      priority: 'low'
    },
    {
      id: '6',
      title: 'Evening Medication',
      description: 'Take prescribed antibiotics',
      completed: false,
      time: '08:00 PM',
      category: 'medication',
      priority: 'high'
    },
  ])

  const [showCompleted, setShowCompleted] = useState(false)

  const toggleItem = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newCompleted = !item.completed
        if (newCompleted) {
          toast.success(`Marked "${item.title}" as complete!`)
        }
        return { ...item, completed: newCompleted }
      }
      return item
    }))
  }

  const markAllAsComplete = () => {
    setItems(items.map(item => ({ ...item, completed: true })))
    toast.success('All tasks marked as complete!')
  }

  const resetAll = () => {
    setItems(items.map(item => ({ ...item, completed: false })))
    toast.success('All tasks reset')
  }

  const completedCount = items.filter(item => item.completed).length
  const pendingCount = items.length - completedCount
  const progress = (completedCount / items.length) * 100

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'medication':
        return '💊'
      case 'exercise':
        return '🏃'
      case 'measurement':
        return '📊'
      case 'check-in':
        return '📝'
      default:
        return '📋'
    }
  }

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
    }
  }

  const filteredItems = showCompleted 
    ? items 
    : items.filter(item => !item.completed)

  const isOverdue = (time: string) => {
    const [timeStr, period] = time.split(' ')
    const [hours, minutes] = timeStr.split(':').map(Number)
    let hour24 = hours
    
    if (period === 'PM' && hours !== 12) hour24 += 12
    if (period === 'AM' && hours === 12) hour24 = 0
    
    const now = new Date()
    const taskTime = new Date()
    taskTime.setHours(hour24, minutes, 0, 0)
    
    return now > taskTime
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Recovery Checklist
          </div>
          <Badge variant={progress === 100 ? 'success' : 'warning'}>
            {completedCount}/{items.length} Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Daily Progress</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Task Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={!showCompleted ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowCompleted(false)}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={showCompleted ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowCompleted(true)}
          >
            Completed ({completedCount})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsComplete}
            disabled={completedCount === items.length}
          >
            Mark All Complete
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} ${!item.completed && isOverdue(item.time) ? 'border-red-300 bg-red-50' : ''}`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="mt-1 focus:outline-none transition-transform hover:scale-110"
                  title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {item.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{getCategoryIcon(item.category)}</span>
                        <h4 className={`font-medium ${item.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                          {item.title}
                        </h4>
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {!item.completed && isOverdue(item.time) && (
                          <Badge  className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {item.time}
                    </div>
                  </div>
                  
                  {!item.completed && !isOverdue(item.time) && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Add reminder logic
                          toast.success(`Reminder set for ${item.time}`)
                        }}
                        leftIcon={<Bell className="h-4 w-4" />}
                      >
                        Set Reminder
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Skip task logic
                          toggleItem(item.id)
                          toast(`Skipped "${item.title}"`)
                        }}
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending tasks for today</p>
            </div>
          )}
        </div>

        {/* Summary and Actions */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {items.filter(i => i.priority === 'high' && !i.completed).length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {items.filter(i => !i.completed && isOverdue(i.time)).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={resetAll}
              disabled={completedCount === 0}
            >
              Reset All Tasks
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                // Share progress logic
                toast.success('Progress shared with your doctor!')
              }}
            >
              Share Progress
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DailyChecklist