import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './addnewcourseform.css'
import axios from 'axios'
import Header from '../../header/Header';
import {useNavigate, useParams} from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const genres = [
    'Web Development',
    'Data Science',
    'Business',
    'Information Technology',
    'Health',
    'Arts and Humanities',
    'Personal Development'
];


const CourseForm = ({ isEditMode = false }) => {
    //generating unique ID with this function
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
    const { courseId } = useParams();
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate()

    const [courseData, setCourseData] = useState({
        basic: {
            title: '',
            instructor: { name: '', profile_picture_url: '' },
            thumbnail_url: '',
            price: { current: '', original: '', currency: 'USD' },
            rating: '',
            number_of_ratings: ''
        },
        genre: '',
        short_description: '',
        categories: [],
        skills: [],
        last_updated: new Date().toISOString().split('T')[0], // yyyy-mm-dd
        language: '',
        subtitle_languages: [],
        course_content: {
            overview: '',
            curriculum: [
                {
                    id: generateUniqueId(),
                    section: '',
                    lectures: [{ title: '', duration: '', videoId: '' }]
                }
            ]
        },
        requirements: [],
        includes: { hours_of_video: '', articles: '', downloadable_resources: '' },
        target_audience: [],
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${courseId}`);
                setCourseData(response.data);
            } catch (error) {
                console.error('Failed to fetch course data', error);
            }
        };

        if (isEditMode) {
            fetchCourseData();
        }
    }, [courseId, isEditMode]);


    const handleCurriculumChange = (e, sectionId, field, lectureIndex, lectureField) => {
        const value = e.target.value;
        setCourseData((prevState) => {
          const newState = { ...prevState };
          newState.course_content.curriculum = newState.course_content.curriculum.map((section) => {
            if (section.id === sectionId) {
              if (lectureIndex != null) {
                // Handle lecture field update
                const updatedLectures = section.lectures.map((lecture, index) => {
                  if (index === lectureIndex) {
                    return { ...lecture, [lectureField]: value };
                  }
                  return lecture;
                });
                return { ...section, lectures: updatedLectures };
              } else {
                // Handle section field update
                return { ...section, [field]: value };
              }
            }
            return section;
          });
          return newState;
        });
      };


    const handleIncludesChange = (e, key) => {
        const value = e.target.value;
        setCourseData((prevState) => ({
            ...prevState,
            includes: {
                ...prevState.includes,
                [key]: value
            }
        }));
    };

    const handleOverviewChange = (e, section) => {
        const value = e.target.value;
        setCourseData((prevState) => ({
            ...prevState,
            course_content: {
                ...prevState.course_content,
                [section]: value
            }
        }))
    }

    const handleAddLecture = (sectionId) => {
        setCourseData((prevState) => {
            const updatedCurriculum = prevState.course_content.curriculum.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lectures: [...section.lectures, { title: '', duration: '', videoId: '' }]
                    };
                }
                return section;
            });
    
            return { ...prevState, course_content: { ...prevState.course_content, curriculum: updatedCurriculum } };
        });
    };
    
    const handleDeleteLecture = (sectionId, lectureIndex) => {
        setCourseData((prevState) => {
            const updatedCurriculum = prevState.course_content.curriculum.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lectures: section.lectures.filter((_, index) => index !== lectureIndex)
                    };
                }
                return section;
            });
    
            return { ...prevState, course_content: { ...prevState.course_content, curriculum: updatedCurriculum } };
        });
    };

    const addSection = () => {
        setCourseData((prevState) => ({
            ...prevState,
            course_content: {
                ...prevState.course_content,
                curriculum: [
                    ...prevState.course_content.curriculum,
                    { 
                        id: generateUniqueId(), // Make sure this function is defined in your component
                        section: '',
                        lectures: [{ title: '', duration: '', videoId: '' }]
                    }
                ]
            }
        }));
    };

    const handleDeleteSection = (sectionId) => {
        setCourseData((prevState) => ({
            ...prevState,
            course_content: {
                ...prevState.course_content,
                curriculum: prevState.course_content.curriculum.filter(section => section.id !== sectionId)
            }
        }));
    };   

    const handleInputChange = (e, section, field, index = null, subfield = null, lectureIndex = null) => {
        let value = e.target.value;

        if (['current', 'original', 'rating', 'number_of_ratings', 'hours_of_video', 'articles', 'downloadable_resources'].includes(subfield)) {
            value = Number(value); // Convert string to number
        }

        setCourseData((prevState) => {
          const newState = { ...prevState };
          if (index !== null) {
            if (subfield) {
              if (lectureIndex !== null) {
                newState[section][index].lectures[lectureIndex][subfield] = value;
              } else {
                newState[section][index][subfield] = value;
              }
            } else {
              newState[section][index] = value.split(',').map(item => item.trim());
            }
          } else {
            if (section === 'categories' || section === 'skills' || section === 'subtitle_languages' || section === 'requirements' || section === 'target_audience') {
                newState[section] = value.split(',').map(item => item.trim());
            } else if (field) {
                if (subfield) {
                    // Correctly handle nested object updates
                    newState[section][field][subfield] = value;
                } else {
                    newState[section][field] = value;
                }
            } else {
                newState[section] = value;
            }
          }
          return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(courseData);
        const url = "https://udemy-clone-0d698fd51660.herokuapp.com/courses";

        const preparedData = {
            ...courseData,
            basic: {
                ...courseData.basic,
                price: {
                    ...courseData.basic.price,
                    current: Number(courseData.basic.price.current),
                    original: Number(courseData.basic.price.original),
                },
                rating: Number(courseData.basic.rating),
                number_of_ratings: Number(courseData.basic.number_of_ratings),
            },
            includes: {
                ...courseData.includes,
                hours_of_video: Number(courseData.includes.hours_of_video),
                articles: Number(courseData.includes.articles),
                downloadable_resources: Number(courseData.includes.downloadable_resources),
            },
            // Any other fields that need to be converted
        };

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' // Ensure this matches your server requirements
            }
        };

    try {
        //console.log(preparedData)
        const response = await axios.post(url,preparedData,config)

        alert('Successfully submitted new course')
        navigate('/CourseManagement')

    } catch (error) {
        console.error('Unable to Input new course: ', error)
    }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const url = `https://udemy-clone-0d698fd51660.herokuapp.com/courses/${courseData._id}`;
    
        try {
            const response = await axios.patch(url, courseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            //console.log(response)
            alert(`Successfully Edited course`);
            navigate('/CourseManagement');
        } catch (error) {
            console.error('Unable to update course: ', error);
        }
    };
    
  // The actual form will be very lengthy. Here's a pattern for basic and one curriculum entry.
  return (
    <>
        <Header />
        <form onSubmit={isEditMode ? handleUpdate : handleSubmit} className='AddCourseForm'>
            <IconButton onClick={() => {
                navigate('/CourseManagement')
            }}>
                <ArrowBackIcon />
            </IconButton>
            <h2>{isEditMode ? 'Edit Course: ' : 'Input New Course: '}</h2>
            <Box className="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, marginBottom: 2 }}>
                <Typography variant="h6">Basic Information:</Typography>
                <div className='basic-information'>
                    <TextField
                        label="Title"
                        value={courseData.basic.title}
                        onChange={(e) => handleInputChange(e, 'basic', 'title')}
                        required
                    />
                    <div className='instructor-details'>
                        <TextField
                            label="Instructor Name"
                            value={courseData.basic.instructor.name}
                            onChange={(e) => handleInputChange(e, 'basic', 'instructor', null, 'name')}
                            required
                        />
                        <TextField
                            label="Instructor Picture URL"
                            value={courseData.basic.instructor.profile_picture_url}
                            onChange={(e) => handleInputChange(e, 'basic', 'instructor', null, 'profile_picture_url')}
                        />
                    </div>
                    <TextField
                        label="Thumbail URL"
                        value={courseData.basic.thumbnail_url}
                        onChange={(e) => handleInputChange(e, 'basic', 'thumbnail_url')}
                    />
                    <div className='course-price'>
                        <TextField
                            label="Current price"
                            value={courseData.basic.price.current}
                            type="number"
                            onChange={(e) => handleInputChange(e, 'basic', 'price', null, 'current')}
                        />
                        <TextField
                            label="Original price"
                            value={courseData.basic.price.original}
                            type="number"
                            onChange={(e) => handleInputChange(e, 'basic', 'price', null, 'original')}
                        />
                    </div>
                    <TextField
                            label="Rating"
                            value={courseData.basic.rating}
                            type="number"
                            onChange={(e) => handleInputChange(e, 'basic', 'rating')}
                    />
                    <TextField
                            label="No. of Rating"
                            type="number"
                            value={courseData.basic.number_of_ratings}
                            onChange={(e) => handleInputChange(e, 'basic', 'number_of_ratings')}
                    />
                </div>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="genre-label">Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        id="genre-select"
                        value={courseData.genre}
                        label="Genre"
                        onChange={(e) => handleInputChange(e, 'genre')}
                        required
                    >
                        {genres.map((genre, index) => (
                            <MenuItem key={index} value={genre}>{genre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="h6">Detailed Information:</Typography>
                <div className='other-information'>
                    <TextField
                        label="Short Description"
                        value={courseData.short_description}
                        onChange={(e) => handleInputChange(e, 'short_description')}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Categories"
                        variant="outlined"
                        value={courseData.categories.join(',')} // Convert array to comma-separated string for display
                        onChange={(e) => handleInputChange(e, 'categories')}
                        margin="normal"
                        helperText="Key in with a comma between"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Skills"
                        variant="outlined"
                        value={courseData.skills.join(',')} // Convert array to comma-separated string for display
                        onChange={(e) => handleInputChange(e, 'skills')}
                        margin="normal"
                        helperText="Key in with a comma between"
                        required
                    />
                    <TextField
                        label="Language"
                        value={courseData.language}
                        onChange={(e) => handleInputChange(e, 'language')}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Subtitle language"
                        variant="outlined"
                        value={courseData.subtitle_languages.join(',')} // Convert array to comma-separated string for display
                        onChange={(e) => handleInputChange(e, 'subtitle_languages')}
                        margin="normal"
                        helperText="Key in with a comma between"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Requirements"
                        variant="outlined"
                        value={courseData.requirements.join(',')} // Convert array to comma-separated string for display
                        onChange={(e) => handleInputChange(e, 'requirements')}
                        margin="normal"
                        helperText="Key in with a comma between"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Target Audience"
                        variant="outlined"
                        value={courseData.target_audience.join(',')} // Convert array to comma-separated string for display
                        onChange={(e) => handleInputChange(e, 'target_audience')}
                        margin="normal"
                        helperText="Key in with a comma between"
                        required
                    />
                </div>

                <Typography variant="h6">Includes:</Typography>
                <div className='includes-information'>
                    <TextField
                        label="Hours of Video"
                        value={courseData.includes.hours_of_video}
                        onChange={(e) => handleIncludesChange(e, 'hours_of_video')}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Articles"
                        value={courseData.includes.articles}
                        onChange={(e) => handleIncludesChange(e, 'articles')}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Downloadable Resources"
                        value={courseData.includes.downloadable_resources}
                        onChange={(e) => handleIncludesChange(e, 'downloadable_resources')}
                        margin="normal"
                        required
                    />
                </div>

                <Typography variant="h6">Course Content:</Typography>
                <div className='course-content'>
                    <TextField
                        label="Course Overview"
                        value={courseData.course_content.overview}
                        onChange={(e) => handleOverviewChange(e, 'overview')}
                        margin="normal"
                        required
                    />
                    <div className='curriculum'>
                        <Typography variant="h6">Curriculum</Typography>
                        {
                        courseData.course_content.curriculum.map((section, sectionIndex) => (
                            <div key={section.id}>
                                <TextField
                                    label="Section Title"
                                    value={section.section}
                                    onChange={(e) => handleCurriculumChange(e, section.id, 'section')}
                                />
                                {section.lectures.map((lecture, lectureIndex) => (
                                    <div key={lectureIndex}>
                                    <TextField
                                        label="Lecture Title"
                                        value={lecture.title}
                                        onChange={(e) => handleCurriculumChange(e, section.id, null, lectureIndex, 'title')}
                                    />
                                    <TextField
                                        label="Lecture Duration"
                                        value={lecture.duration}
                                        onChange={(e) => handleCurriculumChange(e, section.id, null, lectureIndex, 'duration')}
                                    />
                                    <TextField
                                        label="Video ID"
                                        value={lecture.videoId}
                                        onChange={(e) => handleCurriculumChange(e, section.id, null, lectureIndex, 'videoId')}
                                    />
                                    <Button onClick={() => handleDeleteLecture(section.id, lectureIndex)}>Delete Lecture</Button>
                                    </div>
                                ))}
                                <Button onClick={() => handleAddLecture(section.id)}>Add Lecture</Button>
                                <Button onClick={() => handleDeleteSection(section.id)}>Delete Section</Button>
                            </div>

                        ))
                        }
                        <Button onClick={addSection}>Add Section</Button>
                    </div>
                </div>

            </Box>
            {isEditMode ? (
                <Box component="div" sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button type="submit" variant="contained" color="primary">Edit Course</Button>
                </Box>
            ) : (
                <Box component="div" sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button type="submit" variant="contained" color="primary">Submit Course</Button>
                </Box>
            )}
        </form>
    </>
  );
};

export default CourseForm;
