// src/components/ChakraProviders.tsx
'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { StyleFunctionProps } from '@chakra-ui/styled-system'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === 'dark'
          ? 'linear-gradient(to bottom right,rgb(2, 10, 33),rgb(1, 8, 28))'
          : 'white',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      },
      main: {
        bg: props.colorMode === 'dark'
          ? 'linear-gradient(to bottom right,rgb(2, 10, 33),rgb(1, 8, 28))'
          : 'white',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
    }),
  },
})

export function ChakraProviders({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}
