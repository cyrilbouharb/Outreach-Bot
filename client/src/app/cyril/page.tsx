"use client";
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Include the styles for Quill

export default function EmailTemplateEditor() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/templates')
            .then(response => response.json())
            .then(data => {
                setTemplates(data);
                if (data.length > 0) {
                    setSelectedTemplate(data[0]);
                    setSubject(data[0].subject);
                    setBody(data[0].body.replace(/\n/g, '<br>'));
                }
            })
            .catch(error => console.error('Error fetching templates:', error));
    }, []);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setSubject(template.subject);
    
        // Ensure HTML new lines are interpreted correctly
        const formattedBody = template.body.replace(/\n/g, '<br>');
        setBody(formattedBody);
    };
    

    const handleSendEmail = async () => {
        // API call to send the email using Nodemailer
        const response = await fetch('http://localhost:5000/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject: subject,
                body: body,
                to: 'cbouharb@umass.edu' // this will depend on your UI form
            })
        });

        const result = await response.json();
        alert('Email sent: ' + result.message);
    };

    return (
        <div style={{ width: '600px', margin: 'auto' }}>
            <select
                onChange={(e) => handleTemplateSelect(templates[e.target.selectedIndex])}
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
            >
                {templates.map((template, index) => (
                    <option key={template.id} value={index}>
                        {template.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                style={{ height: '300px', marginBottom: '20px' }}
                modules={{ toolbar: true }}  // Ensure that the toolbar is enabled or configure as needed
                formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'color']}
            />
            <button onClick={handleSendEmail} style={{ padding: '10px 20px' }}>
                Send Email
            </button>
        </div>
    );
}
