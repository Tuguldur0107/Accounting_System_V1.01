'use client'

import { useState } from 'react'
import { format, parse } from 'date-fns'
import { CalendarIcon } from '@chakra-ui/icons'
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
} from '@chakra-ui/react'
import { DayPicker } from 'react-day-picker'
import { enUS } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'

type Props = {
  date: Date | undefined
  onChange: (date: Date | undefined) => void
}

export default function CalendarSingle({ date, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const { colorMode } = useColorMode()

  // Default to today if no date
  const today = new Date()
  const [inputValue, setInputValue] = useState(
    date ? format(date, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd')
  )

  const bg = useColorModeValue('white', 'gray.800')
  const border = useColorModeValue('gray.200', 'gray.600')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputValue.length === 10) {
        const parsed = parse(inputValue, 'yyyy-MM-dd', new Date())
        if (!isNaN(parsed.getTime())) {
          onChange(parsed)
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
          {date ? format(date, 'yyyy-MM-dd') : 'Select date'}
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
          <Input
            size="sm"
            w="300px"
            placeholder="yyyy-MM-dd"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />

          <Box
            sx={{
              '.rdp': {
                backgroundColor: 'transparent',
                color: colorMode === 'light' ? 'black' : 'white',
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
                borderColor: colorMode === 'light' ? 'blue.400' : 'blue.200',
              },
              '.rdp-caption_label': {
                fontWeight: 'bold',
              },
            }}
          >
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(selected) => {
                if (selected) {
                  onChange(selected)
                  setInputValue(format(selected, 'yyyy-MM-dd'))
                  setOpen(false)
                }
              }}
              locale={enUS}
              modifiersClassNames={{ selected: 'rdp-day_selected' }}
            />
          </Box>
        </VStack>
      </PopoverContent>
    </Popover>
  )
}
