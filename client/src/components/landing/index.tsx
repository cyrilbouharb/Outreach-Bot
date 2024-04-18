"use client"
import {
  Container,
  Divider,
} from "@chakra-ui/react";
import HeroLanding from "./hero";
import WidgetDisplay from "./display";
import NavHead from "./header2";
import Footer from "./footer";
import Features from "./features";


export default function LandingPage() {
  return (
    <>
      <Container maxW={"6xl"}>
        <NavHead />
        <HeroLanding />
      </Container>
      <Divider />
      <WidgetDisplay />
      <Divider />
      <Features />
      <Divider />
      <Footer />
    </>
  );
}
