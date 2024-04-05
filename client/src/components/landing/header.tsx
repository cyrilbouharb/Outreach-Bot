// HEADER FILE
"use client"
import { Box, Flex, Button, Stack, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaSignInAlt } from "react-icons/fa";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useRouter } from "next/navigation";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  return (
    <>
      <Box px={4} pt={3} pb={3}>
        <Flex h={20} alignItems={"center"} justifyContent={"space-between"}>
          <Image
            height={80}
            width={130}
            src={logo}
            alt=" logo"
            onClick={() => {
              router.push("/");
            }}
            style={{ cursor: "pointer" }}
          />

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={10}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <a href="/signin">
                <Button rightIcon={<FaSignInAlt />}>Sign In</Button>
              </a>
              <a href="/signup">
                <Button>Sign Up</Button>
              </a>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
