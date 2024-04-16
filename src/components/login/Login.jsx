import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header'
import './login.css'
import axios from 'axios'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submit action
        try {
          const response = await axios.post('https://udemy-clone-0d698fd51660.herokuapp.com/authentication', {
            strategy: 'local',
            email,
            password,
          });
          const accessToken = response.data.accessToken
          //console.log(response.data);
    
          const personalDetails = response.data.user
          //console.log(personalDetails);

          if (personalDetails.role !== 'admin') {
            console.error('Error: Only admins are allowed to log in here.');
            alert('Access Denied: You must be an admin to log in.');
            // Optionally clear email and password state, or handle differently
            setEmail('');
            setPassword('');
            return; // Prevent further actions like setting localStorage items or redirecting
          }

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('details',JSON.stringify(personalDetails))
          navigate('/UserManagement')
          setEmail('')
          setPassword('')
    
        } catch (error) {
          console.error('Error logging in:', error);
          setEmail('')
          setPassword('')
        }
      }
    return (
        <div>
        <Header />
        <div className="adm-login-form-container">
            <form className='adm-form' onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                <div className="adm-input-group">
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    required />
                </div>
                <div className="adm-input-group">
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    required />
                </div>
                <button type="submit" className="adm-login-button">Log in</button>
            </form>
            </div>
        </div>
    )
}

export default Login
