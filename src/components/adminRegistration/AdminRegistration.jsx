import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import './adminRegistration.css'


function AdminRegistration() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [offers, setOffers] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
          fullName,
          email,
          password,
          offers: false,
          role: 'admin'
        }
    
        try {
          const response = await axios.post('https://udemy-clone-0d698fd51660.herokuapp.com/user', formData);
          
          //if success navigate to login page
          navigate('/UserManagement')

          setFullName('')
          setPassword('')
          setEmail('')
    
        } catch (error) {
          console.error('Error registering:', error);
          setFullName('')
          setPassword('')
          setEmail('')
          
        }
      };


    return (
        <div className='adm-registration-ctnr'>
            <Header />
            <div className='register-form-container'>
                <form className='register-form' onSubmit={handleSubmit}>
                    <h2>Create Admin</h2>
                    <div className="form-group">
                        <input 
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className="sign-up-button">Sign up</button>
                    <p className="terms">
                        By signing up, you agree to our
                        <a href="/terms"> Terms of Use </a> 
                        and <a href="/privacy">Privacy Policy</a>.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AdminRegistration;
