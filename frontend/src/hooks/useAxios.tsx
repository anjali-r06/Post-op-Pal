import { useState, useEffect, useCallback } from 'react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'

interface UseAxiosOptions<T> {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  config?: AxiosRequestConfig
  manual?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: AxiosError) => void
}

interface UseAxiosReturn<T> {
  data: T | null
  error: AxiosError | null
  loading: boolean
  execute: (config?: UseAxiosOptions<T>) => Promise<void>
  reset: () => void
}

export function useAxios<T = any>(options: UseAxiosOptions<T> = {}): UseAxiosReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<AxiosError | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async (overrideOptions: UseAxiosOptions<T> = {}) => {
    const mergedOptions = { ...options, ...overrideOptions }
    
    if (!mergedOptions.url) {
      console.warn('useAxios: URL is required for execution')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios({
        url: mergedOptions.url,
        method: mergedOptions.method || 'GET',
        data: mergedOptions.data,
        ...mergedOptions.config,
      })

      setData(response.data)
      if (mergedOptions.onSuccess) {
        mergedOptions.onSuccess(response.data)
      }
    } catch (err) {
      const axiosError = err as AxiosError
      setError(axiosError)
      if (mergedOptions.onError) {
        mergedOptions.onError(axiosError)
      }
    } finally {
      setLoading(false)
    }
  }, [options])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!options.manual && options.url) {
      execute()
    }
  }, [options.url, options.manual, execute])

  return {
    data,
    error,
    loading,
    execute,
    reset,
  }
}