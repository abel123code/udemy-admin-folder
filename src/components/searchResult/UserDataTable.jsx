import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserDataTable = ({ users }) => {
  return (
    <TableContainer component={Paper} className='userDataTable'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell align="left">Full Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Offers</TableCell>
            <TableCell align="left">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user._id}
              </TableCell>
              <TableCell align="left">{user.fullName}</TableCell>
              <TableCell align="left">{user.email}</TableCell>
              <TableCell align="left">{user.offers ? 'Yes' : 'No'}</TableCell>
              <TableCell align="left">{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserDataTable;
