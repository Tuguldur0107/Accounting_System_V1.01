// src/app/layout.tsx

import { ReactNode } from 'react'
import { ChakraProviders } from '@/components/ChakraProviders'
import SidebarWrapper from '@/components/SidebarWrapper'
import ThemeToaster from '@/components/ThemeToaster'
import ClientLayout from './client-layout'

export const metadata = {
  title: 'Accounting System',
  description: 'Next.js + Chakra UI',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ChakraProviders>
          <ClientLayout>
            <SidebarWrapper>{children}</SidebarWrapper>
            <ThemeToaster />
          </ClientLayout>
        </ChakraProviders>
      </body>
    </html>
  )
}