'use client'

import React from 'react'
import { Button } from '@chakra-ui/react'
import { Plus, Search } from 'lucide-react'

export interface HeaderButtonProps {
  onClick: () => void
  label?: string
  colorScheme?: string
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
}

export function NewButton({
  onClick,
  label = 'New',
  colorScheme = 'blue',
  variant = 'outline',
}: HeaderButtonProps) {
  return (
    <Button
      leftIcon={<Plus size={16} />}
      colorScheme={colorScheme}
      variant={variant}
      size="sm"
      px={4}
      height="32px"
      fontWeight="semibold"
      borderRadius="md"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}



export function FindButton({
  onClick,
  label = 'Find',
  colorScheme = 'blue',
  variant = 'outline',
}: HeaderButtonProps) {
  return (
    <Button
      leftIcon={<Search size={16} />}
      colorScheme={colorScheme}
      variant={variant}
      size="sm"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
