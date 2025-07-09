'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Checkbox,
  Text,
  HStack,
  Select,
  useColorModeValue,
} from '@chakra-ui/react'
import { EditButton, DeleteButton, SaveButton, CancelButton } from '@/components/common/ActionButtons'
import { ColumnFilter } from '@/components/common/ColumnFilter'

type Props = {
  segmentNumber: number
  segmentName: string
  codeLength: number
  isAddingNew: boolean
  onAddComplete: () => void
  page: number
  pageSize: number
  onPageChange: (newPage: number) => void
  onTotalRowsChange: (count: number) => void
}

const moduleList = ['gl', 'ar', 'ap', 'fa', 'cost', 'cash']

export default function AccountTable({
  segmentNumber,
  segmentName,
  codeLength,
  isAddingNew,
  onAddComplete,
  page,
  pageSize,
  onTotalRowsChange,
}: Props) {
  const [data, setData] = useState<any[]>([])
  const [editId, setEditId] = useState<string | number | null>(null)
  const [editRow, setEditRow] = useState<any>(null)
  const [filterCode, setFilterCode] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterModules, setFilterModules] = useState('')

  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const headerColor = useColorModeValue('gray.600', 'gray.300')
  const tagBg = useColorModeValue('gray.200', 'blue.700')
  const tagText = useColorModeValue('gray.800', 'white')

    const filtered = data.filter(row =>
    row.code.includes(filterCode) &&
    row.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (row.active ? 'Active' : 'Inactive').toLowerCase().includes(filterStatus.toLowerCase()) &&
    Object.keys(row.modules).filter(k => row.modules[k]).join(',').toLowerCase().includes(filterModules.toLowerCase())
  )

  useEffect(() => {
  onTotalRowsChange(filtered.length)
  }, [filtered, onTotalRowsChange])

  useEffect(() => {
    if (isAddingNew) {
      const newRow = {
        id: `new-${Date.now()}`,
        code: '',
        name: '',
        active: true,
        modules: {
          gl: false,
          ar: false,
          ap: false,
          fa: false,
          cost: false,
          cash: false,
        },
      }
      setData(prev => [newRow, ...prev])
      setEditId(newRow.id)
      setEditRow(newRow)
      onAddComplete()
    }
  }, [isAddingNew, onAddComplete])

  const handleEdit = (row: any) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

