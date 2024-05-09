"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Directly parse the window.location.search to extract query parameters
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const userIdParam = urlParams.get('userId');
      const tokenParam = urlParams.get('token');
      if (userIdParam && tokenParam) {
        setUserId(userIdParam);
        setToken(tokenParam);
      }
    }
  }, []);

  const handleResetPassword = async (e:any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    try {
      await axios.post(`https://outreach-bot-e8521e90ac6b.herokuapp.com/users/reset-password?userId=${userId}&token=${token}`, { password });
      alert('Your password has been reset successfully.');
      // Use Next.js router for redirection
      router.push('/signin');
    } catch (error) {
      alert('Failed to reset password.');
      console.error('Reset Password error:', error);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Reset Password</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <FormControl id="password2">
              <FormLabel>Re-enter Password</FormLabel>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormControl>

            
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
              </Stack>
              <Link href="/">
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  width="100%"
                  onClick={handleResetPassword}
                >
                  Submit New Password
                </Button>
              </Link>
              <Text>
                <Link href="/signin" color={"black.400"}>
                  Back
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
