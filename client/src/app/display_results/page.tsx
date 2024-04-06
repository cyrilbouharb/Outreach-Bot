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
  Container,
} from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../public/logo.png";
import NavHead from "../../components/landing/header";
import Sidebar from "../../components/sidebar/sidebar2";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";

export default function SimpleCard() {
  // const router = useRouter();

  let testPerson = {
    firstName: "John",
    lastName: "Doe",
    industry: "computing",
    title: "Software Developer",
    company: "Apple",
    location: "CA",
    seniority: "Senior",
  };

  let testPerson2 = {
    firstName: "Jane",
    lastName: "Doe",
    industry: "computing",
    title: "Software Engineer",
    company: "Google",
    location: "WA",
    seniority: "Entry Level",
  };
  let returnedPeople = [
    testPerson,
    testPerson2,
    testPerson2,
    testPerson,
    testPerson,
    testPerson2,
    testPerson2,
    testPerson,
  ];

  const router = useRouter();

  //const inputText = router.query.;

  return (
    <>
      <Container maxW={"6xl"}>
        <NavHead />
      </Container>
      <Flex>
        <Sidebar />
        <Flex align={"center"}>
          <SimpleGrid
            bg={useColorModeValue("gray.50", "gray.700")}
            columns={2}
            spacing="8"
            p="10"
            textAlign="center"
            rounded="lg"
          >
            {Array(returnedPeople.length)
              .fill("")
              .map((n, i) => {
                return (
                  <Box
                    bg={useColorModeValue("white", "gray.600")}
                    boxShadow="lg"
                    p="6"
                    rounded="md"
                    key={i}
                  >
                    <Checkbox
                      defaultChecked
                      size="lg"
                      colorScheme="green"
                    ></Checkbox>
                    <Text>
                      {returnedPeople[i].firstName} {returnedPeople[i].lastName}
                    </Text>
                    <Text>
                      {returnedPeople[i].seniority} {returnedPeople[i].title}
                      {" @ "}
                      {returnedPeople[i].company}
                    </Text>
                  </Box>
                );
              })}
          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  );
}
