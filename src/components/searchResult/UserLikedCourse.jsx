import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserLikedCourse = ({ likedCourses }) => {
  return (
    <TableContainer component={Paper} className='userLikedCourse'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Course ID</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Instructor</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {likedCourses.map((course,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {course.id}
              </TableCell>
              <TableCell align="left">{course.title}</TableCell>
              <TableCell align="left">{course.instructor.name}</TableCell>
              <TableCell align="left">${course.price.current}</TableCell>
              <TableCell align="left">{course.rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserLikedCourse;
