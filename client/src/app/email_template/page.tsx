"use client"
import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  Image,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import NavHead from "../../components/landing/header";
import { useRouter } from "next/navigation";
import grad from "../../public/grad.png"
import router from 'next/router';

const Testimonial = ({ children }: { children: ReactNode }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children, link }: { children: ReactNode, link: string }) => {
  const router = useRouter()
    return (
    <Stack
      onClick={() => {
        router.push(link);
      }}
      cursor={"pointer"}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }: { children: ReactNode }) => {
  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  );
};

const TestimonialText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({
  src,
}: {
  src: string;
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Image src={src} mb={2} />
      <Stack spacing={-1} align={'center'}>
      </Stack>
    </Flex>
  );
};

export default function WithSpeechBubbles() {
  const router = useRouter()
  return (
    <>
    <Container maxW={"6xl"}>
        <NavHead />
    </Container>
    <Box bg={useColorModeValue('gray.100', 'gray.700') } height='590px'>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={'center'}>
          <Heading>Choose Your Template</Heading>
          <Text>Select the suitable template based on your working experience</Text>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}>
          <Testimonial>
            <TestimonialContent link="create_email?s=0">
              <TestimonialHeading>Professional</TestimonialHeading>
              <TestimonialText>
                This template is for professional candidates who want to enhance their career prospects 
                and explore new opportunities for growth and advancement within their field.
              </TestimonialText>
            </TestimonialContent>
          </Testimonial>
          <Testimonial>
            <TestimonialContent link="create_email?s=1">
              <TestimonialHeading>Novice</TestimonialHeading>
              <TestimonialText>
                This template is for novice candidates who want to kick-start their career journey and explore entry-level opportunities within their chosen field.
              </TestimonialText>
            </TestimonialContent>
          </Testimonial>
          <Testimonial>
            <TestimonialContent link="create_email?s=2">
              <TestimonialHeading>New graduate</TestimonialHeading>
              <TestimonialText>
                This template is for new graduate candidates who want to secure their first professional position or internship in their chosen field.

              </TestimonialText>
            </TestimonialContent>
          </Testimonial>
        </Stack>
        <Button
                onClick={() => {
                    router.push('/filter');
                }}
                bg={useColorModeValue("brand.main", "brand.light")}
                _hover={{
                bg: useColorModeValue("brand.light", "brand.main"),
                }}
                size="lg"
                boxShadow={"0 5px 30px 0px rgb(63 62 94 / 43%)"}
                textColor={"brand.bg"}
                width="100px"
            >
                Back
            </Button>
      </Container>
    </Box>
    </>
  );
}