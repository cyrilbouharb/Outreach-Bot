"use client"
import {
  Container,
  Divider,
} from "@chakra-ui/react";
import HeroLanding from "../../components/landing/hero";
import WidgetDisplay from "../../components/landing/display";
import NavHead from "../../components/landing/header2";
import Footer from "../../components/landing/footer";
import Features from "../../components/landing/features";


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
