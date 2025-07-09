import {
  Box,
  Flex,
  Button,
  Text,
  VStack,
  Divider,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  Banknote,
  Wallet,
  Landmark,
  BarChart,
  Boxes,
  Building2,
  Users,
  Settings,
  User,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

const sidebarMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/modules/Dashboard', matchPrefix: '/modules/Dashboard', group: 'main' },
  { label: 'General Ledger', icon: FileText, href: '/modules/gl/gl_dashboard', matchPrefix: '/modules/gl/', group: 'main' },
  { label: 'Cash/Bank', icon: Banknote, href: '/modules/cash', matchPrefix: '/modules/cash', group: 'main' },
  { label: 'Receivables', icon: Wallet, href: '/modules/ar', matchPrefix: '/modules/ar', group: 'main' },
  { label: 'Payables', icon: Landmark, href: '/modules/ap', matchPrefix: '/modules/ap', group: 'main' },
  { label: 'Cost', icon: BarChart, href: '/modules/cost', matchPrefix: '/modules/cost', group: 'main' },
  { label: 'Inventory', icon: Boxes, href: '/modules/inventory', matchPrefix: '/modules/inventory', group: 'main' },
  { label: 'Fixed Assets', icon: Building2, href: '/modules/fa', matchPrefix: '/modules/fa', group: 'main' },
  { label: 'Payroll', icon: Users, href: '/modules/payroll', matchPrefix: '/modules/payroll', group: 'main' },
  { label: 'Reports', icon: FileText, href: '/modules/reports', matchPrefix: '/modules/reports', group: 'system' },
  { label: 'Master Data', icon: Settings, href: '/modules/settings', matchPrefix: '/modules/settings', group: 'system' },
  { label: 'User Profile', icon: User, href: '/modules/profile', matchPrefix: '/modules/profile', group: 'system' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const bg = useColorModeValue('gray.100', 'linear-gradient(to bottom,rgb(44, 54, 84),rgb(1, 8, 28))')
  const hoverBg = useColorModeValue('gray.200', 'rgba(255, 255, 255, 0.5)')
  const textColor = useColorModeValue('gray.800', 'white')
  const inactiveColor = useColorModeValue('gray.700', 'rgba(255, 255, 255, 0.8)')
  const borderColor = useColorModeValue('gray.300', 'rgba(255, 255, 255, 0.09)')

  const grouped = {
    main: sidebarMenu.filter((m) => m.group === 'main'),
    system: sidebarMenu.filter((m) => m.group === 'system'),
  }

  const handleLogout = () => router.push('/')

  const renderMenu = (items: typeof sidebarMenu) =>
    items.map(({ label, icon: Icon, href, matchPrefix }) => {
      const isActive = pathname.startsWith(matchPrefix || href)

    return (
      <Tooltip
        key={href}
        label={collapsed ? label : ''}
        placement="right"
        hasArrow
        openDelay={300}
        bg="whiteAlpha.100"
        color={textColor}
        backdropFilter="blur(6px)"
        boxShadow="0 0 8px rgba(255, 255, 255, 0.05)"
        border="1px solid"
        borderColor="white"
      >
        <Link href={href}>
          <Flex
            align="center"
            gap={collapsed ? 0 : 5}
            px={4}
            py={2}
            fontSize="sm"
            rounded="md"
            bg={isActive ? 'whiteAlpha.100' : 'transparent'}
            _hover={{
              bg: 'whiteAlpha.100',
              backdropFilter: 'blur(6px)',
            }}
            color={isActive ? textColor : inactiveColor}
            cursor="pointer"
            transition="all 0.2s ease"
          >
             <Icon size={20} />
            {!collapsed && <Text>{label}</Text>}
          </Flex>
        </Link>
      </Tooltip>
    )

    })

  return (
    <Box
      h="100vh"
      w={collapsed ? '70px' : '250px'}
      bg={bg}
      color={textColor}
      borderRight="1px solid"
      borderColor={borderColor}
      transition="all 0.2s"
    >
      <Flex align="center" justify="space-between" px={4} py={4}>
        {!collapsed && <Text fontSize="lg" fontWeight="bold">Accounting</Text>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </Button>
      </Flex>

      <Text
        fontSize="xs"
        color="gray.500"
        px={2}
        mb={2}
        style={{ visibility: collapsed ? 'hidden' : 'visible' }}
      >
        Modules
      </Text>

      <VStack align="stretch" spacing={1} px={2}>{renderMenu(grouped.main)}</VStack>

      <Divider my={2} borderColor={borderColor} />

      <Text
        fontSize="xs"
        color="gray.500"
        px={2}
        mb={2}
        style={{ visibility: collapsed ? 'hidden' : 'visible' }}
      >
        System
      </Text>

      <VStack align="stretch" spacing={1} px={2}>{renderMenu(grouped.system)}</VStack>

      <Box mt="auto" px={2} py={4}>
        <Button
          onClick={handleLogout}
          size="sm"
          w="full"
          leftIcon={<LogOut size={18} />}
          color="red.400"
          variant="ghost"
        >
          {!collapsed && 'Logout'}
        </Button>
      </Box>
    </Box>
  )
}
