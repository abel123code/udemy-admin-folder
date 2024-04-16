import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';


const UserEnrolledCourse = ({ enrolledCourse , userId , setEnrolledCourse }) => {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentId, setPaymentId] = useState('');

  const fetchPaymentId = async (courseId, userId) => {
    try {
      const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/payment?userId=${userId}&courseId=${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (response.data.data.length > 0) {
        console.log(response)
        setPaymentId(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch payment ID:', error);
    }
  };

  const handleClickOpen = (course) => {
    fetchPaymentId(course.id, userId)
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (paymentId) {
      try {
        const response = await axios.delete(`https://udemy-clone-0d698fd51660.herokuapp.com/payment/${paymentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        if (response.status === 200) {
          const updatedCourses = enrolledCourse.filter(course => course.id !== selectedCourse.id);
          setEnrolledCourse(updatedCourses); // Update the state to trigger re-render
          setSelectedCourse(null);
        }
      } catch (error) {
        console.error('Failed to delete payment record:', error);
      }
    }
    setOpen(false);
  };

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
            <TableCell align="left">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {enrolledCourse.map((course,index) => (
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
              <TableCell align="left">
                <Button color="error" onClick={() => handleClickOpen(course)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this enrolled course? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default UserEnrolledCourse;
