import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
// import {Link} from 'link-react';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      console.log(response.data);
      const { username, token } = response.data;
      // Handle successful login (e.g., store token, redirect)
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);      
      history('/welcome');
    } catch (error) {
      console.error('Login error:', error.response.data);
      // Handle errors (e.g., incorrect credentials)
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <a href="/forgot-password">Forgot Password</a>
    </div>
  );
}

export default Login;
