'use client'

import React, { ReactNode } from 'react'
import {
  Box,
  HStack,
  Button,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

interface PageControlsProps {
  page: number
  pageCount: number
  onPageChange: (newPage: number) => void
}

interface PaginationFooterProps {
  children?: ReactNode
  pageControls?: PageControlsProps
}

export function PaginationFooter({
  children,
  pageControls,
}: PaginationFooterProps) {
  const borderColor = useColorModeValue('gray.300', 'rgba(255, 255, 255, 0.1)')
  const bgColor = useColorModeValue('gray.100', 'dark.900')
  const color = useColorModeValue('white.600', 'white.400')

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      w="100%"
      bg={bgColor}
      borderTop="1px solid"
      borderColor={borderColor}
      zIndex={10}
      py={3}
      px={5}
    >
      {pageControls && (
        <HStack justify="right" spacing={6}>
          <Button
            size="xs"
            onClick={() => pageControls.onPageChange(pageControls.page - 1)}
            isDisabled={pageControls.page <= 1}
          >
            {'<'}
          </Button>
          <Text fontSize="sm" color={color}>
            Page {pageControls.page} of {pageControls.pageCount}
          </Text>
          <Button
            size="xs"
            onClick={() => pageControls.onPageChange(pageControls.page + 1)}
            isDisabled={pageControls.page >= pageControls.pageCount}
          >
            {'>'}
          </Button>
        </HStack>
      )}

      {children}
    </Box>
  )
}
