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
import { AnyARecord } from 'dns';

export default function SimpleCard() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages


  const handleLogin = async (e:any) => {
    setErrorMessage(''); // Reset error message
    e.preventDefault();

    if (password == "" || email == "") {
      setErrorMessage("* Please fill all the field!")
    } else {
      try {
        const response = await axios.post('http://localhost:5000/users/login', {
          email,
          password
        });

        const { username, token } = response.data;
        // Handle successful login (e.g., store token, redirect)
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);      
        router.push("/");
      } catch (error: any) {
        // Handle errors (e.g., incorrect credentials)
        setErrorMessage("* " + error.response.data.message);
      }
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
            <Text color="#e34f4f" fontFamily="Georgia, serif" fontSize={14}> {errorMessage}</Text>
            
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
              <Link href="/" color={"black.400"}>
                Back
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
