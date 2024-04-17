'use client'

import React, { ReactNode } from 'react'

import {
  CloseButton,
  Icon,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react'
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
  Link,
  SimpleGrid,
  Container
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { ReactText } from 'react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';



interface LinkItemProps {
  name: string
  icon: IconType
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favorites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
]

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()



  return (
    <Box w="500px"  borderRight="1px" /*borderRightColor={useColorModeValue('gray.200', 'gray.700')}*/
    >
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {


  const [location, setLocation] = useState<string | null>(null);
  const [organization, setOrganization] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage){
      setLocation(localStorage.getItem('location'));
      setOrganization(localStorage.getItem("organization"));
      setTitle(localStorage.getItem("position"))
    }

    // Retrieve and parse the stored data from localStorage
  }, []);

  return (
    <Box
      /*borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}*/
      w={{ base: '500px'}}
      pos="fixed"
      h="full"
      overflowX="auto"
      css={{
        '&::-webkit-scrollbar': {
        width: '4px',
        },
        '&::-webkit-scrollbar-track': {
        width: '6px',
        },
        }}
      {...rest}>
      <Stack spacing={8} mx={"auto"} w="100%" py={12} px={6}>
            <Stack align={"left"}>
              <Heading fontSize={"4xl"}></Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="Organization">
                  <FormLabel>Organization</FormLabel>
                  <Input placeholder={organization || ""}isReadOnly={true}/>
                </FormControl>
                <FormControl id="Position">
                  <FormLabel>Position</FormLabel>
                  <Input placeholder={title || ''} isReadOnly={true}/>
                </FormControl>
                <FormControl id="Location">
                  <FormLabel>Location</FormLabel>
                  <Input placeholder={location || ''} isReadOnly={true}/>
                </FormControl>
              </Stack>
            </Box>
          </Stack>
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: ReactText
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
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
  )
}