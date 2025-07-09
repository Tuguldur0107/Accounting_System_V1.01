'use client'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()
  const router = useRouter()

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: 'Email, password хоёуланг бөглөнө үү.',
        status: 'warning',
        isClosable: true,
      })
      return
    }
    router.push('/dashboard')
  }

  return (
    <Box
      position="relative"
      minH="100vh"
      overflow="hidden"
    >
      {/* 🔵 Анимэйшнтэй background давхарга */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgImage="url('/ChatGPT-Login-bg2.png')"
        bgSize="110% 110%"
        bgRepeat="no-repeat"
        animation="bgMove 60s linear infinite"
        zIndex={0}
        sx={{
          '@keyframes bgMove': {
            '0%': { backgroundPosition: '0% 0%' },
            '50%': { backgroundPosition: '100% 100%' },
            '100%': { backgroundPosition: '0% 0%' },
          },
        }}
      />

      {/* 🔒 Login form card */}
      <Box
        position="relative"
        zIndex={1}
        maxW="sm"
        w="full"
        p={8}
        mx="auto"
        mt="auto"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          w="full"
          p={8}
          borderRadius="lg"
          bg="blackAlpha.600"
          border="1px solid"
          borderColor="cyan.400"
        >
          <Stack spacing={4}>
            <Heading size="md" textAlign="center" color="white">Login</Heading>

            <FormControl>
              <FormLabel color="white">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="blackAlpha.600"
                color="white"
                border="1px solid"
                borderColor="cyan.400"
                _focus={{
                  boxShadow: '0 0 0 2px cyan',
                  borderColor: 'cyan.300',
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="white">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="blackAlpha.600"
                color="white"
                border="1px solid"
                borderColor="cyan.400"
                _focus={{
                  boxShadow: '0 0 0 2px cyan',
                  borderColor: 'cyan.300',
                }}
              />
            </FormControl>

            <Button
              onClick={handleLogin}
              bgGradient="linear(to-r, cyan.400, blue.500)"
              _hover={{
                bgGradient: 'linear(to-r, blue.500, cyan.400)',
                boxShadow: '0 0 1px cyan',
              }}
              color="white"
              fontWeight="bold"
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
