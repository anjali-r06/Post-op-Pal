import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Search, Home, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Search className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500">
              Error code: 404
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
              Go to Dashboard
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team:
            </p>
            <p className="text-sm font-medium">support@postoppal.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound