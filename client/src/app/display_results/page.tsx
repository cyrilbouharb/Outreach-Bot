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
import { Linkedin } from "lucide-react";

export default function DisplayResults() {
  const [data, setData] = useState<any| null>(null);
  const [item, setItem] = useState(null);
  const router = useRouter(); // Use useRouter for navigation

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage){
      const storedData = localStorage.getItem('displayData');
      if(storedData){
        setData(JSON.parse(storedData));
        console.log(data);
        localStorage.removeItem('displayData');
      }
    }

    // Retrieve and parse the stored data from localStorage

  }, []);
// comment out later
  let testPerson = {
    first_name: "John",
    last_name: "Doe",
    title: "Software Developer",
    organization: {
      name: "UMass CICS"
    },
    email: "cbouharb@umass.edu",
    linkedin_url: "https://www.linkedin.com/in/cyril-bou-harb-9996a6279/"
  };

  let testPerson2 = {
    first_name: "Jane",
    last_name: "Doe",
    title: "Software Engineer",
    organization: {
      name: "UMass CICS"
    },
    email: "adamkaluzny@umass.edu",
    linkedin_url: "https://www.linkedin.com/in/adamkaluzny2/"
  };

  let testPerson3 = {
    first_name: "Jimmy",
    last_name: "Doe",
    title: "Software Engineer",
    organization: {
      name: "UMass CICS"
    },
    email: "cpickreign@umass.edu",
    linkedin_url: "https://www.linkedin.com/in/chris-pickreign-0305041bb/"
  };


let returnedPeople = data;
if (returnedPeople === null){
  returnedPeople = [];
}


// let returnedPeople = [testPerson, testPerson2, testPerson3]



const [selectedUsers, setSelectedUsers] = useState(returnedPeople.map(() => true));

const handleCheckboxChange = (index: number) => {
  const updatedSelections = [...selectedUsers];
  updatedSelections[index] = !updatedSelections[index];
  setSelectedUsers(updatedSelections);
};
const sendEmails = async () => {
  const emailsToSend = returnedPeople.filter((_: any, index: any) => selectedUsers[index]);
  console.log(emailsToSend);
  if (emailsToSend.length ==0){
    alert("Please select at least one candidate");
  } else{
    try {
      const response = await fetch('http://localhost:5000/send/userinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailsToSend),
      });
      const data = await response;
      router.push("/email_template");
      console.log(data);
    } catch (error) {
      console.error('Failed to send emails:', error);
    }
  }
};

  return (
    <>
      <Container maxW={"6xl"}>
        <NavHead />
      </Container>
      <Flex>
        <Sidebar />
        <Flex align={"center"} direction="column" width="60%">
          <SimpleGrid
            bg={useColorModeValue("gray.50", "gray.700")}
            columns={2}
            spacing="8"
            p="10"
            textAlign="center"
            rounded="lg"
            width="80%"
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
                      {returnedPeople[i].title}
                      {" @ "}
                      {returnedPeople[i].organization.name}
                    </Text>
                    {returnedPeople[i].linkedin_url && (
                    <Link href={returnedPeople[i].linkedin_url} isExternal color="blue.500">
                      LinkedIn
                    </Link>
                    )}
                  </Box>
                );
              })}
          </SimpleGrid>
          <Button
            colorScheme="blue"
            mt={8} // Add some top margin
            size="lg"
            width="20%" // Adjust width as needed
            boxShadow="lg"
            onClick={sendEmails}
          >
            Create Emails
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
