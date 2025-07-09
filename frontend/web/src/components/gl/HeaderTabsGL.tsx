'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import { Box, Button, Flex, useColorModeValue } from '@chakra-ui/react'
import { ColorModeToggle } from '@/components/ColorModeToggle'

const tabs = [
  { key: 'dashboard', label: 'Dashboard', href: '/modules/gl/gl_dashboard' },
  { key: 'entries',   label: 'Journal Entries', href: '/modules/gl/journals' },
  { key: 'reports',   label: 'Reports',         href: '/modules/gl/reports' },
  { key: 'chart',     label: 'Chart of Accounts', href: '/modules/gl/chart_of_accounts' },
]

interface HeaderTabsGLProps {
  activeTab?: 'dashboard' | 'entries' | 'reports' | 'chart'
  right?: ReactNode
}

export function HeaderTabsGL({ activeTab, right }: HeaderTabsGLProps) {
  const pathname = usePathname()

  const activeBg     = useColorModeValue('blue.600', 'blue.600')
  const activeText   = useColorModeValue('white', 'white')
  const inactiveText = useColorModeValue('gray.700', 'whiteAlpha.800')
  const borderColor  = useColorModeValue('gray.200', 'whiteAlpha.200')

  // hover өнгө (Reports шиг)
  const hoverBg      = useColorModeValue('blue.100', 'blue.100')
  const hoverText    = useColorModeValue('blue.900', 'blue.800')

  const current =
    activeTab ?? tabs.find((t) => pathname.startsWith(t.href))?.key ?? 'entries'

  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid"
      borderColor={borderColor}
      mb={4}
      px={4}
      pt={4}
      gap={4}
      wrap="wrap"
    >
      {/* Left: tabs */}
      <Flex gap={1} overflowX="auto">
        {tabs.map((tab) => {
          const isActive = current === tab.key
          return (
            <Button
              key={tab.href}
              as={NextLink}
              href={tab.href}
              size="sm"
              variant="ghost"
              fontWeight="semibold"
              px={5}
              py={2}
              borderRadius="lg"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeText : inactiveText}
              transition="all 0.2s ease-in-out"
              _hover={{
                bg: hoverBg,
                color: hoverText,
              }}
              _active={{ transform: 'scale(0.96)' }}
            >
              {tab.label}
            </Button>
          )
        })}
      </Flex>

      {/* Right: Calendar/Find area + Theme toggle */}
      <Flex gap={2} align="center">
        {right}
        <ColorModeToggle />
      </Flex>
    </Flex>
  )
}
