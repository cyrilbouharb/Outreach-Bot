"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  Container
} from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../public/logo.png";
import NavHead from "../../components/landing/header";
import Sidebar from "../../components/sidebar/sidebar"
// import { useRouter } from "next/navigation";

export default function SimpleCard() {
  // const router = useRouter();
  return (
    <>
      <Container maxW={"6xl"}>
        <NavHead />
      </Container>
        <Flex>
        <Sidebar />
        <Image
            height={1000}
            width={1000}
            src={logo}
            alt=" logo"
            // onClick={() => {
            //   router.push("/");
            // }}
            //style={{ cursor: "pointer" }}
          />
        </Flex>
    </>
  );
}
