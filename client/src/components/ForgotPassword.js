import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


function ForgotPassword() {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
        const response = await axios.post('http://localhost:5000/forgot-password', { 
            email
        });
        console.log(response.data)
        // const {email} = response.data;
        const {email:rde} = response.data;
        localStorage.setItem('email', rde);
        // navigate('/login')
        navigate('/')
        }catch(error){
            console.error("FP error")
        }
    }

    return(

      <div>
        <h4>Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-3"> */}
            {/* <label htmlFor="email">
              <strong>Email</strong>
            </label> */}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          {/* </div> */}
          <button type="submit"> Send </button>
        </form>
    </div>
    )
}

export default ForgotPassword;