"use client";

// import { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Include the styles for Quill

// export default function EmailTemplateEditor() {
    // const [templates, setTemplates] = useState([]);
    // const [selectedTemplate, setSelectedTemplate] = useState(null);
    // const [subject, setSubject] = useState('');
    // const [body, setBody] = useState('');

    // useEffect(() => {
    //     fetch('http://localhost:5000/templates')
    //         .then(response => response.json())
    //         .then(data => {
    //             setTemplates(data);
    //             if (data.length > 0) {
    //                 setSelectedTemplate(data[0]);
    //                 setSubject(data[0].subject);
    //                 setBody(data[0].body.replace(/\n/g, '<br>'));
    //             }
    //         })
    //         .catch(error => console.error('Error fetching templates:', error));
    // }, []);

    // const handleTemplateSelect = (template: any) => {
    //     setSelectedTemplate(template);
    //     setSubject(template.subject);
    
    //     // Ensure HTML new lines are interpreted correctly
    //     const formattedBody = template.body.replace(/\n/g, '<br>');
    //     setBody(formattedBody);
    // };
    

    // const handleSendEmail = async () => {
    //     // API call to send the email using Nodemailer
    //     const response = await fetch('http://localhost:5000/send', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             subject: subject,
    //             body: body,
    //             to: 'cbouharb@umass.edu' // this will depend on your UI form
    //         })
    //     });

    //     const result = await response.json();
    //     alert('Email sent: ' + result.message);
    // };

//     return (
//         <div style={{ width: '600px', margin: 'auto' }}>
//             <select
//                 onChange={(e) => handleTemplateSelect(templates[e.target.selectedIndex])}
//                 style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
//             >
//                 {templates.map((template, index) => (
//                     <option key={template.id} value={index}>
//                         {template.name}
//                     </option>
//                 ))}
//             </select>
//             <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
//             />
//             <ReactQuill
//                 theme="snow"
//                 value={body}
//                 onChange={setBody}
//                 style={{ height: '300px', marginBottom: '20px' }}
//                 modules={{ toolbar: true }}  // Ensure that the toolbar is enabled or configure as needed
//                 formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'color']}
//             />
//             <button onClick={handleSendEmail} style={{ padding: '10px 20px' }}>
//                 Send Email
//             </button>
//         </div>
        
//     );
// }

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

    // const Tiptap = () => {
    //     const editor = useEditor({
    //         editorProps: {
    //             attributes: {
    //             class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    //             },
    //         },
    //       extensions: [
    //         StarterKit,
    //       ],
    //       content: body,
    //       onUpdate({ editor }) {
    //         outputEmail = editor.getText();
    //         console.log(outputEmail);
    //     },

    //     })

    //     return (
    //         <EditorContent editor={editor} height={50}/>
    //     )
    //   }

    const Tiptap = ({ onChange, content }: any) => {
        const handleChange = (newContent: string) => {
            onChange(newContent);
        };
        const editor = useEditor({
            extensions: [StarterKit, Underline],
            editorProps: {
            attributes: {
                class:
                "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-t border-gray-700 text-gray-400 w-full gap-3 font-medium text-[16px] ",
                },
            },
            content: content,
            // onUpdate({ editor }) {
            //     outputEmail = editor.getText();
            //     console.log(outputEmail);
            // },
            onBlur({ editor, event }) {
                setBody(editor.getText());
            },
        });

        return (
            <div className="w-full px-4">
            {/* <Toolbar editor={editor} content={content}/> */}
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

    // const handleTemplateSelect = (template: any) => {
    //     setSelectedTemplate(template);
    //     setSubject(template.subject);
    
    //     // Ensure HTML new lines are interpreted correctly
    //     const formattedBody = template.body.replace(/\n/g, '<br>');
    //     setBody(formattedBody);
    // };

    const handleSendEmail = async () => {
        // API call to send the email using Nodemailer
        console.log(outputEmail)
        const response = await fetch('http://localhost:5000/send/sendEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject: subject,
                body: outputEmail,
                to: 'cbouharb@umass.edu' // this will depend on your UI form
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
                onChange={(e) => {
                    setSubject(e.target.value);
                }}
            />
            {/* <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                style={{ width:'70%', height: '300px', marginBottom: '20px' }}
                modules={{ toolbar: true }}  // Ensure that the toolbar is enabled or configure as needed
                formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'color']}
                
            /> */}
            <Tiptap content={body} />
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
