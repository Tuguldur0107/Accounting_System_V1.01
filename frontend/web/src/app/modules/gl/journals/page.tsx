// modules/gl/journals/page.tsx

'use client'

import React, { useState } from 'react'
import { Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { HeaderTabsGL } from '@/components/gl/HeaderTabsGL'
import CalendarRange from '@/components/common/CalendarRange'
import { NewButton } from '@/components/common/headerButton'
import { JournalList } from './journalList'
import { DateRange } from 'react-day-picker'
import FocusReset from '@/components/FocusReset'  // ✅ нэмсэн

export default function JournalEntriesPage() {
  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [range, setRange] = useState<DateRange | undefined>({
    from: firstOfMonth,
    to: today
  })


  const router = useRouter()

  const handleNew = () => {
    router.push('/modules/gl/journals/new')
  }

  return (
    <Box p={6}>
      <FocusReset />
      <HeaderTabsGL
        right={
          <HStack spacing={2}>
            <CalendarRange range={range} onChange={setRange} />
            <NewButton onClick={handleNew} />
          </HStack>
        }
      />
      <JournalList range={range} />
    </Box>
  )
}

