import React from 'react'

// Allow both 'danger' and 'destructive' variants
export interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger' | 'destructive' | 'warning' | 'outline' | 'secondary' | 'success' | 'info'
  type?: never
}

export interface DropdownDivider {
  type: 'divider'
  label?: never
  icon?: never
  onClick?: never
  variant?: never
}

export type DropdownMenuItem = DropdownItem | DropdownDivider

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
  className?: string
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right', className }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${className}`}>
          <div className="py-1">
            {items.map((item, index) => {
              if ('type' in item && item.type === 'divider') {
                return <div key={`divider-${index}`} className="border-t my-1" />
              }

              const menuItem = item as DropdownItem
              // Map 'destructive' to 'danger' for styling
              const variant = menuItem.variant === 'destructive' ? 'danger' : menuItem.variant
              
              return (
                <button
                  key={`item-${index}`}
                  onClick={() => {
                    menuItem.onClick()
                    setIsOpen(false)
                  }}
                  className={`
                    w-full text-left px-4 py-2 text-sm
                    ${variant === 'danger' ? 'text-red-700 hover:bg-red-50' : 
                      variant === 'warning' ? 'text-yellow-700 hover:bg-yellow-50' :
                      variant === 'success' ? 'text-green-700 hover:bg-green-50' :
                      'text-gray-700 hover:bg-gray-100'
                    }
                    flex items-center gap-2
                  `}
                >
                  {menuItem.icon}
                  <span>{menuItem.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown