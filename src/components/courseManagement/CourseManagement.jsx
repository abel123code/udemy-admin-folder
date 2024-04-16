import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddCourseForm from './courseForm/AddNewCourseForm'
import Header from '../header/Header'
import './coursemanagement.css'
import axios from 'axios';
import CourseList from './CourseList';
import { genres } from './courseForm/AddNewCourseForm';
import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';


function CourseManagement() {
    const navigate = useNavigate()

    const [AllCourses , setAllCourses ] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const token = localStorage.getItem('accessToken');

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };
    
    const fetchCoursesByCategory = async () => {
        try {
            if (token) {
                const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses?genre=${encodeURIComponent(selectedCategory)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAllCourses(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching courses by category: ', error);
        }
    };
    

    useEffect(() => {
        const fetchAllCourse = async () => {
            try {
                if (token) {
                    const response = await axios.get('https://udemy-clone-0d698fd51660.herokuapp.com/courses', {
                        headers: { Authorization: `Bearer ${token}` }
                    })

                    const allCourseData = response.data.data;
                    setAllCourses(allCourseData)
                }
            } catch (error) {
                console.error('Error fetching all courses: ', error)
            }
        }

        fetchAllCourse()
    },[])

    return (
        <div className='courseManagement-cntr'>
            <Header />
            <div className='allCourse-ctnr'>
                <h2>All Courses: </h2>
                {<CourseList courses={AllCourses} />}
            </div>
            <div className='action-ctnr'>
                <button onClick={() => {
                    navigate('/CourseManagement/CourseInput')
                }} className='input-course-btn'>Input New Course</button>
            </div>
            <div className='search-by-genre'>
                <h2>Search Courses by Category:</h2>
                <FormControl fullWidth>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={selectedCategory}
                        label="Category"
                        onChange={handleCategoryChange}
                    >
                        {genres.map((genre, index) => (
                        <MenuItem key={index} value={genre}>{genre}</MenuItem>
                        ))}
                    </Select>
                    <Button 
                        variant="contained" 
                        onClick={fetchCoursesByCategory}
                        sx={{ backgroundColor: 'blueviolet' , color: 'white', margin: '2% 0'}}
                    >Search</Button>
                </FormControl>
                {selectedCategory ? (
                    <CourseList courses={AllCourses} /> 
                ) : (
                    ""
                )}
            </div>
        </div>
    )
}

export default CourseManagement
