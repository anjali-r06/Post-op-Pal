import React from 'react'
import { cn } from '../../utils/cn'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  title?: string
  description?: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, description, children, ...props }, ref) => {
    const variantIcons = {
      default: Info,
      destructive: XCircle,
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
    }

    const variantClasses = {
      default: 'bg-blue-50 text-blue-800 border-blue-200',
      destructive: 'bg-red-50 text-red-800 border-red-200',
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200',
    }

    const Icon = variantIcons[variant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg border p-4',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start">
          <Icon className="h-4 w-4 mt-0.5 mr-2" />
          <div className="flex-1">
            {title && <h5 className="font-medium mb-1">{title}</h5>}
            {description && <div className="text-sm">{description}</div>}
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }