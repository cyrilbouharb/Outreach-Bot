// Welcome.js
import React from 'react';

const Welcome = () => {
    const username = localStorage.getItem('username');
    return (
    <div>
      <h2>Welcome {username}</h2>
      <p>Welcome to our outreachbot!</p>
    </div>
  );
}

export default Welcome;
