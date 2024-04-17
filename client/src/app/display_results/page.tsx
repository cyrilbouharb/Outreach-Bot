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
// comment out later
  let testPerson = {
    first_name: "John",
    last_name: "Doe",
    job_title: "Software Developer",
    email: "cbouharb@umass.edu"
  };

  let testPerson2 = {
    first_name: "Jane",
    last_name: "Doe",
    job_title: "Software Engineer",
    email: "adamkaluzny@umass.edu",
  };
  let returnedPeople = [testPerson, testPerson2];

  // let returnedPeople = data;
  // if (returnedPeople === null) {
  //   returnedPeople = [];
  // }





const [selectedUsers, setSelectedUsers] = useState(returnedPeople.map(() => true));

const handleCheckboxChange = (index: number) => {
  const updatedSelections = [...selectedUsers];
  updatedSelections[index] = !updatedSelections[index];
  setSelectedUsers(updatedSelections);
};
const sendEmails = async () => {
  const emailsToSend = returnedPeople.filter((_, index) => selectedUsers[index]);
  console.log(emailsToSend);
  try {
    const response = await fetch('http://localhost:5000/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailsToSend),
    });
    const data = await response;
    if (data.status === 200) {
      alert("Successfully sent email(s)")
    }
    else {
      alert("Failed to send emails!")
    }
    console.log(data);
  } catch (error) {
    console.error('Failed to send emails:', error);
  }
};

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
                      isChecked={selectedUsers[i]}
                      onChange={() => handleCheckboxChange(i)}
                      size="lg"
                      colorScheme="green"
                    ></Checkbox>
                    <Text>
                      {returnedPeople[i].first_name} {returnedPeople[i].last_name}
                    </Text>
                    <Text>
                       {returnedPeople[i].job_title}
                      {/* {" @ "}
                      {returnedPeople[i].company} */}
                    </Text>
                  </Box>
                );
              })}
          </SimpleGrid>
          <Button colorScheme="blue" onClick={sendEmails}>Send Emails</Button>
        </Flex>
      </Flex>
    </>
  );
}
