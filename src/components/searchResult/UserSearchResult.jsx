import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Header from '../header/Header';
import axios from 'axios'
import UserDataTable from './UserDataTable';
import './userSearchResult.css'
import { useNavigate } from 'react-router-dom';
import UserLikedCourse from './UserLikedCourse';
import UserAddToCart from './UserAddToCart';
import UserEnrolledCourse from './UserEnrolledCourse';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const UserSearchResults = () => {
    const [user, setUser] = useState([]);
    const [likedCourses, setLikedCourses] = useState([]);
    const [addToCart, setaddToCart] = useState([]);
    const [enrolledCourse , setEnrolledCourse] = useState([])


    const location = useLocation();

    const detailsJSON = localStorage.getItem('details');
    const personalDetails = JSON.parse(detailsJSON);
    const userId = personalDetails._id;
    const token = localStorage.getItem('accessToken');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const navigate = useNavigate()

    const fetchLikedCourses = async (userId) => {
        try {
          const response = await fetch(`https://udemy-clone-0d698fd51660.herokuapp.com/course-likes?userId=${userId}`, {headers});
          if (response.ok) {
            const courses = await response.json();
            const courseArray = courses.data;
            //console.log(courseArray)
  
            const courseDetailsPromises = courseArray.map(async (course) => {
              const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${course.courseId}`);
              return {
                ...response.data.basic, // Assuming you want to keep the basic info
                id: course.courseId // Keep track of the course ID if needed
              };
            });
  
            const courseDetails = await Promise.all(courseDetailsPromises);
            
            setLikedCourses(courseDetails)
          }
        } catch (error) {
          console.error("Failed to fetch liked courses", error);
        }
    };

    const fetchAddToCart = async (userId) => {
      try {
        const response = await fetch(`https://udemy-clone-0d698fd51660.herokuapp.com/add-to-cart?userId=${userId}`, {headers});
        if (response.ok) {
          const courses = await response.json();
          const courseArray = courses.data;
          //console.log(courseArray)

          const courseDetailsPromises = courseArray.map(async (course) => {
            const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${course.courseId}`);
            return {
              ...response.data.basic, // Assuming you want to keep the basic info
              id: course.courseId // Keep track of the course ID if needed
            };
          });

          const courseDetails = await Promise.all(courseDetailsPromises);
          
          setaddToCart(courseDetails)
        }
      } catch (error) {
        console.error("Failed to fetch liked courses", error);
      }
    };

    const fetchEnrolledCourse = async (userId) => {
      try {
        const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/payment?userId=${userId}`, {headers})
        const courseArray = response.data.data;
        //console.log(courseArray)

        const courseDetailsPromises = courseArray.map(async (course) => {
          const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${course.courseId}`);
          return {
            ...response.data.basic, // Assuming you want to keep the basic info
            id: course.courseId // Keep track of the course ID if needed
          };
        });
        const courseDetails = await Promise.all(courseDetailsPromises);

        setEnrolledCourse(courseDetails)
      } catch (error) {
        console.error('Error fetching Enrolled Courses: ', error)
      }
    }


  
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('query');
      
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/user?email=${query}`,{headers})

          if (response) {
            const userData = response.data.data
            setUser(userData)

            const firstUser = userData[0];
            if (firstUser) {
                fetchLikedCourses(firstUser._id)
                fetchAddToCart(firstUser._id)
                fetchEnrolledCourse(firstUser._id)
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
  
      fetchUserData();
    }, [location.search]);


    return (
        <div>
        <Header />
        <div className='search-result-ctnr'>
            <div className='back-button-ctnr'>
              <IconButton onClick={() => {
                  navigate('/UserManagement')
              }} >
                  <ArrowBackIcon className='arrow-icon' />
              </IconButton>
            </div>

            {user.length > 0 ? (
                <>
                  <div className='user-data'>
                      <h2>User Data: </h2>
                      <UserDataTable users={user} />
                  </div>
                  <div className='liked-course-data'>
                      <h2>User's Liked Courses: </h2>
                      {likedCourses.length > 0 ? (
                        <UserLikedCourse likedCourses={likedCourses} />
                      ) : (
                        <Typography variant="body1">No liked courses present.</Typography>
                      )}
                  </div>
                  <div className='add2cart-course-data'>
                      <h2>User's AddToCart Courses: </h2>
                      {addToCart.length > 0 ? (
                        <UserAddToCart addToCartCourses={addToCart} />
                      ) : (
                        <Typography variant="body1">No courses in AddToCart.</Typography>
                      )}
                  </div>
                  <div className='enrolled-course-data'>
                      <h2>User's Enrolled Courses: </h2>
                      {addToCart.length > 0 ? (
                        <UserEnrolledCourse 
                          enrolledCourse={enrolledCourse}  
                          userId={user[0]._id}
                          setEnrolledCourse={setEnrolledCourse}
                        />
                      ) : (
                        <Typography variant="body1">No Enrolled Courses.</Typography>
                      )}
                  </div>
                </>
            ) : (
                <div className='no_results'>
                    <h2>Sorry, we couldn't find any results</h2>
                    <p>Try adjusting your search. Here are some ideas:</p>
                    <ul>
                        <li>Make sure all words are spelled correctly</li>
                    </ul>
                    <button className='back-btn' onClick={() => {navigate('/UserManagement')}}>
                        Back
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};

export default UserSearchResults;
