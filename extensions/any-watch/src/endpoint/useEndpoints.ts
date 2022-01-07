import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@raycast/api'
import { useCallback, useEffect, useState } from 'react'

import { Endpoint } from '../types'
import { renderEndpointAttributes } from './renderer'

export default function useEndpoints () {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadEndpoints = useCallback(async () => {
    const rawEndpoints: string = await getLocalStorageItem('endpoints') || "[]"
    const endpoints = JSON.parse(rawEndpoints) as Endpoint[]
    setEndpoints(endpoints)
  }, [])

  useEffect(() => {
    loadEndpoints().then(() => setIsLoading(false))
  }, [loadEndpoints])

  useEffect(() => {
    const saveEndpoints = async () => {
      await setLocalStorageItem('endpoints', JSON.stringify(endpoints))
    }

    saveEndpoints()
  }, [endpoints])

  const addEndpoint = useCallback((endpoint: Endpoint) => {
    setEndpoints(endpoints => [...endpoints, endpoint])
  }, [])

  const removeEndpoint = useCallback((endpoint: Endpoint) => {
    setEndpoints(endpoints => endpoints.filter(e => e.url !== endpoint.url))
  }, [])

  const clearAllEndpoints = useCallback(async () => {
    await removeLocalStorageItem('endpoints')
    setEndpoints([])
  }, [])

  const updateEndpoint = useCallback((endpoint: Endpoint) => {
    setEndpoints(endpoints => endpoints.map(e => e.url === endpoint.url ? endpoint : e))
  }, [])

  const triggerEndpointRender = useCallback(async (endpoint: Endpoint) => {
    const { status, summary } = await renderEndpointAttributes(endpoint)

    const updatedEndpoint = {
      ...endpoint,
      renderedResults: {
        status,
        summary
      },
      lastFetchedAt: Date.now().valueOf(),
    }

    updateEndpoint(updatedEndpoint)
  }, [])
  
  
  return {
    isLoading,
    endpoints,
    addEndpoint,
    removeEndpoint,
    clearAllEndpoints,
    updateEndpoint,
    triggerEndpointRender,
  }
}