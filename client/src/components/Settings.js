import React, { useState } from 'react';
import './Settings.css'


const Settings = () => {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [currentPassword, setCurrentPassword] = useState('');
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');


 const handleInputChange = (event) => {
   const { name, value } = event.target;
   switch (name) {
     case 'name':
       setName(value);
       break;
     case 'email':
       setEmail(value);
       break;
     case 'currentPassword':
       setCurrentPassword(value);
       break;
     case 'newPassword':
       setNewPassword(value);
       break;
     case 'confirmPassword':
       setConfirmPassword(value);
       break;
     default:
       break;
   }
 };


 const handleSubmit = (event) => {
   event.preventDefault();


   // Simulate form submission (replace with your backend logic)
   console.log('Submitting settings...');
   console.log(`Name: ${name}`);
   console.log(`Email: ${email}`);


   // Password change logic (if applicable)
   if (newPassword && newPassword === confirmPassword) {
     console.log('Changing password...');
     console.log(`New Password: ${newPassword}`);
   } else {
     console.error('New passwords do not match.');
   }


   // Clear form fields after submission
   setName('');
   setEmail('');
   setCurrentPassword('');
   setNewPassword('');
   setConfirmPassword('');
 };


 const handleLogout = () => {
   // Simulate logout (replace with your logout logic)
   console.log('Logging out...');
 };


 return (
   <div className="settings-container">
     <h2 >Settings</h2>
     <form onSubmit={handleSubmit}>
       <div className="form-group">
         <label htmlFor="name" className='text'>Name:</label>
         <input
           type="text"
           id="name"
           name="name"
           value={name}
           onChange={handleInputChange}
           required
         />
       </div>
       <div className="form-group">
         <label htmlFor="email" className='text'>Email:</label>
         <input
           type="email"
           id="email"
           name="email"
           value={email}
           onChange={handleInputChange}
           disabled // Disable email editing for this example
         />
       </div>
       <div className="form-group">
         <h3 className='cPass'>Change Password</h3>
         <label htmlFor="currentPassword" className='text'>Current Password:</label>
         <input
           type="password"
           id="currentPassword"
           name="currentPassword"
           value={currentPassword}
           onChange={handleInputChange}
           required
         />
         <label htmlFor="newPassword" className='text'>New Password:</label>
         <input
           type="password"
           id="newPassword"
           name="newPassword"
           value={newPassword}
           onChange={handleInputChange}
           minLength="8" // Set minimum password length
         />
         <label htmlFor="confirmPassword" className='text'>Confirm New Password:</label>
         <input
           type="password"
           id="confirmPassword"
           name="confirmPassword"
           value={confirmPassword}
           onChange={handleInputChange}
           minLength="8"
         />
       </div>
       <button type="submit">Save Changes</button>
     </form>
     <button onClick={handleLogout}>Logout</button>
   </div>
 );
};


export default Settings;