"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

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

export default function SimpleCard() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(''); // For displaying success message


  const handleLogin = async (e) => {
    setErrorMessage(''); // Reset error message
    setSuccessMessage(''); // Reset success message
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      console.log(response.data);
      const { username, token } = response.data;
      // Handle successful login (e.g., store token, redirect)
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);      
      router.push("/");
    } catch (error) {
      //console.error('Login error:', error.response.data);
      // Handle errors (e.g., incorrect credentials)
      setErrorMessage(error.response.data.message);
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
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}               
               />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"} href="/forgot_password">Forgot password?</Link>
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
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
              </Link>
              <Text>
                {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
                <Link href="/" color={"black.400"}>
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
