"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
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
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

  const [isAlert, setAlert] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    if (password == "" || first_name == "" || last_name == "" || email == "") {
      setAlert(true)
      setErrorMessage("* Please fill all the field!")
    } else {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          first_name, 
          last_name, 
          email, 
          password
        });

        const data = await response.data;
        setAlert(true)

        // Optionally, redirect the user or update the UI further here
      } catch (error) {
        setErrorMessage("* User already exist!"); // Display error message on UI
      }
    }
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
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="First Name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Text color="#e34f4f" fontFamily="Georgia, serif" fontSize={14}> {errorMessage}</Text>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  width="100%"
                  onClick={handleSignup}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link href="/signin" color={"blue.400"}>
                    Login
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
                Please check your email to verify your account
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