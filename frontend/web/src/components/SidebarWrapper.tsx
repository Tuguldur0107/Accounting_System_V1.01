// src/components/SidebarWrapper.tsx
'use client'

import { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import { Box, Flex } from '@chakra-ui/react'

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return (
    <Flex>
      <Sidebar />
      <Box flex="1" minH="100vh">
        {children}
      </Box>
    </Flex>
  )
}
