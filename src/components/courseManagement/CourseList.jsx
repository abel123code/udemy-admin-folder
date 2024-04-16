import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import {useNavigate} from 'react-router-dom'

const CourseList = ({ courses }) => {
  const navigate = useNavigate()
  return (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="left">Course ID</TableCell>
          <TableCell align="left">Title</TableCell>
          <TableCell align="left">Instructor</TableCell>
          <TableCell align="left">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course._id}>
            <TableCell align="left">{course._id}</TableCell>
            <TableCell align="left">{course.basic.title}</TableCell>
            <TableCell align="left">{course.basic.instructor.name}</TableCell>
            <TableCell align="left">
              <Button onClick={() => navigate(`/CourseManagement/EditCourse/${course._id}`)}>Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
};


export default CourseList;