'use client'

import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'
import { ColorModeToggle } from '@/components/ColorModeToggle'

export default function HomePage() {
  return (
    <Box p={8}>
      <Flex mb={4}>
        <Heading>Accounting SaaS system MVP</Heading>
        <Spacer />
        <ColorModeToggle />
      </Flex>
    </Box>
  )
}
