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
  data: any[] // Here we assume you're passing data as props
}

export function TransactionDetailTable({
  dateRange,
  // ptdYtd,
  page,
  pageCount,
  onPageChange,
  data
}: Props) {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')

  // Pagination logic: Slice data for current page
  const pageSize = 10 // Number of rows per page
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize)

  const [filterDate, setFilterDate] = useState('')
  const [filterJournalId, setFilterJournalId] = useState('')
  const [filterModule, setFilterModule] = useState('')
  const [filterAccountCode, setFilterAccountCode] = useState('')
  const [filterAccountName, setFilterAccountName] = useState('')
  const [filterDebit, setFilterDebit] = useState('')
  const [filterCredit, setFilterCredit] = useState('')
  const [filterDescription, setFilterDescription] = useState('')
  const [filterUserId, setFilterUserId] = useState('')
  const [filterUserName, setFilterUserName] = useState('')

  const filteredData = pagedData.filter((item) => {
    return (
      item.date.toLowerCase().includes(filterDate.toLowerCase()) &&
      item.journalId.toLowerCase().includes(filterJournalId.toLowerCase()) &&
      item.module.toLowerCase().includes(filterModule.toLowerCase()) &&
      item.accountCode.toLowerCase().includes(filterAccountCode.toLowerCase()) &&
      item.accountName.toLowerCase().includes(filterAccountName.toLowerCase()) &&
      item.debit.toString().includes(filterDebit) &&
      item.credit.toString().includes(filterCredit) &&
      item.description.toLowerCase().includes(filterDescription.toLowerCase()) &&
      item.userId.toLowerCase().includes(filterUserId.toLowerCase()) &&
      item.userName.toLowerCase().includes(filterUserName.toLowerCase())
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
        minWidth="1400px"
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
            <Th w="120px" textAlign="center">Date</Th>
            <Th w="130px" textAlign="center">Journal ID</Th>
            <Th w="100px" textAlign="center">Module</Th>
            <Th w="300px" textAlign="center">Account Code</Th>
            <Th w="200px" textAlign="center">Account Name</Th>
            <Th w="150px" textAlign="center">Debit</Th>
            <Th w="150px" textAlign="center">Credit</Th>
            <Th w="300px" textAlign="center">Description</Th>
            <Th w="120px" textAlign="center">User ID</Th>
            <Th w="150px" textAlign="center">User Name</Th>
          </Tr>
          <Tr>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterDate} onChange={setFilterDate} placeholder="Filter by Date" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterJournalId} onChange={setFilterJournalId} placeholder="Filter by Journal ID" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterModule} onChange={setFilterModule} placeholder="Filter by Module" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterAccountCode} onChange={setFilterAccountCode} placeholder="Filter by Account Code" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterAccountName} onChange={setFilterAccountName} placeholder="Filter by Account Name" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterDebit} onChange={setFilterDebit} placeholder="Filter by Debit" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterCredit} onChange={setFilterCredit} placeholder="Filter by Credit" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterDescription} onChange={setFilterDescription} placeholder="Filter by Description" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterUserId} onChange={setFilterUserId} placeholder="Filter by User ID" />
            </Th>
            <Th py={0.8} textAlign="center">
              <ColumnFilter value={filterUserName} onChange={setFilterUserName} placeholder="Filter by User Name" />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((item) => (
            <Tr key={item.id} _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.200') }}>
              <Td>{item.date}</Td>
              <Td>{item.journalId}</Td>
              <Td>{item.module}</Td>
              <Td>{item.accountCode}</Td>
              <Td>{item.accountName}</Td>
              <Td>{item.debit}</Td>
              <Td>{item.credit}</Td>
              <Td>{item.description}</Td>
              <Td>{item.userId}</Td>
              <Td>{item.userName}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
