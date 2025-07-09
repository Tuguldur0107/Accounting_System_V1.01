'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { HeaderTabsGL } from '@/components/gl/HeaderTabsGL'
import CalendarRange from '@/components/common/CalendarRange'
import { PTDYTDToggle } from '@/components/common/PTDYTDToggle'
import { SegmentFilterPopover } from '@/components/common/SegmentFilterPopover'
import { TransactionDetailTable } from '@/components/reports/TransactionDetailTable'
import { TrialBalanceTable } from '@/components/reports/TrialBalanceTable'
import { PaginationFooter } from '@/components/common/PaginationFooter'
import { DateRange } from 'react-day-picker'
import { FindButton } from '@/components/common/headerButton'

export default function GLReportsPage() {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')

  // Filter states
  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstOfMonth,
    to: today
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range)
    } else {
      setDateRange(undefined)
    }
  }


  // const [ptdYtd, setPtdYtd] = useState<'PTD' | 'YTD'>('PTD')
  const [segmentFilters, setSegmentFilters] = useState<
    { segment: number; from: string; to: string }[]
  >([])

  const [activeTab, setActiveTab] = useState(0)

  // Pagination states
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [data, setData] = useState<any[]>([])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleFind = () => {
    console.log('🔍 Find clicked')
    // TODO: Add filtering logic here
  }

  const reportTabStyle = {
    px: 5,
    py: 1,
    borderRadius: 'lg',
    fontWeight: 'semibold',
    _selected: {
      bg: 'blue.600',
      color: 'white',
    },
    _hover: {
      bg: 'blue.100',
      color: 'blue.800',
    },
  }

  useEffect(() => {
    // Here we simulate fetching data from an API
    fetchData()
  }, [])

  const fetchData = async () => {
    // Simulate an API call to fetch data
    const response = [
      { id: 1, date: '2025-06-28', journalId: 'JRNL-0001', module: 'Cash', accountCode: '101.000000...', accountName: 'Cash Account', debit: 1000000, credit: 0, description: 'Бараа материал орлого', userId: 'U123', userName: 'Nyamdorj' },
      { id: 2, date: '2025-06-29', journalId: 'JRNL-0002', module: 'AR', accountCode: '102.000000...', accountName: 'Accounts Receivable', debit: 200000, credit: 0, description: 'Нийт орлого', userId: 'U124', userName: 'Batjargal' },
      // Add more records here
    ]

    setData(response)

    // Calculate the total number of pages
    const pageSize = 10
    const totalPages = Math.ceil(response.length / pageSize)
    setPageCount(totalPages)
  }

  return (
    <Box
      p={6}
      w="100%"
      minW="1200px"
      overflowX="auto"
      overflowY="hidden"
    >
      <HeaderTabsGL
        right={
          <HStack spacing={2}>
            <CalendarRange range={dateRange} onChange={setDateRange} />
            {/* <PTDYTDToggle value={ptdYtd} onChange={setPtdYtd} /> */}
            <SegmentFilterPopover onChange={setSegmentFilters} />
            <FindButton onClick={handleFind} />
          </HStack>
        }
      />

      <Tabs
        variant="unstyled"
        index={activeTab}
        onChange={setActiveTab}
        w="100%"
      >
        <TabList gap={2}>
          <Tab {...reportTabStyle}>Transaction Detail</Tab>
          <Tab {...reportTabStyle}>Trial Balance</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Box overflowX="auto" overflowY="hidden" w="100%">
              <TransactionDetailTable
                dateRange={dateRange}
                // ptdYtd={ptdYtd}
                page={page}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                data={data}
              />
            </Box>
          </TabPanel>

          <TabPanel p={0}>
            <Box overflowX="auto" overflowY="hidden" w="100%">
            <TrialBalanceTable
                dateRange={dateRange}
                // ptdYtd={ptdYtd}
                page={page}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                data={data}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Pagination Footer */}
      <Box
        mt={4}
        overflowX="auto"
        overflowY="hidden"
        w="100%"
      >
        <PaginationFooter
          pageControls={{
            page,
            pageCount,
            onPageChange: handlePageChange,
          }}
        />
      </Box>
    </Box>
  )
}
