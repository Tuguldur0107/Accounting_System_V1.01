'use client'

import { useState } from 'react'
import {
  Box,
  HStack,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { HeaderTabsGL } from '@/components/gl/HeaderTabsGL'
import AccountTable from '@/components/gl/AccountTable'
import { NewButton } from '@/components/common/headerButton'
import { PaginationFooter } from '@/components/common/PaginationFooter'

const segmentOptions = [
  { key: 1, label: 'Company', codeLength: 3 },
  { key: 2, label: 'Cost Center', codeLength: 6 },
  { key: 3, label: 'Main Account', codeLength: 8 },
  { key: 4, label: 'Product_Service', codeLength: 2 },
  { key: 5, label: 'Project', codeLength: 4 },
  { key: 6, label: 'Inter Company', codeLength: 3 },
  { key: 7, label: 'Related Party', codeLength: 4 },
  { key: 8, label: 'Cash Flow', codeLength: 4 },
  { key: 9, label: 'Modules', codeLength: 2 },
  { key: 10, label: 'Reserve', codeLength: 1 },
]

export default function ChartOfAccountsPage() {
  const [selectedSegment, setSelectedSegment] = useState(segmentOptions[2])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [page, setPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)

  const pageSize = 20
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleNew = () => setIsAddingNew(true)

  const glassBg = useColorModeValue('rgba(255,255,255,0.6)', 'rgba(26,32,44,0.5)')
  const hoverBg = useColorModeValue('rgba(255,255,255,0.75)', 'rgba(45,55,72,0.65)')
  const borderClr = useColorModeValue('gray.300', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900')

  return (
    <Box p={6}>
      <HeaderTabsGL
        right={
          <HStack spacing={2} align="center">
            <Popover
              placement="bottom-start"
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
            >
              <PopoverTrigger>
                <Button
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                  bg={'transparent'}
                  color={textColor}
                  border="1px solid"
                  borderColor={borderClr}
                  backdropFilter="blur(8px)"
                  _hover={{
                    bg: hoverBg,
                    borderColor: 'blue.300',
                  }}
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px #4299e1',
                  }}
                >
                  {selectedSegment.label}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                bg={'transparent'}
                backdropFilter="blur(8px)"
                borderColor={borderClr}
                maxW="160px"
                p={0}
              >
                <PopoverBody>
                  <VStack align="stretch" spacing={1}>
                    {segmentOptions.map((seg) => (
                      <Button
                        key={seg.key}
                        variant="ghost"
                        size="sm"
                        justifyContent="flex-start"
                        bg="transparent"
                        color={textColor}
                        _hover={{ bg: hoverBg }}
                        onClick={() => {
                          setSelectedSegment(seg)
                          setPage(1) // segment солиход page 1 болгоно
                          onClose()
                        }}
                      >
                        {seg.label}
                      </Button>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <NewButton onClick={handleNew} />
          </HStack>
        }
      />

      <Box mt={4}>
        <AccountTable
          segmentNumber={selectedSegment.key}
          segmentName={selectedSegment.label}
          codeLength={selectedSegment.codeLength}
          isAddingNew={isAddingNew}
          onAddComplete={() => setIsAddingNew(false)}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onTotalRowsChange={setTotalRows}
        />
      </Box>

      <Box mt={4}>
        <PaginationFooter
          pageControls={{
            page,
            pageCount,
            onPageChange: setPage,
          }}
        />
      </Box>
    </Box>
  )
}
