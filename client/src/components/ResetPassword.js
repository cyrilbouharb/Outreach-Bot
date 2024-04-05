import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
// const {id, token} = useParams();


function ResetPassword() {
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const {id, token} = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
        const response = await axios.post(`http://localhost:5000/reset-password/${id}/${token}`,{password
        });
        console.log(response.data)
        // const {email} = response.data;
        const {password:rde} = response.data;
        localStorage.setItem('password', rde);
        // navigate('/login')
        navigate('/')
        }catch(error){
            console.error("FP error")
        }
    }

    return(

      <div>
        <h4>Reset Password</h4>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-3"> */}
            {/* <label htmlFor="email">
              <strong>Email</strong>
            </label> */}
            <input
                type="password"
                placeholder="Enter PWD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          {/* </div> */}
          <button type="submit"> Update </button>
        </form>
    </div>
    )
}

export default ResetPassword;