'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { createJournal } from '../services/journalsApi'
import { v4 as uuidv4 } from 'uuid';

interface LineItem {
  account: string
  debit: number
  credit: number
  description: string
}

// --- Format and parse helpers ---
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

export default function NewJournalPage() {
  const router = useRouter()
  const toast = useToast()

  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.300')
  const headerBg = useColorModeValue('gray.100', 'whiteAlpha.200')
  const rowHoverBg = useColorModeValue('gray.100', 'whiteAlpha.100')

  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [creationDate] = useState(today)
  const [journalNum] = useState('JRN-000142')
  const [userName] = useState('11111111-1111-1111-1111-111111111111')
  const [status] = useState<'Draft' | 'Posted'>('Draft')
  const [module, setModule] = useState('GL')
  const [description, setDescription] = useState('')
  const newId = uuidv4();

  useEffect(() => {
  setDate(new Date().toISOString().slice(0, 10))
  setModule('GL')
  setDescription('')
  setLines([
    { account: '', debit: 0, credit: 0, description: '' },
    { account: '', debit: 0, credit: 0, description: '' },
  ])
  }, [])

  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [rowsPerPage] = useState(5)

  const [lines, setLines] = useState<LineItem[]>([
    { account: '', debit: 0, credit: 0, description: '' },
    { account: '', debit: 0, credit: 0, description: '' },
  ])
  

  
  useEffect(() => {
    setPageCount(Math.ceil(lines.length / rowsPerPage))
  }, [lines, rowsPerPage])

  const pagedLines = lines.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const handleLineChange = (idx: number, field: keyof LineItem, value: any) => {
    const copy = [...lines]
    copy[idx] = { ...copy[idx], [field]: value }

    if (field === 'debit' && value > 0) copy[idx].credit = 0
    if (field === 'credit' && value > 0) copy[idx].debit = 0

    setLines(copy)
  }

  const handleAddLine = () =>
    setLines([...lines, { account: '', debit: 0, credit: 0, description: '' }])

  const handleDeleteLine = (idx: number) =>
    setLines(lines.filter((_, i) => i !== idx))

  const totalDebit = lines.reduce((s, x) => s + (x.debit || 0), 0)
  const totalCredit = lines.reduce((s, x) => s + (x.credit || 0), 0)

  const isBalanced = totalDebit === totalCredit
  const difference = Math.abs(totalDebit - totalCredit)

  const [collapsed, setCollapsed] = useState(false);

  // ✅ ✅ ✅ Main Save function

const handleSave = async (saveStatus: 'draft' | 'posted') => {
  if (!isBalanced && saveStatus === 'posted') {
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
    await createJournal({
      journal: {
        id: newId, // ✅ UUID
        journal_num: journalNum, // ✅ Таны UI дээрх JRN-000142
        tenant_id: '22222222-2222-2222-2222-222222222222',
        company_id: '33333333-3333-3333-3333-333333333333',
        journal_date: date,
        creation_date: creationDate,
        module,
        description,
        status: saveStatus,
        total_dr: totalDebit,
        total_cr: totalCredit,
        user_name: userName,
        created_by: userName
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


  const handleCancel = () => {
    router.push('/modules/gl/journals')
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
          <Text fontWeight="bold " fontSize="lg">Status:</Text>
          <StatusBadge status={status} />
          <Text fontWeight="bold" fontSize="lg">Module:</Text>
          <Select
            w="auto"
            value={module}
            onChange={(e) => setModule(e.target.value)}
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
                  h === 'ACCOUNT' ? '180px' :
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
              <Td width="50px" px={3} py={1} borderRight="1px solid" borderColor={borderColor}>
                {(page - 1) * rowsPerPage + i + 1}
              </Td>

              <Td width="410px" px={0} py={0} borderRight="1px solid" borderColor={borderColor}>
                <SegmentAccountInput
                  defaultValue={ln.account}
                  onCodeChange={(newCode) => handleLineChange((page - 1) * rowsPerPage + i, 'account', newCode)}
                />
              </Td>

              <Td width="auto" px={3} py={1} borderRight="1px solid" borderColor={borderColor}>
                <FormattedNumberInput
                  value={ln.debit}
                  disabled={ln.credit > 0}
                  onValueChange={(num) => handleLineChange((page - 1) * rowsPerPage + i, 'debit', num)}
                />
              </Td>

              <Td width="auto" px={3} py={1} borderRight="1px solid" borderColor={borderColor}>
                <FormattedNumberInput
                  value={ln.credit}
                  disabled={ln.debit > 0}
                  onValueChange={(num) => handleLineChange((page - 1) * rowsPerPage + i, 'credit', num)}
                />
              </Td>

              <Td width="auto" minWidth="250px" px={3} py={1} borderRight="1px solid" borderColor={borderColor}>
                <Input
                  variant="unstyled"
                  placeholder="Description"
                  value={ln.description}
                  onChange={(e) => handleLineChange((page - 1) * rowsPerPage + i, 'description', e.target.value)}
                />
              </Td>

              <Td width="60px" px={3} py={1} borderLeft="1px solid" borderColor={borderColor}>
                <DeleteButton onClick={() => handleDeleteLine((page - 1) * rowsPerPage + i)} />
              </Td>
            </Tr>
          ))}
          <Tr bg={headerBg}>
            <Td colSpan={2} textAlign="right" fontWeight="regular" borderRight="1px solid" borderColor={borderColor}>
              SUM:
            </Td>
            <Td textAlign="right">{formatNumber(totalDebit)}</Td>
            <Td textAlign="right">{formatNumber(totalCredit)}</Td>
            <Td colSpan={2} />
          </Tr>
        </Tbody>
      </Table>

      <JournalFooter
        isBalanced={isBalanced}
        difference={difference}
        onAddLine={handleAddLine}
        onCancel={handleCancel}
        onSaveDraft={() => handleSave('draft')}
        onPost={() => handleSave('posted')}
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
