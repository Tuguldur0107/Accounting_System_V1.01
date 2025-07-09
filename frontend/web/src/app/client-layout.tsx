'use client'

import { ReactNode } from 'react'
import FocusReset from '@/components/FocusReset'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FocusReset />
      {children}
    </>
  )
}
