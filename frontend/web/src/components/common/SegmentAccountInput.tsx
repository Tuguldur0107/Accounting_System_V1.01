'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  Input,
  useColorModeValue,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  HStack
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

type Segment = {
  key: string
  name: string
  length: number
}

interface SegmentAccountInputProps {
  defaultValue: string
  onCodeChange: (newCode: string) => void
  isDisabled?: boolean
}

const segments: Segment[] = [
  { key: 'company', name: 'Company', length: 3 },
  { key: 'costCenter', name: 'Cost Center', length: 6 },
  { key: 'mainAccount', name: 'Main Account', length: 8 },
  { key: 'productService', name: 'Product/Service', length: 2 },
  { key: 'project', name: 'Project', length: 4 },
  { key: 'ict', name: 'ICT', length: 3 },
  { key: 'rpt', name: 'RPT', length: 4 },
  { key: 'cashFlow', name: 'Cash Flow', length: 4 },
  { key: 'module', name: 'Module', length: 2 },
  { key: 'future2', name: 'Future 2', length: 1 },
]

const descriptionMap: Record<string, string> = {
  '101': 'Head Office',
  '102': 'Branch Office',
  '11000000': 'Cash Account',
  '12000000': 'Bank Account',
  '000001': 'UB Main Branch',
  '000002': 'Erdenet Branch',
  '01': 'Standard Service',
  '02': 'Premium Service',
  '0000': 'General Project',
  '000': 'Default ICT',
  '0001': 'Network Team',
  '0002': 'Software Team',
  '0003': 'Hardware Team',
}

const defaultSegmentValues: Record<string, string> = {
  company: '101',
  costCenter: '000000',
  mainAccount: '11000000',
  productService: '00',
  project: '0000',
  ict: '000',
  rpt: '0000',
  cashFlow: '0000',
  module: '01',
  future2: '0',
}

function parseAccountCode(fullCode: string): Record<string, string> {
  const parts = fullCode.split('.')
  const result: Record<string, string> = {}
  segments.forEach((seg, i) => {
    result[seg.key] = parts[i] || ''.padStart(seg.length, '0')
  })
  return result
}

export default function SegmentAccountInput({
  defaultValue,
  onCodeChange,
  isDisabled = false
}: SegmentAccountInputProps) {
  const [segmentValues, setSegmentValues] = useState<Record<string, string>>(
    defaultValue ? parseAccountCode(defaultValue) : defaultSegmentValues
  )

  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.300')
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100')

  const [fullAccountCode, setFullAccountCode] = useState(
    segments
      .map(seg => (segmentValues[seg.key] || '').padStart(seg.length, '0'))
      .join('.')
  )

  useEffect(() => {
    onCodeChange(fullAccountCode)
  }, [])

  const handleManualChange = (val: string) => {
    setFullAccountCode(val)
    onCodeChange(val)
  }

  const handleSegmentChange = (key: string, val: string) => {
    const updated = { ...segmentValues, [key]: val }
    setSegmentValues(updated)
    const joined = segments.map(s => (updated[s.key] || '').padStart(s.length, '0')).join('.')
    setFullAccountCode(joined)
    onCodeChange(joined)
  }

  return (
    <HStack spacing={0} w="100%">
      {/* ✅ Урт бичдэг Input */}
      <Input
        value={fullAccountCode}
        onChange={(e) => handleManualChange(e.target.value)}
        placeholder="Full Account Code"
        w="100%"
        variant="unstyled"
        pl={2}
        isReadOnly={isDisabled}
      />

      {/* ✅ Popover button disable болох боломжтой */}
      <Popover placement="bottom-start" isLazy>
        <PopoverTrigger>
          <IconButton
            aria-label="Edit Segments"
            icon={<ChevronDownIcon />}
            variant="ghost"
            borderRadius={0}
            isDisabled={isDisabled}
          />
        </PopoverTrigger>
        <PopoverContent
          bg={bgColor}
          borderColor={borderColor}
          backdropFilter="blur(14px)"
          py={2}
          px={2}
          w="auto"
        >
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="regular">Edit Account Segments</PopoverHeader>
          <PopoverBody>
            <Box>
              {segments.map(seg => (
                <Flex
                  key={seg.key}
                  align="center"
                  gap={2}
                  mb={0.5}
                >
                  <Text w="140px" fontWeight="small" textAlign="left" fontSize="sm">
                    {seg.name} :
                  </Text>

                  <Input
                    maxLength={seg.length}
                    value={segmentValues[seg.key]}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      handleSegmentChange(seg.key, val)
                    }}
                    w="100px"
                    size="sm"
                    variant="filled"
                    textAlign="right"
                    isDisabled={isDisabled}
                  />

                  <Text w="140px" fontSize="sm" color="gray.500" textAlign="left">
                    {descriptionMap[segmentValues[seg.key]] || '-'}
                  </Text>
                </Flex>
              ))}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  )
}
