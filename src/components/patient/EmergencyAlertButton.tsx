import React, { useState } from 'react'
import { Button } from '../common/Button'
import { AlertTriangle, Loader } from 'lucide-react'
import { useMutation } from 'react-query'
import { alertService } from '../../services/alert.service'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

interface EmergencyAlertButtonProps {
  category?: 'pain' | 'fever' | 'breathing' | 'bleeding' | 'other'
  description?: string
}

const EmergencyAlertButton: React.FC<EmergencyAlertButtonProps> = ({ category = 'other', description }) => {
  const { user } = useAuth()
  const [isPressed, setIsPressed] = useState(false)

  const createAlertMutation = useMutation(
    () => alertService.createAlert({
      patientId: user?.id || '',
      patientName: user?.name || '',
      category: category as any,
      severity: 'high',
      title: `Emergency Alert - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      description: description || 'Emergency alert triggered',
      roomNumber: '101' // Get from patient data in production
    }),
    {
      onSuccess: () => {
        toast.success('Emergency alert sent to medical staff!')
        setIsPressed(false)
      },
      onError: () => {
        toast.error('Failed to send emergency alert')
      }
    }
  )

  const handleEmergencyAlert = () => {
    setIsPressed(true)
    createAlertMutation.mutate()
  }

  return (
    <Button
      onClick={handleEmergencyAlert}
      className="bg-red-600 hover:bg-red-700 text-white w-full relative overflow-hidden"
      disabled={createAlertMutation.isLoading}
      size="lg"
    >
      {createAlertMutation.isLoading ? (
        <>
          <Loader className="h-5 w-5 mr-2 animate-spin" />
          Sending Alert...
        </>
      ) : (
        <>
          <AlertTriangle className="h-5 w-5 mr-2" />
          EMERGENCY ALERT
        </>
      )}
      {isPressed && (
        <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
      )}
    </Button>
  )
}

export default EmergencyAlertButton
