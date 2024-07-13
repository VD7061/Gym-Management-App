import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
} from '@mui/material';
import { toast } from 'react-hot-toast';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('name');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('/members');
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members.');
      }
    };

    fetchMembers();
  }, []);

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const filteredMembers = members.filter(member => {
    return member.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedMembers = filteredMembers.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    }
    return a[sortColumn] < b[sortColumn] ? 1 : -1;
  });

  return (
    <Card variant="outlined" sx={{ maxWidth: '100%', margin: 'auto', mt: 5 }}>
      <CardHeader title="Manage Members" />
      <CardContent>
        <TextField
          label="Search Members"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'name'}
                    direction={sortColumn === 'name' ? sortDirection : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'age'}
                    direction={sortColumn === 'age' ? sortDirection : 'asc'}
                    onClick={() => handleSort('age')}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'phoneNumber'}
                    direction={sortColumn === 'phoneNumber' ? sortDirection : 'asc'}
                    onClick={() => handleSort('phoneNumber')}
                  >
                    Phone Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'dateOfJoining'}
                    direction={sortColumn === 'dateOfJoining' ? sortDirection : 'asc'}
                    onClick={() => handleSort('dateOfJoining')}
                  >
                    Date of Joining
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'shift'}
                    direction={sortColumn === 'shift' ? sortDirection : 'asc'}
                    onClick={() => handleSort('shift')}
                  >
                    Shift
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'paymentStatus.status'}
                    direction={sortColumn === 'paymentStatus.status' ? sortDirection : 'asc'}
                    onClick={() => handleSort('paymentStatus.status')}
                  >
                    Payment Status
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMembers.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.age}</TableCell>
                  <TableCell>{member.phoneNumber}</TableCell>
                  <TableCell>{new Date(member.dateOfJoining).toLocaleDateString()}</TableCell>
                  <TableCell>{member.shift}</TableCell>
                  <TableCell>{member.paymentStatus.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ManageMembers;
