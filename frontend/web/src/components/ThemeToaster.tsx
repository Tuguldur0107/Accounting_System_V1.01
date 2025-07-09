'use client'

import { Toaster } from 'sonner'
import { useColorMode } from '@chakra-ui/react'

export default function ThemeToaster() {
  const { colorMode } = useColorMode()

  return (
    <Toaster
      position="bottom-right"
      closeButton
      toastOptions={{
        style: {
        background: 'lime',
        color: '#333',
        },
      }}
    />
  )
}
