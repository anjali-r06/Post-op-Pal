import { 
  format, 
  formatDistance, 
  isToday, 
  isYesterday, 
  isThisWeek, 
  isThisYear,
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes
} from 'date-fns'

export const formatDate = {
  // Format date as DD/MM/YYYY
  short: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'dd/MM/yyyy')
  },

  // Format date as Month DD, YYYY
  long: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'MMMM dd, yyyy')
  },

  // Format date with time
  withTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'MMM dd, yyyy HH:mm')
  },

  // Format time only
  time: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'HH:mm')
  },

  // Format date for input fields (YYYY-MM-DD)
  forInput: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'yyyy-MM-dd')
  },

  // Relative time (e.g., "2 hours ago")
  relative: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistance(d, new Date(), { addSuffix: true })
  },

  // Smart date formatting (today, yesterday, or date)
  smart: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    
    if (isToday(d)) {
      return `Today at ${format(d, 'HH:mm')}`
    }
    
    if (isYesterday(d)) {
      return `Yesterday at ${format(d, 'HH:mm')}`
    }
    
    if (isThisWeek(d)) {
      return format(d, 'EEEE HH:mm')
    }
    
    if (isThisYear(d)) {
      return format(d, 'MMM dd, HH:mm')
    }
    
    return format(d, 'MMM dd, yyyy HH:mm')
  },

  // Format for medical records
  medical: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'yyyy-MM-dd HH:mm:ss')
  },

  // Calculate age from birth date
  calculateAge: (birthDate: Date | string): number => {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  },

  // Format duration in minutes to readable format
  formatDuration: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`
  },

  // Get time ago in a compact format
  timeAgo: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    const now = new Date()
    
    const minutes = differenceInMinutes(now, d)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = differenceInHours(now, d)
    if (hours < 24) return `${hours}h ago`
    
    const days = differenceInDays(now, d)
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    if (days < 365) return `${Math.floor(days / 30)}mo ago`
    
    return `${Math.floor(days / 365)}y ago`
  },

  // Format date range
  formatRange: (startDate: Date | string, endDate: Date | string): string => {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
    
    if (isToday(start) && isToday(end)) {
      return `Today, ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
    }
    
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return `${format(start, 'MMM dd, yyyy')}, ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
    }
    
    return `${format(start, 'MMM dd, HH:mm')} - ${format(end, 'MMM dd, HH:mm')}`
  },

  // Check if date is in the past
  isPast: (date: Date | string): boolean => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return d < new Date()
  },

  // Check if date is in the future
  isFuture: (date: Date | string): boolean => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return d > new Date()
  },

  // Add days to date
  addDays: (date: Date | string, days: number): Date => {
    const d = typeof date === 'string' ? parseISO(date) : date
    const result = new Date(d)
    result.setDate(result.getDate() + days)
    return result
  },

  // Get start of day
  startOfDay: (date: Date | string): Date => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  },

  // Get end of day
  endOfDay: (date: Date | string): Date => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
  },
}