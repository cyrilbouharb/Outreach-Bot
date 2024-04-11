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
import { useEffect, useState } from 'react';
export default function DisplayResults() {
  const [data, setData] = useState(null);
  const router = useRouter(); // Use useRouter for navigation

  useEffect(() => {
    // Retrieve and parse the stored data from localStorage
    const storedData = localStorage.getItem('displayData');
    console.log(storedData);
    if (storedData) {
      setData(JSON.parse(storedData));
      console.log(data);
      // Optional: Clear the stored data if it's no longer needed
      localStorage.removeItem('displayData');
    }
  }, []);

  // let testPerson = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   industry: "computing",
  //   title: "Software Developer",
  //   company: "Apple",
  //   location: "CA",
  //   seniority: "Senior",
  // };

  // let testPerson2 = {
  //   firstName: "Jane",
  //   lastName: "Doe",
  //   industry: "computing",
  //   title: "Software Engineer",
  //   company: "Google",
  //   location: "WA",
  //   seniority: "Entry Level",
  // };
  let returnedPeople = data;
  if (returnedPeople === null) {
    returnedPeople = [];
  }

  // const router = useRouter();

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
                      {returnedPeople[i].first_name} {returnedPeople[i].last_name}
                    </Text>
                    <Text>
                      {returnedPeople[i].email} {returnedPeople[i].job_title}
                      {/* {" @ "}
                      {returnedPeople[i].company} */}
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
