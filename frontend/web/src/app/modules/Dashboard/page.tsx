// src/app/modules/Dashboard/page.tsx
'use client'

import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react'
import { ColorModeToggle } from '@/components/ColorModeToggle' // ← заавал зөв замаар импортлох

export default function DashboardPage() {
  const cardBg = useColorModeValue('white', 'whiteAlpha.100')
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900')

  return (
    <Box p={6}>
      {/* 🔵 Heading + ColorModeToggle зэрэгцүүлэв */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color={textColor}>Dashboard</Heading>
        <ColorModeToggle />
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard label="Total Revenue" value="$123,456" />
        <StatCard label="Outstanding Receivables" value="$34,200" />
        <StatCard label="Total Expenses" value="$88,500" />
        <StatCard label="Cash Balance" value="$12,345" />
      </SimpleGrid>
    </Box>
  )

  function StatCard({ label, value }: { label: string; value: string }) {
    return (
      <Box
        p={5}
        borderRadius="xl"
        bg={cardBg}
        boxShadow="md"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'whiteAlpha.800')}
      >
        <Stat>
          <StatLabel color="whiteAlpha.800" fontSize="sm">
            {label}
          </StatLabel>
          <StatNumber fontSize="2xl" color={textColor}>
            {value}
          </StatNumber>
        </Stat>
      </Box>
    )
  }
}
