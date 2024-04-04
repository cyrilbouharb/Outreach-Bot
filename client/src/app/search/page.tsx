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
  SimpleGrid,
} from "@chakra-ui/react";

export default function SimpleCard() {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} w="70%" py={12} px={6}>
        <Stack align={"left"}>
          <Heading fontSize={"4xl"}>Filter Request</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="Industry">
              <FormLabel>Industry</FormLabel>
              <Input />
            </FormControl>
            <FormControl id="Organization">
              <FormLabel>Organization</FormLabel>
              <Input />
            </FormControl>
            <FormControl id="Position">
              <FormLabel>Position</FormLabel>
              <Input />
            </FormControl>
            <FormControl id="Seniority">
              <FormLabel>Seniority</FormLabel>
              <Input />
            </FormControl>
            <FormControl id="Location">
              <FormLabel>Location</FormLabel>
              <Input />
            </FormControl>
            <FormControl id="Degree">
              <FormLabel>Degree</FormLabel>
              <Input />
            </FormControl>

            <Stack spacing={10}>
              <Link href="/display_results">
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
                  Find Candidates
                </Button>
              </Link>
              <Text>
                <Link href="/home" color={"black.400"}>
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
