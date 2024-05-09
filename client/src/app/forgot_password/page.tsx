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
  Slide,
  Alert,
  CloseButton,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


  export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    // const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // useRouter is similar to useNavigate but for Next.js
    const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages
    const [isAlert, setAlert] = useState(false);

    const handleSubmit = async (e: any) => {
        setErrorMessage(''); // Reset error message
        e.preventDefault();
        if (email == "") {
          setErrorMessage("* Please fill your email address!")
        }else {
          try {
              const response = await axios.post('http://localhost:5000/users/forgot-password', { email }); // Ensure this URL matches your backend endpoint
              // Assuming the backend sends back the email in response.data
              // const { email: resEmail } = response.data;
              // localStorage.setItem('email', resEmail); // Assuming you need to store the email in localStorage
              // router.push('/signin'); // Redirect to the signin page, similar to navigate('/login') in React Router

              setAlert(true)
          } catch (error) {
            console.log(error)
            setErrorMessage("* Email Address not found");
          }
    };
  };


  return (
    <>
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
            p={10}
          >
            <Stack spacing={4}>
              <FormControl id="email" w='350px'>
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <Text color="#e34f4f" fontFamily="Georgia, serif" fontSize={14}> {errorMessage}</Text>

              <Stack >
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
      <Slide direction='top' in={isAlert} style={{ zIndex: 10 }}>
        <Alert
        status='success'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='70px'
        >
          <Flex>
            <Box>
              <AlertTitle mt={-2} mb={1} fontSize='lg'>
                Email Verification Sent!
              </AlertTitle>
              <AlertDescription maxWidth='sm'>
                Please check your email to reset your password!
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf='flex-end'
              position='relative'
              left={500}
              bottom={21}
              onClick={(e) => setAlert(false)}
            />
          </Flex>
        </Alert>
      </Slide>
    </>
  );
}
