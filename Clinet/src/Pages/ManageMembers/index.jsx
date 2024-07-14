import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
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
  Grid,
  Avatar,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('name');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

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

  const handleDelete = async (memberId) => {
    try {
      await axios.delete(`/members/${memberId}`);
      setMembers(members.filter((member) => member._id !== memberId));
      toast.success('Member deleted successfully.');
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member.');
    }
  };

  const handleOpenDialog = (memberId) => {
    setSelectedMemberId(memberId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMemberId(null);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedMemberId);
    handleCloseDialog();
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMembers = filteredMembers.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    }
    return a[sortColumn] < b[sortColumn] ? 1 : -1;
  });

  const calculateDaysRemaining = (paymentStatus) => {
    if (paymentStatus.status === 'unpaid') {
      return 'N/A';
    }

    const currentDate = new Date();
    const end = new Date(paymentStatus.endDate);
    
    // Check if the current date is past the end date
    if (currentDate > end) {
      return 0; // or return a message like 'Expired'
    }

    const diffTime = Math.abs(end - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

    const getRandomColor = () => {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33A1',
      '#F1C40F', '#8E44AD', '#3498DB', '#E67E22'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };


  return (
    <Box sx={{ padding: '10px', marginTop: '15px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Typography variant="subtitle2" component="p" color="textSecondary">
          Overview
        </Typography>
        <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
          Manage Members
        </Typography>
      </Box>

      <Card variant="elevation" sx={{ boxShadow:"5" , borderRadius: "10px"}}>
        <CardContent>
          <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Search Members"
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>


          {isMobile ? (
          
            <Grid container spacing={2}>
              {sortedMembers.map((member) => (
                <Grid item xs={12} sm={6} key={member._id}>
                  <Card>
                    <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
  <Avatar sx={{ bgcolor: getRandomColor(), mr: 2 }}>
    {member.name.charAt(0)}
  </Avatar>
  <Typography variant="h8">{member.name}</Typography>
  <Typography variant="h8">{member.phoneNumber}</Typography>
  <Typography variant="h8">{member.shift}</Typography>
 
  <Typography variant="h8">{calculateDaysRemaining(member.paymentStatus)}</Typography>
</Box>  

                      <Typography>Payment Status: {member.paymentStatus.status}</Typography>
                      <Box sx={{ mt: 2 }}>
                        <IconButton onClick={() => navigate(`/edit-member/${member._id}`)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDialog(member._id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Render table for larger screens
            <div style={{ maxHeight: '600px', overflow: 'auto' }}>
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
                      <TableCell>
                        <TableSortLabel
                          active={sortColumn === 'daysRemaining'}
                          direction={sortColumn === 'daysRemaining' ? sortDirection : 'asc'}
                          onClick={() => handleSort('daysRemaining')}
                        >
                          Days Remaining
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedMembers.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: getRandomColor(), mr: 3 }}>
                              {member.name.charAt(0)}
                            </Avatar>
                            {member.name}
                          </Box>
                        </TableCell>
                        <TableCell>{member.age}</TableCell>
                        <TableCell>{member.phoneNumber}</TableCell>
                        <TableCell>{new Date(member.dateOfJoining).toLocaleDateString()}</TableCell>
                        <TableCell>{member.shift}</TableCell>
                        <TableCell>{member.paymentStatus.status}</TableCell>
                        <TableCell>{calculateDaysRemaining(member.paymentStatus)}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => navigate(`/edit-member/${member._id}`)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleOpenDialog(member._id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this member? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageMembers;