const handleSave = async () => {
  setData(prev => prev.map(item => (item.id === editId ? editRow : item)))
  setEditId(null)

  const payload = {
    code: editRow.code,
    name: editRow.name,
    active: editRow.active,
    ...editRow.modules
  }

  const apiSegmentName = segmentName.toLowerCase().replace(/\s+/g, '_')
  const apiPath = `/api/segment${segmentNumber}_${apiSegmentName}`

  try {
    let res;
    if (String(editRow.id).startsWith('new')) {
      // NEW мөр бол POST
      res = await fetch(`http://localhost:5000${apiPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // EXISTING мөр бол PUT
      res = await fetch(`http://localhost:5000${apiPath}/${editRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (res.ok) {
      console.log('✅ Successfully saved to backend.')
    } else {
      console.error('❌ Server error:', res.status)
    }
  } catch (err) {
    console.error('❌ Fetch error:', err)
  }
  }

  const handleDelete = async (id: number) => {
    const apiSegmentName = segmentName.toLowerCase().replace(/\s+/g, '_')
    const apiPath = `/api/segment${segmentNumber}_${apiSegmentName}`

    setData(prev => prev.filter(item => item.id !== id))

    try {
      const res = await fetch(`http://localhost:5000${apiPath}/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        console.log('✅ Successfully deleted from backend.')
      } else {
        console.error('❌ Server DELETE error:', res.status)
      }
    } catch (err) {
      console.error('❌ Fetch DELETE error:', err)
    }
  }

  const toggleModule = (mod: string) => {
    setEditRow((prev: any) => ({
      ...prev,
      modules: { ...prev.modules, [mod]: !prev.modules[mod] },
    }))
  }

    // ✅ DB-ээс дата татаж оноох
  useEffect(() => {
    const fetchData = async () => {
      const apiSegmentName = segmentName.toLowerCase().replace(/\s+/g, '_')
      const apiPath = `/api/segment${segmentNumber}_${apiSegmentName}`
      
      try {
        const res = await fetch(`http://localhost:5000${apiPath}`)
        if (res.ok) {
          const json = await res.json()

          // DB-ээс ирсэн модулиудыг стандарт хэлбэрт хувиргана
          const processed = json.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            active: item.active,
            modules: {
              gl: item.gl,
              ar: item.ar,
              ap: item.ap,
              fa: item.fa,
              cost: item.cost,
              cash: item.cash,
            }
          }))

          setData(processed)
        } else {
          console.error('❌ Server GET error:', res.status)
        }
      } catch (err) {
        console.error('❌ Fetch GET error:', err)
      }
    }

    fetchData()
  }, [segmentNumber, segmentName])

  // useEffect(() => {
  //   onTotalRowsChange(filtered.length)
  // }, [filtered, onTotalRowsChange])

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <Box p={0} borderWidth="1px" borderRadius="md" overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead bg={useColorModeValue('gray.100', 'whiteAlpha.100')} borderBottomWidth="1px" borderColor="gray.600">
          {/* Header labels */}
          <Tr>
            <Th width="30px" textAlign="center" p={2} color={headerColor} fontSize="xs" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
              #
            </Th>
            <Th width="80px" p={2} textAlign="center" color={headerColor} fontSize="xs" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
              CODE
            </Th>
            <Th width="auto" p={2} textAlign="center" color={headerColor} fontSize="xs" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
              NAME
            </Th>
            <Th width="80px" p={2} textAlign="center" color={headerColor} fontSize="xs" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
              STATUS
            </Th>
            <Th width="auto" p={2} textAlign="center" color={headerColor} fontSize="xs" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
              MODULES
            </Th>
            <Th width="auto" p={2} textAlign="center" color={headerColor} fontSize="xs" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
              ACTION
            </Th>
          </Tr>
          {/* Filter inputs */}
          <Tr bg={useColorModeValue('gray.100', 'whiteAlpha.100')}>
            <Th p={0.8}></Th>
            <Th p={0.8}>
              <ColumnFilter value={filterCode} onChange={setFilterCode} placeholder="Filter code..." />
            </Th>
            <Th p={0.8}>
              <ColumnFilter value={filterName} onChange={setFilterName} placeholder="Filter name..." />
            </Th>
            <Th p={0.8}>
              <ColumnFilter value={filterStatus} onChange={setFilterStatus} placeholder="Filter status..." />
            </Th>
            <Th p={0.8}>
              <ColumnFilter value={filterModules} onChange={setFilterModules} placeholder="Filter modules..." />
            </Th>
            <Th p={0.8}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {paged.map((row, index) => (
            <Tr key={row.id} _hover={{ bg: hoverBg }}>
              <Td p={0} textAlign="center">{(page - 1) * pageSize + index + 1}</Td>
              <Td p={0} textAlign="center">
                {editId === row.id ? (
                  <Input
                    size="sm"
                    type="number"
                    value={editRow.code}
                    maxLength={codeLength}
                    onChange={e => setEditRow({ ...editRow, code: e.target.value })}
                  />
                ) : row.code}
              </Td>
              <Td p={0} >
                {editId === row.id ? (
                  <Input
                    size="sm"
                    value={editRow.name}
                    onChange={e => setEditRow({ ...editRow, name: e.target.value })}
                  />
                ) : row.name}
              </Td>
              <Td p={0} textAlign="center">
                {editId === row.id ? (
                  <Select
                    size="sm"
                    value={editRow.active ? 'Active' : 'Inactive'}
                    onChange={e =>
                      setEditRow({ ...editRow, active: e.target.value === 'Active' })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                ) : (
                  <Text fontSize="sm" color={row.active ? 'green.400' : 'red.400'}>
                    {row.active ? 'Active' : 'Inactive'}
                  </Text>
                )}
              </Td>
              <Td p={0} >
                {editId === row.id ? (
                  <HStack spacing={2} wrap="wrap">
                    {moduleList.map(mod => (
                      <Checkbox
                        key={mod}
                        isChecked={editRow.modules[mod]}
                        onChange={() => toggleModule(mod)}
                        colorScheme="blue"
                        size="sm"
                      >
                        {mod.toUpperCase()}
                      </Checkbox>
                    ))}
                  </HStack>
                ) : (
                  <HStack spacing={1} wrap="wrap">
                    {Object.entries(row.modules)
                      .filter(([_, val]) => val)
                      .map(([key]) => (
                        <Text
                          key={key}
                          fontSize="xs"
                          px={2}
                          py={0.5}
                          bg={tagBg}
                          color={tagText}
                          borderRadius="md"
                        >
                          {key.toUpperCase()}
                        </Text>
                      ))}
                  </HStack>
                )}
              </Td>
              <Td p={0} textAlign="center">
                {editId === row.id ? (
                  <>
                    <SaveButton size="sm" mr={2} onClick={handleSave} />
                    <CancelButton size="sm" onClick={() => setEditId(null)} />
                  </>
                ) : (
                  <>
                    <EditButton size="sm" mr={2} onClick={() => handleEdit(row)} />
                    <DeleteButton size="sm" onClick={() => handleDelete(row.id)} />
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
