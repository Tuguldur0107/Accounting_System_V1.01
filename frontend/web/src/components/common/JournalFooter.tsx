'use client'

import React from 'react'
import { Box, Flex, Text, HStack, Button, VStack, useColorModeValue } from '@chakra-ui/react'
import {
  NewLineButton,
  CancelButton,
  SaveDraftButton,
  PostButton,
} from '@/components/common/FormActions'

export interface JournalFooterProps {
  isBalanced: boolean
  difference: number
  onAddLine: () => void
  onCancel: () => void
  onSaveDraft: () => void
  onPost: () => void
  sidebarWidth?: number  // ← энэ мөр байгаарай
  pageControls?: {
    page: number
    pageCount: number
    onPageChange: (newPage: number) => void
  }
}

export function JournalFooter({
  isBalanced,
  difference,
  onAddLine,
  onCancel,
  onSaveDraft,
  onPost,
  sidebarWidth = 0,
  pageControls
}: JournalFooterProps) {
  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.300')
  const bgColor = useColorModeValue('blue.50', 'dark.900')

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
      <Flex
        justify="space-between"
        align="flex-start"
        flexWrap="wrap"
        ml={{ base: 0, md: `${sidebarWidth}px` }}
      >
        {/* Status left side */}
        <Box mb={[2, 0]}>
          {isBalanced ? (
            <Text color="green" fontWeight="regular">
              ✅ Balanced
            </Text>
          ) : (
            <Text color="red" fontWeight="regular">
              ❌ Difference: {difference.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          )}
        </Box>

        {/* Buttons + Pagination stacked on right */}
        <VStack align="flex-end" spacing={2}>
          <Flex justify="end" gap={4}>
            <NewLineButton onClick={onAddLine} />
            <CancelButton onClick={onCancel} />
            <SaveDraftButton onClick={onSaveDraft} />
            <PostButton onClick={onPost} />
          </Flex>

          {pageControls && (
            <HStack spacing={6}>
              <Button
                size="xs"
                onClick={() => pageControls.onPageChange(pageControls.page - 1)}
                isDisabled={pageControls.page <= 1}
              >
                {'<'}
              </Button>
              <Text fontSize="sm">
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
        </VStack>
      </Flex>
    </Box>
  )
}
