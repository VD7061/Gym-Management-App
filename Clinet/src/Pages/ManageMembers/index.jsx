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
  Paper,
  Box,
  Avatar,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery,
  CircularProgress,
  Tooltip,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Primary color
    },
    secondary: {
      main: '#dc004e', // Secondary color
    },
  },
});

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/members');
        const updatedMembers = response.data.map(member => {
          const currentDate = new Date();
          const endDate = new Date(member.paymentStatus.endDate);
          if (member.paymentStatus.status === 'paid' && currentDate > endDate) {
            return {
              ...member,
              paymentStatus: {
                ...member.paymentStatus,
                status: 'unpaid',
                amount: 0
              }
            };
          }
          return member;
        });
        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

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

  const calculateDaysRemaining = (paymentStatus) => {
    if (paymentStatus.status === 'unpaid') {
      return 'N/A';
    }
    const currentDate = new Date();
    const end = new Date(paymentStatus.endDate);
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
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '10px', marginTop: '15px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
          <Typography variant="subtitle2" component="p" color="textSecondary">
            Overview
          </Typography>
          <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
            Manage Members
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ boxShadow: 5, borderRadius: 2 }}>
          <CardContent>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%', // Ensure it takes the full height of the card
                  padding: 2 // Optional: Add some padding
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
               <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
  <TextField
    label="Search Members"
    variant="outlined"
    sx={{ width: "50%", mr: 1 }}
    onChange={(e) => setSearchTerm(e.target.value)}
    size="small"
  />
</Box>

                {isMobile ? (
                  <Grid container spacing={2}>
                    {filteredMembers.map((member) => (
                      <Grid item xs={12} sm={6} key={member._id}>
                        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 1, '&:hover': { boxShadow: 6 } }}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" alignItems="flex-start">
                              <Avatar sx={{ bgcolor: getRandomColor(), mr: 2, width: 56, height: 56 }}>
                                {member.name.charAt(0)}
                              </Avatar>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{member.name}</Typography>
                              <Typography variant="body2" color="textSecondary">{member.phoneNumber}</Typography>
                              <Typography variant="body2" color="textSecondary">{member.shift}</Typography>
                              <Typography variant="body2">Days Remaining: {calculateDaysRemaining(member.paymentStatus)}</Typography>
                              <Typography variant="body2">Paid Amount: ₹{member.paymentStatus.amount || 0}</Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                              <Tooltip title="Edit Member">
                                <IconButton onClick={() => navigate(`/edit-member/${member._id}`)} color="primary">
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Member">
                                <IconButton onClick={() => handleOpenDialog(member._id)} color="error">
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Date of Joining</TableCell>
                            <TableCell>Shift</TableCell>
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Days Remaining</TableCell>
                            <TableCell>Paid Amount</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredMembers.map((member) => (
                            <TableRow key={member._id}>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Avatar sx={{ bgcolor: getRandomColor(), mr: 2 }}>
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
                              <TableCell>{member.paymentStatus.amount || 0}</TableCell>
                              <TableCell>
                                <Tooltip title="Edit Member">
                                  <IconButton onClick={() => navigate(`/edit-member/${member._id}`)} color="primary">
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Member">
                                  <IconButton onClick={() => handleOpenDialog(member._id)} color="error">
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this member?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ManageMembers;
