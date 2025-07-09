import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Box,
} from '@chakra-ui/react'
import { Filter } from 'lucide-react'
import { SegmentFilter } from '@/components/common/SegmentFilter'

type Props = {
  onChange: (val: { segment: number; from: string; to: string }[]) => void
  height?: string
}

export function SegmentFilterPopover({ onChange, height = 'auto' }: Props) {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Filter size={16} />}
          w="auto"
        >
          Segment Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="auto"
        maxH={height}
        bg="transparent"
        border="none"
        boxShadow="none"
        p={2}
      >
        <Box maxH="auto" overflowY="auto">
          <SegmentFilter onChange={onChange} />
        </Box>
      </PopoverContent>
    </Popover>
  )
}
