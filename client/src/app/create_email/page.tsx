"use client";

import React from 'react'
import {
  Box,
  Stack,
  Container,
  Input,
  Button,
  useColorModeValue,
  Link,
  Text,
  Flex
} from '@chakra-ui/react';
import NavHead from "../../components/landing/header";
import { useState, useEffect, Suspense} from 'react';
import { usePathname } from 'next/navigation';
import ReactQuill from 'react-quill';
import {useRouter } from "next/navigation";
import 'react-quill/dist/quill.snow.css'; // Include the styles for Quill
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "../../components/tiptap/toolbar";
import Underline from "@tiptap/extension-underline";
 

export default function WithSpeechBubbles() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    let outputEmail = body;
    const router = useRouter(); // Use useRouter for navigation
    const pathname = usePathname();

    const Tiptap = ({ onChange, content }: any) => {
        const handleChange = (newContent: string) => {
            //onChange(newContent);
        };
        const editor = useEditor({
            extensions: [StarterKit, Underline],
            editorProps: {
            attributes: {
                class:
                "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
                },
            },
            content: content,
            onUpdate({ editor }) {
            outputEmail = editor.getHTML(); //keep
        },
        });

        return (
            <div className="w-full px-4">
            <Toolbar editor={editor} content={content}/>
            <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
            </div>
        );
    };

    useEffect(() => {
        fetch('http://localhost:5000/templates')
            .then(response => response.json())
            .then(data => {
                setTemplates(data);
                let s = window.location.href.substring(window.location.href.indexOf('=') + 1);
                if (data.length > 0 && s != null) {
                    setSelectedTemplate(data[0]);
                    setSubject(data[s].subject);
                    setBody(data[s].body.replace(/(\r\n|\r|\n)/g, '<br>'));
                }
            })
            .catch(error => console.error('Error fetching templates:', error));
        
        }, []);

    const handleSendEmail = async () => {
        // API call to send the email using Nodemailer
        //console.log(outputEmail)
        const response = await fetch('http://localhost:4999/send/sendEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject: subject,
                body: outputEmail,
                to: 'chrispickreign@gmail.com' // this will depend on your UI form, this should be updated to outreach emails
            })
        });

        const result = await response.json();
        alert(result.message);
        router.push("/home");
        
    };

    const handleContentChange = (reason: any) => {
        setBody(reason)
    }

    return (
        <>
        <Container maxW={"6xl"}>
            <NavHead />
        </Container>
        <Box bg={useColorModeValue('gray.100', 'gray.700') } height='590px'>
        <Container maxW={'7xl'} py={6} as={Stack} spacing={6} align='center'>
            <Input
                width='70%'
                type="text"
                borderColor='gray.300'
                placeholder="Subject"
                value={subject}
                //placeholder={subject}
                onChange={(e) => {
                    setBody(outputEmail);
                    setSubject(e.target.value);
                    if (typeof window !== 'undefined'){
                        localStorage.setItem("organization", e.target.value);
                    }
                }}
            />
            <Tiptap
                onChange={(newContent: string) => handleContentChange(newContent)}
                content={body}
            />
            <Flex flexDirection={'row'} gap={'10px'}>
                <Button
                onClick={() => {
                    router.push('/email_template');
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
            <Button
                onClick={handleSendEmail}
                bg={useColorModeValue("brand.main", "brand.light")}
                _hover={{
                bg: useColorModeValue("brand.light", "brand.main"),
                }}
                size="lg"
                boxShadow={"0 5px 30px 0px rgb(63 62 94 / 43%)"}
                textColor={"brand.bg"}
                width="200px"
            >
                Send Email
            </Button>
            </Flex>
            </Container>
        </Box>
        </>
  );
}