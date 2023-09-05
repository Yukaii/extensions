import { usePromise } from '@raycast/utils'
import fetch from 'cross-fetch'

import { invoke } from './anki-connect'

// API: GET root for health check
export const useHealthCheck = () => {
  return usePromise(async () => {
    const response = await fetch(`http://127.0.0.1:8765`)
    const text = await response.text()
    return text.includes('AnkiConnect')
  })
}

export const useDeckNamesAndIds = () => {
  return usePromise(async () => {
    return invoke({
      version: 6,
      action: 'deckNamesAndIds',
      request: {} as any
    })
  })
}
