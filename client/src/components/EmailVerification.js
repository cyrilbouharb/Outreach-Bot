import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper function to extract query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function EmailVerification() {
  let navigate = useNavigate(); // Hook to programmatically navigate
  let query = useQuery();

  useEffect(() => {
    const token = query.get('token');
    if (token) {
      axios.get(`http://localhost:5000/verify-email?token=${token}`)
        .then(response => {
          alert("Email verified successfully!");
          navigate('/login'); // Navigate to login after successful verification
        })
        .catch(error => {
          alert("Failed to verify email.");
          console.error('Error verifying email:', error);
          // Optionally, handle error by navigating elsewhere or showing a message
        });
    }
  }, [query, navigate]); // Ensure useEffect is dependent on `query` and `navigate`

  return <div>Verifying your email...</div>;
}

export default EmailVerification;
