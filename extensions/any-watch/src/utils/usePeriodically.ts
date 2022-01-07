import { useEffect, useState } from "react";

export default function usePeriodically (cb: () => any, delay: number) {
  const [_timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined)

  const startTimer = () => {
    const timeoutId = setTimeout(async () => {
      try {
        await Promise.resolve(cb())
      } catch (e) {
        console.error(e)
      }

      startTimer()
    }, delay)

    setTimeoutId(timeoutId)
  }

  useEffect(() => {
    startTimer()

    return () => {
      if (_timeoutId) {
        clearTimeout(_timeoutId)
      }
    }
  }, [])
}