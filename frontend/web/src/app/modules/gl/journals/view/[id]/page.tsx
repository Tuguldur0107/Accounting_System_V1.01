'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { HeaderTabsGL } from '@/components/gl/HeaderTabsGL'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DeleteButton } from '@/components/common/ActionButtons'
import SegmentAccountInput from '@/components/common/SegmentAccountInput'
import { JournalFooter } from '@/components/common/JournalFooter'
import { getJournal, updateJournal } from '../../services/journalsApi'

interface LineItem {
  account: string
  debit: number
  credit: number
  description: string
}

const formatNumber = (val: number) =>
  val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const parseNumber = (str: string) => {
  const num = parseFloat(str.replace(/,/g, ''))
  return isNaN(num) ? 0 : num
}

function FormattedNumberInput({
  value,
  disabled = false,
  onValueChange,
}: {
  value: number
  disabled?: boolean
  onValueChange: (num: number) => void
}) {
  const [display, setDisplay] = useState(formatNumber(value))

  useEffect(() => {
    setDisplay(formatNumber(value))
  }, [value])

  return (
    <Input
      value={display}
      onChange={(e) => setDisplay(e.target.value)}
      onBlur={() => {
        const num = parseNumber(display)
        onValueChange(num)
        setDisplay(formatNumber(num))
      }}
      isDisabled={disabled}
      textAlign="right"
      variant="unstyled"
      sx={{
        '::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
        '::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
        MozAppearance: 'textfield',
      }}
    />
  )
}

