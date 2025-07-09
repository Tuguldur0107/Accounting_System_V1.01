'use client'

import { useState } from 'react'
import CalendarSingle from '@/components/common/CalendarSingle'
import { HeaderTabsGL } from '@/components/gl/HeaderTabsGL'
import { Box, Heading, Text } from '@chakra-ui/react'
import { FindButton } from '@/components/common/headerButton'

export default function GLDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleFind = () => {
    if (selectedDate) {
      console.log('🔍 Date selected:', selectedDate.toISOString())
      // Цаашдаа тайлан/гүйлгээ фильтерлэх логик энд нэмнэ
    }
  }

  return (
    <Box p={6}>
      <HeaderTabsGL
        right={
          <Box display="flex" alignItems="center" gap={2}>
            <CalendarSingle date={selectedDate} onChange={setSelectedDate} />
            <FindButton onClick={handleFind} />
          </Box>
        }
      />

      <Heading size="md" mt={6}>
        GL Dashboard
      </Heading>
      <Text mt={2} fontSize="sm" color="gray.500">
        Сонгосон огноо: {selectedDate ? selectedDate.toLocaleDateString() : 'Байхгүй'}
      </Text>
    </Box>
  )
}
