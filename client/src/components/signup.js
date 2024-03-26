import React, { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(''); // For displaying success message

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    setSuccessMessage(''); // Reset success message
    console.log("Signup attempted");
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        throw new Error('Signup request failed with status: ' + response.status);
      }

      const data = await response.json();
      console.log(data);
      setSuccessMessage('Signup successful! Please log in.'); // Set success message
      // Reset form fields
      setEmail('');
      setPassword('');
      setUsername('');
      // Optionally, redirect the user or update the UI further here
    } catch (error) {
      console.error('Signup error:', error.message);
      setErrorMessage(error.message); // Display error message on UI
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
      {successMessage && <div style={{color: 'green'}}>{successMessage}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
