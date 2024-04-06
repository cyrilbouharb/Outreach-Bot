import React from 'react';
// import { Routes } from 'react-router-dom';
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Welcome from './components/Welcome';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import EmailVerification from './components/EmailVerification';

// function App() {
//   return (
//     <div>
//       <Signup />
//       <Login />
//       <Welcome />
//     </div>
//   );
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/'  element={<div><Login /><Signup /></div>} />
        {/* <Route path='/' element={<Signup/>} /> */}
        <Route path='/welcome' element={<Welcome/>} />
        <Route path = '/forgot-password' element= {<ForgotPassword/>} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path = "/reset-password/:id/:token" element= {<ResetPassword/>}></Route>
      </Routes>
    </Router>
  );
}

// function App() {
//   return (
//       <Routes>
//         <Route path="/" exact component={Login} />
//         <Route path="/signup" component={Signup} />
//         <Route path="/welcome" component={Welcome} />
//       </Routes>
//   );
// }

export default App;

