'use client'

import { Input } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

interface ColumnFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ColumnFilter({
  value,
  onChange,
  placeholder = 'Search...'
}: ColumnFilterProps) {
  return (
    <Input
      size="xs"
      variant="filled"
      fontSize="xs"
      bg={useColorModeValue('gray.100', 'whiteAlpha.100')}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
