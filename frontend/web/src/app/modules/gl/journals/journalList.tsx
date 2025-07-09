'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  HStack,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { DateRange } from 'react-day-picker'
import { ViewButton, DeleteButton } from '@/components/common/ActionButtons'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PaginationFooter } from '@/components/common/PaginationFooter'
import { listJournals, deleteJournal } from './services/journalsApi'

type Props = {
  range?: DateRange
}

type Journal = {
  id: string
  journal_num: string
  journal_date: string
  module: string
  description: string
  status: string
  total_dr: number | string
  total_cr: number | string
}

type ColFilter = {
  num: string
  date: string
  module: string
  description: string
  debit: string
  credit: string
  status: string
}

export function JournalList({ range }: Props) {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')
  const toast = useToast()

  const [data, setData] = useState<Journal[]>([])
  const [filters, setFilters] = useState<ColFilter>({
    num: '',
    date: '',
    module: '',
    description: '',
    debit: '',
    credit: '',
    status: '',
  })
  const [page, setPage] = useState(1)
  const pageSize = 19

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listJournals()
        setData(res)
      } catch (err) {
        console.error(err)
        toast({
          title: 'Error',
          description: 'Failed to load journals.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    }
    fetchData()
  }, [range])

  const handleFilterChange =
    (field: keyof ColFilter) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFilters(f => ({ ...f, [field]: e.target.value }))

  const filtered = data
    .filter(j => {
      if (!range?.from || !range?.to) return true
      const d = new Date(j.journal_date)
      return d >= range.from && d <= range.to
    })
    .filter(j => j.journal_num?.toLowerCase().includes(filters.num.toLowerCase()))
    .filter(j => j.journal_date?.includes(filters.date))
    .filter(j => j.module?.toLowerCase().includes(filters.module.toLowerCase()))
    .filter(j => j.description?.toLowerCase().includes(filters.description.toLowerCase()))
    .filter(j => `${j.total_dr ?? ''}`.includes(filters.debit))
    .filter(j => `${j.total_cr ?? ''}`.includes(filters.credit))
    .filter(j => j.status?.toLowerCase().includes(filters.status.toLowerCase()))

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const parseNumber = (val: number | string | undefined) => {
    if (val === undefined || val === null) return 0
    if (typeof val === 'string') return parseFloat(val) || 0
    return val
  }

  const totalDebitPage = paged.reduce((sum, j) => sum + parseNumber(j.total_dr), 0)
  const totalCreditPage = paged.reduce((sum, j) => sum + parseNumber(j.total_cr), 0)
  const totalDebitAll = filtered.reduce((sum, j) => sum + parseNumber(j.total_dr), 0)
  const totalCreditAll = filtered.reduce((sum, j) => sum + parseNumber(j.total_cr), 0)

  const handleDelete = async (id: string) => {
    try {
      await deleteJournal(id)
      setData(prev => prev.filter(j => j.id !== id))
      toast({
        title: 'Deleted',
        description: 'Journal successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to delete journal.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const formatDate = (str: string) => {
    const d = new Date(str)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const formatCurrency = (val: number | string | undefined) => {
    if (val === undefined || val === null) return '-'
    const num = typeof val === 'string' ? parseFloat(val) : val
    if (isNaN(num)) return '-'
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Box overflowX="auto" border="1px solid" borderColor={borderColor} borderRadius="lg">
      <Table variant="simple" size="sm" fontSize="xs">
        <Thead bg={useColorModeValue('gray.100', 'whiteAlpha.100')}>
          <Tr>
            <Th>#</Th>
            <Th>Journal Num</Th>
            <Th>Date</Th>
            <Th>Module</Th>
            <Th>Description</Th>
            <Th isNumeric>Dr</Th>
            <Th isNumeric>Cr</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
          <Tr>
            <Th />
            <Th>
              <Input value={filters.num} onChange={handleFilterChange('num')} placeholder="Filter Num" size="xs" variant="filled" />
            </Th>
            <Th>
              <Input type="date" value={filters.date} onChange={handleFilterChange('date')} size="xs" variant="filled" />
            </Th>
            <Th>
              <Input value={filters.module} onChange={handleFilterChange('module')} placeholder="Filter Module" size="xs" variant="filled" />
            </Th>
            <Th>
              <Input value={filters.description} onChange={handleFilterChange('description')} placeholder="Filter Description" size="xs" variant="filled" />
            </Th>
            <Th isNumeric>
              <Input value={filters.debit} onChange={handleFilterChange('debit')} placeholder="Filter Dr" size="xs" variant="filled" />
            </Th>
            <Th isNumeric>
              <Input value={filters.credit} onChange={handleFilterChange('credit')} placeholder="Filter Cr" size="xs" variant="filled" />
            </Th>
            <Th>
              <Input value={filters.status} onChange={handleFilterChange('status')} placeholder="Filter Status" size="xs" variant="filled" />
            </Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {paged.map((j, idx) => (
            <Tr key={j.id} _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.200') }}>
              <Td textAlign="center">{(page - 1) * pageSize + idx + 1}</Td>
              <Td>{j.journal_num}</Td>
              <Td textAlign="center">{formatDate(j.journal_date)}</Td>
              <Td textAlign="center">{j.module}</Td>
              <Td>{j.description}</Td>
              <Td isNumeric>{formatCurrency(j.total_dr)}</Td>
              <Td isNumeric>{formatCurrency(j.total_cr)}</Td>
              <Td textAlign="center">
                <StatusBadge status={j.status} />
              </Td>
              <Td textAlign="center">
                <HStack spacing={1}>
                  <ViewButton href={`/modules/gl/journals/view/${j.id}`} />
                  <DeleteButton onClick={() => handleDelete(j.id)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot bg={useColorModeValue('gray.50', 'whiteAlpha.100')}>
          <Tr>
            <Th colSpan={5} textAlign="right">Sum (Page):</Th>
            <Th isNumeric>{formatCurrency(totalDebitPage)}</Th>
            <Th isNumeric>{formatCurrency(totalCreditPage)}</Th>
            <Th colSpan={2} />
          </Tr>
          <Tr>
            <Th colSpan={5} textAlign="right">Sum (Filtered):</Th>
            <Th isNumeric>{formatCurrency(totalDebitAll)}</Th>
            <Th isNumeric>{formatCurrency(totalCreditAll)}</Th>
            <Th colSpan={2} />
          </Tr>
        </Tfoot>
      </Table>
      <PaginationFooter
        pageControls={{
          page,
          pageCount,
          onPageChange: setPage
        }}
      />
    </Box>
  )
}
