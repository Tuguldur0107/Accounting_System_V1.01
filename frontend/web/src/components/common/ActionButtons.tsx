'use client'

import React from 'react'
import {
  Button,
  Tooltip,
  ButtonProps,
} from '@chakra-ui/react'
import { Eye, Trash2, Pencil, Check, X } from 'lucide-react'
import Link from 'next/link'

/* View Button - тусдаа хэвээр */
interface ViewButtonProps {
  href: string
  label?: string
}
export function ViewButton({ href }: ViewButtonProps) {
  return (
    <Tooltip hasArrow>
      <Link href={href}>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="yellow"
          leftIcon={<Eye size={16} />}
          _hover={{ color: 'yellow.400', transform: 'scale(1.1)' }}
          _active={{ transform: 'scale(0.95)' }}
        >
        </Button>
      </Link>
    </Tooltip>
  )
}

/* Delete Button */
interface DeleteButtonProps extends ButtonProps {
  onClick: () => void
  isLoading?: boolean
  label?: string
}
export function DeleteButton({
  onClick,
  isLoading = false,
  ...props
}: DeleteButtonProps) {
  return (
    <Tooltip hasArrow>
      <Button
        size="sm"
        color="red"
        variant="ghost"
        leftIcon={<Trash2 size={16} />}
        onClick={onClick}
        isLoading={isLoading}
        _hover={{ transform: 'scale(1.03)' }}
        _active={{ transform: 'scale(0.97)' }}
        {...props}
      >
      </Button>
    </Tooltip>
  )
}

/* Edit Button */
interface EditButtonProps extends ButtonProps {
  onClick: () => void
  label?: string
}
export function EditButton({
  onClick,
  ...props
}: EditButtonProps) {
  return (
    <Tooltip hasArrow>
      <Button
        size="sm"
        colorScheme="yellow"
        variant="ghost"
        leftIcon={<Pencil size={16} />}
        onClick={onClick}
        _hover={{ transform: 'scale(1.03)' }}
        _active={{ transform: 'scale(0.97)' }}
        {...props}
      >
      </Button>
    </Tooltip>
  )
}

/* Save Button */
interface SaveButtonProps extends ButtonProps {
  onClick: () => void
  label?: string
}
export function SaveButton({
  onClick,
  ...props
}: SaveButtonProps) {
  return (
    <Tooltip hasArrow>
      <Button
        size="sm"
        color="green"
        variant="ghost"
        leftIcon={<Check size={16} />}
        onClick={onClick}
        _hover={{ transform: 'scale(1.03)' }}
        _active={{ transform: 'scale(0.97)' }}
        {...props}
      >
      </Button>
    </Tooltip>
  )
}

/* Cancel Button */
interface CancelButtonProps extends ButtonProps {
  onClick: () => void
  label?: string
}
export function CancelButton({
  onClick,
  ...props
}: CancelButtonProps) {
  return (
    <Tooltip hasArrow>
      <Button
        size="sm"
        variant="ghost"
        leftIcon={<X size={16} />}
        onClick={onClick}
        _hover={{ transform: 'scale(1.03)' }}
        _active={{ transform: 'scale(0.97)' }}
        {...props}
      >
      </Button>
    </Tooltip>
  )
}
