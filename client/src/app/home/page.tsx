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
  Center,
} from "@chakra-ui/react";

import logo from "../../public/logo.png";
import Image from "next/image";

export default function SimpleCard() {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Image height={400} width={400} src={logo} alt=" logo" />
          <Heading fontSize={"4xl"}>Outreach Bot</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Link href="/search">
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                width="100%"
              >
                Create Outreach Request
              </Button>
            </Link>
            <Link href="/settings">
              <Center>
                <Button
                  loadingText="Submitting"
                  alignContent={"center"}
                  size="md"
                  bg={"gray.500"}
                  color={"white"}
                  _hover={{
                    bg: "gray.600",
                  }}
                  width="50%"
                >
                  Settings
                </Button>
              </Center>
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
