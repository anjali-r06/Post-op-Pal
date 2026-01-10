import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'

const Unauthorized: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="w-full"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go Home
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              If you need access, please contact:
            </p>
            <p className="text-sm font-medium">support@postoppal.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Unauthorized