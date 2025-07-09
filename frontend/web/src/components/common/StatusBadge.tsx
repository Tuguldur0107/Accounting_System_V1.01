'use client'

import React from 'react'
import { Badge } from '@chakra-ui/react'

export interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.trim().toLowerCase()

  const colorScheme =
    normalized === 'posted'
      ? 'green'
      : normalized === 'draft'
      ? 'yellow'
      : 'gray'

  return (
    <Badge
      fontSize="xs"
      fontWeight="regular"
      colorScheme={colorScheme}
    >
      {status}
    </Badge>
  )
}
