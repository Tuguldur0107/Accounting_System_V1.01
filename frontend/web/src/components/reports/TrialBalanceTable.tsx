'use client'

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue
} from '@chakra-ui/react'
import { DateRange } from 'react-day-picker'
import { ColumnFilter } from '@/components/common/ColumnFilter'
import { useState } from 'react'

type Props = {
  dateRange: DateRange | undefined
  // ptdYtd: 'PTD' | 'YTD'
  page: number
  pageCount: number
  onPageChange: (newPage: number) => void
  data: any[]
}

export function TrialBalanceTable({
  dateRange,
  // ptdYtd,
  page,
  pageCount,
  onPageChange,
  data
}: Props) {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')

  // Pagination logic
  const pageSize = 10
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize)

  // FILTER STATES
  const [filterCode, setFilterCode] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterOpening, setFilterOpening] = useState('')
  const [filterDebit, setFilterDebit] = useState('')
  const [filterCredit, setFilterCredit] = useState('')
  const [filterEnding, setFilterEnding] = useState('')

  const filteredData = pagedData.filter((item) => {
    return (
      (item.accountCode?.toLowerCase() ?? '').includes(filterCode.toLowerCase()) &&
      (item.accountName?.toLowerCase() ?? '').includes(filterName.toLowerCase()) &&
      (item.openingBalance?.toString() ?? '').includes(filterOpening) &&
      (item.debit?.toString() ?? '').includes(filterDebit) &&
      (item.credit?.toString() ?? '').includes(filterCredit) &&
      (item.endingBalance?.toString() ?? '').includes(filterEnding)
    )
  })

  return (
    <Box
      overflowX="auto"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      w="100%"
    >
      <Table
        variant="simple"
        size="sm"
        minWidth="1200px"
        sx={{
          'th, td': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        <Thead bg={useColorModeValue('gray.100', 'whiteAlpha.100')}>
          <Tr>
            <Th w="250px" textAlign="center">Account Code</Th>
            <Th w="250px" textAlign="center">Account Name</Th>
            <Th w="180px" textAlign="center">Opening Balance</Th>
            <Th w="150px" textAlign="center">Debit</Th>
            <Th w="150px" textAlign="center">Credit</Th>
            <Th w="180px" textAlign="center">Ending Balance</Th>
          </Tr>
          <Tr>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterCode} onChange={setFilterCode} placeholder="Filter by Code" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterName} onChange={setFilterName} placeholder="Filter by Name" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterOpening} onChange={setFilterOpening} placeholder="Filter" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterDebit} onChange={setFilterDebit} placeholder="Filter" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterCredit} onChange={setFilterCredit} placeholder="Filter" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterEnding} onChange={setFilterEnding} placeholder="Filter" />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((item, idx) => (
            <Tr key={idx} _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.200') }}>
              <Td>{item.accountCode}</Td>
              <Td>{item.accountName}</Td>
              <Td textAlign="right">{item.openingBalance}</Td>
              <Td textAlign="right">{item.debit}</Td>
              <Td textAlign="right">{item.credit}</Td>
              <Td textAlign="right">{item.endingBalance}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
