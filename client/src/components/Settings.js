import React, { useState } from 'react';
import './Settings.css';

function Settings() {
  // State to store input values (assuming you're not pulling these from a backend yet)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Placeholder function for saving settings
  const handleSave = (e) => {
    e.preventDefault();
    console.log('Settings saved:', profile);
    // Here you would normally send data to the backend
  };

  // Placeholder function for logout
  const handleLogout = () => {
    console.log('User logged out');
    // Implement logout functionality here
  };

  return (
    <div>
      <h2>Settings</h2>
      <form onSubmit={handleSave} className="settings-form">
        <div>
          <label>Profile Picture</label>
          <input type="file" />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} />
        </div>
        <button type="submit">Save Settings</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Settings;
