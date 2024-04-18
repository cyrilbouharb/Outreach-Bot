"use client";

import React, { ReactNode } from "react";
import { useState } from "react";

import {
  CloseButton,
  Icon,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import {
  IconButton,
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
  SimpleGrid,
  Container,
  Link
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { Domain } from "domain";
import { useRouter } from "next/navigation";



interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Trending", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "Favorites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];


export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      w="500px"
      borderRight="1px" /*borderRightColor={useColorModeValue('gray.200', 'gray.700')}*/
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

const router = useRouter();
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");



  const handleSubmit = async (/*e: { preventDefault: () => void } */) => {
    //e.preventDefault();
    console.log("handle submit is running");
    try {
      const response = await fetch("https://outreach-bot-e8521e90ac6b.herokuapp.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization, location, title }),
      });

      if (!response.ok) {
        throw new Error("Search failed: " + response.status);
      }

      const data = await response.json();
      if (typeof window !== "undefined"){
        localStorage.setItem("displayData", JSON.stringify(data));
      }
      console.log(data);
      // Reset form fields
      setLocation("");
      setOrganization("");
      setTitle("");

      router.push("/display_results");
      // Optionally, redirect the user or update the UI further here
    } catch (error: any) {
      console.error("Signup error:", error.message);
      //setErrorMessage(error.message); // Display error message on UI
    }
  };

  return (
    <Box
      /*borderRight="1px"
borderRightColor={useColorModeValue('gray.200', 'gray.700')}*/
      w={{ base: "500px" }}
      pos="fixed"
      h="full"
      overflowX="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
      }}
      {...rest}
    >
      <Stack spacing={8} mx={"auto"} w="100%" py={12} px={6}>
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
            <FormControl id="Organization" isRequired>
              <FormLabel>Organization Domain (ex. google.com)</FormLabel>
              <Input
                type="text"
                placeholder="Organization Domain"
                value={organization}
                onChange={(e) => {
                  setOrganization(e.target.value);
                  if (typeof window !== 'undefined'){
                    localStorage.setItem("organization", e.target.value);
                  }
                  
                }}
              />
            </FormControl>
            <FormControl id="Title" isRequired>
              <FormLabel>Job Title</FormLabel>
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (typeof window !== 'undefined'){
                    localStorage.setItem("position", e.target.value);
                  }
                  
                }}
              />
            </FormControl>
            <FormControl id="Location" isRequired>
              <FormLabel>Location - State, Country (ex. California, US)</FormLabel>
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (typeof window !== 'undefined'){
                    localStorage.setItem("location", e.target.value);
                  }
                }}
              />
            </FormControl>

            <Stack spacing={10}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                width="100%"
                onClick={() => {
                  if (title == "" || location == "" || organization == "") {
                    alert("Please Fill Out All Fields");
                  } else {
                    handleSubmit(); 
                    //for testing purposes
                    //router.push("/display_results");
                  }
                }}
              >
                Find Candidates
              </Button>
              <Text>
                <Link href="/home" color={"black.400"}>
                  Back
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};
