import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResumesList() {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
      const fetchResumes = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/resumes');
          setResumes(response.data);
        } catch (error) {
          console.error('Failed to fetch resumes:', error);
        }
      };

      fetchResumes();
    }, []);

    return (
      <div>
        <h2>Uploaded Resumes</h2>
        <ul>
          {resumes.map((resume) => (
            <li key={resume.id}>
              <a href={resume.url} target="_blank" rel="noopener noreferrer">
                View Resume ({resume.file_name})
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
}

export default ResumesList;
