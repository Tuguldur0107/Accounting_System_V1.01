'use client'

import { useState, useEffect } from 'react'
import { useColorMode } from '@chakra-ui/react'

type Segment = {
  segment: number
  name: string
  from: string
  to: string
  length: number
}

type Props = {
  onChange: (filters: Segment[]) => void
}

const DEFAULT_SEGMENTS: Segment[] = [
  { segment: 1, name: 'Company', from: '000', to: '999', length: 3 },
  { segment: 2, name: 'Cost Center', from: '000000', to: '999999', length: 6 },
  { segment: 3, name: 'Main Account', from: '00000000', to: '99999999', length: 8 },
  { segment: 4, name: 'Product/Service', from: '00', to: '99', length: 2 },
  { segment: 5, name: 'Project', from: '0000', to: '9999', length: 4 },
  { segment: 6, name: 'ICT', from: '000', to: '000', length: 3 },
  { segment: 7, name: 'RPT', from: '0000', to: '9999', length: 4 },
  { segment: 8, name: 'Cash Flow', from: '0000', to: '9999', length: 4 },
  { segment: 9, name: 'Module', from: '00', to: '99', length: 2 },
  { segment: 10, name: 'Future 2', from: '0', to: '0', length: 1 },
]

export function SegmentFilter({ onChange }: Props) {
  const [segments, setSegments] = useState<Segment[]>(DEFAULT_SEGMENTS)
  const { colorMode } = useColorMode()

  const textColor = colorMode === 'light' ? '#222' : '#f1f5f9'
  const borderColor = colorMode === 'light' ? '#ccc' : 'rgba(255, 255, 255, 0.15)'
  const inputBg = colorMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.15)'

  useEffect(() => {
    onChange(segments)
  }, [segments, onChange])

  const filterAndLimit = (value: string, length: number) => {
    return value.replace(/\D/g, '').slice(0, length)
  }

  return (
    <div
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: textColor,
          textAlign: 'center',
        }}
      >
        Segment Filters
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {segments.map((seg) => (
          <div
            key={seg.segment}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',

            }}
          >
            <span
              style={{
                fontSize: '12px',
                minWidth: '90px',
                color: textColor,
                fontWeight: '500',
              }}
            >
              {seg.name}
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              style={{
                width: '90px',
                padding: '2px 2px',
                borderRadius: '6px',
                border: `1px solid ${borderColor}`,
                backgroundColor: inputBg,
                color: textColor,
                fontSize: '13px',
                textAlign: 'right'
              }}
              placeholder="From"
              value={seg.from}
              onChange={(e) =>
                setSegments((prev) =>
                  prev.map((s) =>
                    s.segment === seg.segment
                      ? { ...s, from: filterAndLimit(e.target.value, seg.length) }
                      : s
                  )
                )
              }
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              style={{
                width: '90px',
                padding: '2px 2px',
                borderRadius: '6px',
                border: `1px solid ${borderColor}`,
                backgroundColor: inputBg,
                color: textColor,
                fontSize: '13px',
                textAlign: 'right'
              }}
              placeholder="To"
              value={seg.to}
              onChange={(e) =>
                setSegments((prev) =>
                  prev.map((s) =>
                    s.segment === seg.segment
                      ? { ...s, to: filterAndLimit(e.target.value, seg.length) }
                      : s
                  )
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}
