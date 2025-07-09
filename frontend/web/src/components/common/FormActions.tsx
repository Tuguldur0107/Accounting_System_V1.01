'use client'

import React from 'react'
import { Button } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { Text } from '@chakra-ui/react'

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Text
      fontSize="sm"
      fontWeight="regular"
      color={active ? 'green' : 'red'}
    >
      {active ? 'Active' : 'Inactive'}
    </Text>
  )
}

// + Add line товч
export interface NewLineButtonProps {
  onClick: () => void
  label?: string
}
export function NewLineButton({ onClick, label = 'Add line' }: NewLineButtonProps) {
  return (
    <Button
      leftIcon={<Plus size={16} />}
      size="sm"
      variant="outline"
      colorScheme="blue"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

// Cancel link товч
export interface CancelButtonProps {
  onClick: () => void
  label?: string
}
export function CancelButton({ onClick, label = 'Cancel' }: CancelButtonProps) {
  return (
    <Button
      variant="outline"
      color="red"
      size="sm"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

// Save draft товч
export interface SaveDraftButtonProps {
  onClick: () => void
  label?: string
}
export function SaveDraftButton({ onClick, label = 'Save draft' }: SaveDraftButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      color="yellow.400"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

// Post товч
export interface PostButtonProps {
  onClick: () => void
  label?: string
}
export function PostButton({ onClick, label = 'Post' }: PostButtonProps) {
  return (
    <Button
      size="sm"
      colorScheme="blue"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
