import React, { useState } from 'react'
import Header from '../header/Header'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button' ;
import './userManagement.css'

function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to the search results page with the searchTerm as a query parameter
        navigate(`/UserManagement/search-results?query=${searchTerm}`);
    };

  return (
    <div>
      <Header />
      <div className='user-management-ctnr'>
        <h2>Search for Users</h2>
        <form onSubmit={handleSearch}>
            <TextField
                className='text-field'
                label="Search by Email"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type='email'
                required
            />
            <Button type="submit" variant="contained" style={{ backgroundColor: 'blueviolet', color: 'white' }}>
                Search
            </Button>
        </form>
      </div>
    </div>
  )
}

export default UserManagement
