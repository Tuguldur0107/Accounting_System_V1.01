'use client'

import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { Filter } from 'lucide-react'
import { SegmentFilter } from '@/components/common/SegmentFilter'

type Props = {
  onChange: (val: { segment: number; from: string; to: string }[]) => void
  height?: string
}

export function SegmentFilterMenu({ onChange, height = 'auto' }: Props) {
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Menu placement="bottom-start" isLazy>
      <MenuButton
        as={Button}
        size="sm"
        variant="outline"
        leftIcon={<Filter size={16} />}
        w="auto"
      >
        Segment Filter
      </MenuButton>
      <MenuList
        w="auto"
        maxH={height}
        border="none"
        boxShadow="none"
        p={0}
      >
        <Box p={2}>
          <SegmentFilter onChange={onChange} />
        </Box>
      </MenuList>
    </Menu>
  )
}
