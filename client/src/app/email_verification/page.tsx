'use client'

import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useRouter } from 'next/navigation'

export default function VerifyEmailComponent() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    // Parse the URL to get the token query parameter
    const url = new URL(window.location.href);
    const tokenParam = url.searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      verifyToken(tokenParam); // Verify the token when it's found
    }
  }, []); // This effect doesn't depend on dynamic values

  async function verifyToken(token: string) {
    axios.get(`http://localhost:5000/users/verify-email?token=${token}`)
      .then(response => {
        // Assuming the server sends a response body with a success message
        alert(response.data.message || "Email verified successfully!");
        router.push('/signin'); // Navigate to login after successful verification
      })
      .catch(error => {
        const errorMessage = error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to verify email.";
        alert(errorMessage);
        console.error('Error verifying email:', error);
        if (error.response && error.response.status === 400) {
          console.log('Bad request, possibly invalid token or parameters.');
        }
      });
  }
  return (
    <div>
      <p>Token: {token}</p>
      <p>Verification Status: {verificationStatus}</p>
    </div>
  );
}
