'use client'

import { useState } from 'react'
import { format, parse } from 'date-fns'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  useColorMode,
  useColorModeValue,
  Box,
  Input,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type Props = {
  range: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
}

export default function CalendarRange({ range, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const { colorMode } = useColorMode()

  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // 👉 Default range always available
  const defaultRange: DateRange = {
    from: firstOfMonth,
    to: today
  }

  // 👉 Use given range or fallback to default
  const activeRange = range ?? defaultRange

  // 👉 Local input states
  const [fromInput, setFromInput] = useState(
    activeRange.from ? format(activeRange.from, 'yyyy-MM-dd') : ''
  )
  const [toInput, setToInput] = useState(
    activeRange.to ? format(activeRange.to, 'yyyy-MM-dd') : ''
  )

  // 👉 Button label always shows a range
  const label = activeRange.from
    ? activeRange.to
      ? `${format(activeRange.from, 'yyyy-MM-dd')} → ${format(activeRange.to, 'yyyy-MM-dd')}`
      : format(activeRange.from, 'yyyy-MM-dd')
    : 'Select range'

  const bg = useColorModeValue('white', 'gray.800')
  const border = useColorModeValue('gray.200', 'whiteAlpha.300')
  const text = useColorModeValue('black', 'white')

  const handleInputChange = (type: 'from' | 'to', value: string) => {
    if (type === 'from') setFromInput(value)
    else setToInput(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (fromInput.length === 10 && toInput.length === 10) {
        const fromDate = parse(fromInput, 'yyyy-MM-dd', new Date())
        const toDate = parse(toInput, 'yyyy-MM-dd', new Date())

        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
          onChange({ from: fromDate, to: toDate })
        } else {
          onChange(undefined)
        }
      } else {
        onChange(undefined)
      }
      setOpen(false)
    }
  }

  return (
    <Popover isOpen={open} onClose={() => setOpen(false)}>
      <PopoverTrigger>
        <Button
          onClick={() => setOpen(!open)}
          leftIcon={<CalendarIcon />}
          variant="outline"
          size="sm"
        >
          {label}
        </Button>
      </PopoverTrigger>

      <PopoverContent
          w="320px"
          h="370px"
          p={3}
          borderRadius="lg"
          border="1px solid"
          borderColor={useColorModeValue('gray.300', 'whiteAlpha.300')}
          backgroundColor={useColorModeValue('rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)')}
          backdropFilter="blur(12px)"
          >
        <VStack spacing={0} align="center">
          <HStack>
            <Input
              size="sm"
              w="145px"
              placeholder="From yyyy-MM-dd"
              value={fromInput}
              onChange={(e) => handleInputChange('from', e.target.value)}
              onKeyDown={handleKeyDown}
              bg={useColorModeValue('rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)')}
              border="1px solid"
              borderColor={useColorModeValue('gray.300', 'whiteAlpha.300')}
              backdropFilter="blur(6px)"
              _placeholder={{ color: useColorModeValue('gray.600', 'gray.400') }}
            />

            <Input
              size="sm"
              w="145px"
              placeholder="To yyyy-MM-dd"
              value={toInput}
              onChange={(e) => handleInputChange('to', e.target.value)}
              onKeyDown={handleKeyDown}
              bg={useColorModeValue('rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)')}
              border="1px solid"
              borderColor={useColorModeValue('gray.300', 'whiteAlpha.300')}
              backdropFilter="blur(6px)"
              _placeholder={{ color: useColorModeValue('gray.600', 'gray.400') }}
            />
          </HStack>

          <Box
            sx={{
              '.rdp': {
                backgroundColor: 'transparent',
                color: text,
              },
              '.rdp-month': {
                backgroundColor: useColorModeValue('rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'),
                backdropFilter: 'blur(8px)',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: useColorModeValue('gray.300', 'whiteAlpha.300'),
                padding: '8px',
              },
              '.rdp-day_selected': {
                backgroundColor: colorMode === 'light' ? '#3182ce' : '#63b3ed',
                color: 'white',
              },
              '.rdp-day_today': {
                border: '1px solid',
                borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300',
              },
              '.rdp-caption_label': {
                fontWeight: 'bold',
              },
            }}
          >
            <DayPicker
              mode="range"
              selected={activeRange}
              onSelect={(selected) => {
                if (selected) {
                  onChange(selected)
                  if (selected.from) setFromInput(format(selected.from, 'yyyy-MM-dd'))
                  if (selected.to) setToInput(format(selected.to, 'yyyy-MM-dd'))
                } else {
                  onChange(undefined)
                  setFromInput('')
                  setToInput('')
                }
                setOpen(false)
              }}
            />
          </Box>
        </VStack>
      </PopoverContent>
    </Popover>
  )
}
