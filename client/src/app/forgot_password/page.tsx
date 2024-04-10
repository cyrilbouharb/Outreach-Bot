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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


  export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter(); // useRouter is similar to useNavigate but for Next.js

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/forgot-password', { email }); // Ensure this URL matches your backend endpoint
            console.log(response.data);
            // Assuming the backend sends back the email in response.data
            const { email: resEmail } = response.data;
            localStorage.setItem('email', resEmail); // Assuming you need to store the email in localStorage
            setIsLoading(false);
            router.push('/signin'); // Redirect to the signin page, similar to navigate('/login') in React Router
        } catch (error) {
            console.error("Forgot Password error:", error);
            alert('There was an error processing your request.');
            setIsLoading(false);
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
          <Heading fontSize={"4xl"}>Forgot Password</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={5}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              ></Stack>
              <Link href="/reset_password">
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  width="100%"
                  onClick={handleSubmit}
                >
                  Reset Password
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
