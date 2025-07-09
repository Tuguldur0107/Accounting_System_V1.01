'use client'

import { useEffect } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'

export default function FocusReset() {
  const segments = useSelectedLayoutSegments()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.activeElement instanceof HTMLElement && document.activeElement.blur()
    }
  }, [segments.join('/')])

  return null
}