export default function JournalViewPage() {
  const router = useRouter()
  const { id } = useParams()
  const toast = useToast()

  const noop = () => {}

  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.300')
  const headerBg = useColorModeValue('gray.100', 'whiteAlpha.200')
  const rowHoverBg = useColorModeValue('gray.100', 'whiteAlpha.100')

  const [status, setStatus] = useState<'Draft' | 'Posted'>('Draft')
  const [date, setDate] = useState('')
  const [creationDate, setCreationDate] = useState('')
  const [journalNum, setJournalNum] = useState('')
  const [userName, setUserName] = useState('')
  const [module, setModule] = useState('GL')
  const [description, setDescription] = useState('')
  const [lines, setLines] = useState<LineItem[]>([])

  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(5)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const formatDate = (dateStr: string) =>
      dateStr ? new Date(dateStr).toISOString().slice(0, 10) : ''

    const fetchJournalData = async () => {
      try {
        const res = await getJournal(id as string)
        const { journal, lines } = res

        setStatus(journal.status === 'posted' ? 'Posted' : 'Draft')
        setDate(formatDate(journal.journal_date))
        setCreationDate(formatDate(journal.creation_date))
        setJournalNum(journal.journal_num || '')
        setUserName(journal.user_name || '')
        setModule(journal.module || '')
        setDescription(journal.description || '')

        setLines(
          lines.map((l: any) => ({
            account: l.account_code,
            debit: parseFloat(l.debit),
            credit: parseFloat(l.credit),
            description: l.description
          }))
        )
      } catch (err) {
        console.error(err)
        toast({
          title: 'Error',
          description: 'Failed to load journal data.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    }

    fetchJournalData()
  }, [id, toast])


  const pageCount = Math.ceil(lines.length / rowsPerPage)
  const pagedLines = lines.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0)
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0)
  const isBalanced = totalDebit === totalCredit
  const difference = Math.abs(totalDebit - totalCredit)

  const handleCancel = () => router.push('/modules/gl/journals')

  const handleDeleteLine = (idx: number) => {
    if (status === 'Draft') {
      setLines(lines.filter((_, i) => i !== idx))
    }
  }

  const handleAddLine = () => {
    if (status === 'Draft') {
      setLines([...lines, { account: '', debit: 0, credit: 0, description: '' }])
    }
  }

  const handleLineChange = (idx: number, field: keyof LineItem, value: any) => {
    if (status !== 'Draft') return
    const copy = [...lines]
    copy[idx] = { ...copy[idx], [field]: value }

    if (field === 'debit' && value > 0) copy[idx].credit = 0
    if (field === 'credit' && value > 0) copy[idx].debit = 0

    setLines(copy)
  }

  const handleSave = async (saveStatus: 'draft' | 'posted') => {
    if (status !== 'Draft') return

    if (saveStatus === 'posted' && !isBalanced) {
      toast({
        title: 'Balanced Error',
        description: 'Debit and Credit totals must be equal when posting.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    const cleanedLines = lines
      .filter(l => (l.debit || 0) > 0 || (l.credit || 0) > 0)
      .map(l => ({
        account_code: l.account,
        debit: l.debit,
        credit: l.credit,
        description: l.description
      }))

    try {
      await updateJournal(id as string, {
        journal: {
          journal_num: journalNum,
          transaction_date: date,
          creation_date: creationDate,
          module,
          description,
          status: saveStatus,
          total_dr: totalDebit,
          total_cr: totalCredit,
          user_name: userName,
          updated_by: userName
        },
        lines: cleanedLines
      })

      toast({
        title: saveStatus === 'draft' ? 'Draft Saved' : 'Posted',
        description: `Journal ${saveStatus === 'draft' ? 'saved as draft' : 'successfully posted'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/modules/gl/journals')
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to save journal.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <Box p={6}>
      <HeaderTabsGL />

      {/* Header */}
      <Box mb={6}>
        <Flex wrap="wrap" gap={6}>
          <Box>
            <Text fontWeight="bold">Date:</Text>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              isReadOnly={status === 'Posted'}
            />
          </Box>
          <Box>
            <Text fontWeight="bold">Creation Date:</Text>
            <Input type="date" value={creationDate} isReadOnly />
          </Box>
          <Box>
            <Text fontWeight="bold">Journal Num:</Text>
            <Input value={journalNum} isReadOnly />
          </Box>
          <Box>
            <Text fontWeight="bold">User Name:</Text>
            <Input value={userName} isReadOnly />
          </Box>
        </Flex>
      </Box>

      {/* Status / Module / Description */}
      <Box mb={6}>
        <Flex align="center" gap={4}>
          <Text fontWeight="bold" fontSize="lg">Status:</Text>
          <StatusBadge status={status} />
          <Text fontWeight="bold" fontSize="lg">Module:</Text>
          <Select
            w="auto"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            isDisabled={status === 'Posted'}
          >
            <option value="GL">GL</option>
            <option value="Cash/Bank">Cash</option>
            <option value="Receivables">AR</option>
            <option value="Payables">AP</option>
            <option value="Fixed Assets">FA</option>
          </Select>
          <Text fontWeight="bold">Description:</Text>
          <Input
            flex="1"
            placeholder="Journal Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isReadOnly={status === 'Posted'}
          />
        </Flex>
      </Box>

      {/* Journal Lines */}
      <Table
        variant="simple"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Thead bg={headerBg}>
          <Tr>
            {['#','ACCOUNT','DEBIT','CREDIT','DESCRIPTION','ACTION'].map((h, i) => (
              <Th
                key={i}
                px={3}
                py={2.5}
                textAlign={['DEBIT','CREDIT'].includes(h) ? 'right' : 'left'}
                width={
                  h === '#' ? '50px' :
                  h === 'ACCOUNT' ? '350px' :
                  h === 'DEBIT' || h === 'CREDIT' ? '120px' :
                  h === 'ACTION' ? '60px' :
                  h === 'DESCRIPTION' ? 'auto' : undefined
                }
                minWidth={h === 'DESCRIPTION' ? 'auto' : undefined}
                borderRight={i < 5 ? '1px solid' : undefined}
                borderColor={borderColor}
              >
                {h}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {pagedLines.map((ln, i) => (
            <Tr key={i} _hover={{ bg: rowHoverBg }}>
              <Td width="50px" px={3} py={1} >{(page - 1) * rowsPerPage + i + 1}</Td>
              <Td width="410px" px={0} py={0}>
                <SegmentAccountInput
                  defaultValue={ln.account}
                  onCodeChange={(newCode) => handleLineChange((page - 1) * rowsPerPage + i, 'account', newCode)}
                  isDisabled={status === 'Posted'}
                />
              </Td>
              <Td width="auto" px={3} py={1} >
                <FormattedNumberInput
                  value={ln.debit}
                  disabled={status === 'Posted' || ln.credit > 0}
                  onValueChange={(num) => handleLineChange((page - 1) * rowsPerPage + i, 'debit', num)}
                />
              </Td>
              <Td width="auto" px={3} py={1} >
                <FormattedNumberInput
                  value={ln.credit}
                  disabled={status === 'Posted' || ln.debit > 0}
                  onValueChange={(num) => handleLineChange((page - 1) * rowsPerPage + i, 'credit', num)}
                />
              </Td>
              <Td  width="auto" minWidth="250px" px={3} py={1} >
                <Input
                  variant="unstyled"
                  placeholder="Description"
                  value={ln.description}
                  onChange={(e) => handleLineChange((page - 1) * rowsPerPage + i, 'description', e.target.value)}
                  isReadOnly={status === 'Posted'}
                />
              </Td>
              <Td  width="60px" px={3} py={1} >
                <DeleteButton
                  onClick={() => handleDeleteLine((page - 1) * rowsPerPage + i)}
                  isDisabled={status === 'Posted'}
                />
              </Td>
            </Tr>
          ))}
          <Tr bg={headerBg}>
            <Td width="60px" px={3} py={1} colSpan={2} textAlign="right" fontWeight="regular" borderRight="1px solid" borderColor={borderColor}>
              SUM:
            </Td>
            <Td width="60px" px={3} py={1} textAlign="right">{formatNumber(totalDebit)}</Td>
            <Td width="60px" px={3} py={1}  textAlign="right">{formatNumber(totalCredit)}</Td>
            <Td colSpan={2} />
          </Tr>
        </Tbody>
      </Table>
      

      <JournalFooter
        isBalanced={isBalanced}
        difference={difference}
        onAddLine={status === 'Draft' ? handleAddLine : noop}
        onCancel={handleCancel}
        onSaveDraft={status === 'Draft' ? () => handleSave('draft') : noop}
        onPost={status === 'Draft' ? () => handleSave('posted') : noop}
        sidebarWidth={collapsed ? 70 : 250}
        pageControls={{
          page,
          pageCount,
          onPageChange: setPage
        }}
      />

    </Box>
  )
}
