'use client'

import { ButtonGroup, Button } from '@chakra-ui/react'

type Props = {
  value: 'PTD' | 'YTD'
  onChange: (value: 'PTD' | 'YTD') => void
}

export function PTDYTDToggle({ value, onChange }: Props) {
  return (
    <ButtonGroup isAttached size="sm" variant="outline">
      <Button
        colorScheme={value === 'PTD' ? 'blue' : undefined}
        onClick={() => onChange('PTD')}
      >
        PTD
      </Button>
      <Button
        colorScheme={value === 'YTD' ? 'blue' : undefined}
        onClick={() => onChange('YTD')}
      >
        YTD
      </Button>
    </ButtonGroup>
  )
}
