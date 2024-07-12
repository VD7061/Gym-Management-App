import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../Layout';

const Dashboard = () => {
  const { logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [shift, setShift] = useState('');
  const [paymentStatus, setPaymentStatus] = useState({ status: '', startDate: '', endDate: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch members');
    }
  };

  const addMember = async () => {
    try {
      const newMember = {
        name,
        age,
        phoneNumber,
        dateOfJoining,
        shift,
        paymentStatus, // Ensure this is structured properly
      };
      await axios.post('/members', newMember);
      fetchMembers();
      clearForm();
      toast.success('Member added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add member');
    }
  };

  const updateMember = async () => {
    try {
      const updatedMember = {
        name,
        age,
        phoneNumber,
        dateOfJoining,
        shift,
        paymentStatus,
      };
      const response = await axios.put(`/members/${editId}`, updatedMember);
      setMembers(members.map((member) => (member._id === editId ? response.data : member)));
      clearForm();
      setEditId(null);
      toast.success('Member updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update member');
    }
  };

  const deleteMember = async (id) => {
    try {
      await axios.delete(`/members/${id}`);
      setMembers(members.filter((member) => member._id !== id));
      toast.success('Member deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete member');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateMember();
    } else {
      addMember();
    }
  };

  const clearForm = () => {
    setName('');
    setAge('');
    setPhoneNumber('');
    setDateOfJoining('');
    setShift('');
    setPaymentStatus({ status: '', startDate: '', endDate: '' });
  };

  const handleEdit = (member) => {
    setName(member.name);
    setAge(member.age);
    setPhoneNumber(member.phoneNumber);
    setDateOfJoining(member.dateOfJoining);
    setShift(member.shift);
    setPaymentStatus(member.paymentStatus || { status: '', startDate: '', endDate: '' }); // Ensure this matches the new structure
    setEditId(member._id);
  };

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{editId ? 'Edit Member' : 'Add Member'}</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                 
                />
                <TextField
                  label="Age"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
               
                />
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                
                />
                <TextField
                  label="Date of Joining"
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  required
        
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Select
                  label="Shift"
                  variant="outlined"
                  fullWidth
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  required
     
                >
                  <MenuItem value="">Select Shift</MenuItem>
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="evening">Evening</MenuItem>
                </Select>
                <Select
                  label="Payment Status"
                  variant="outlined"
                  fullWidth
                  value={paymentStatus.status} // Update to use status from the object
                  onChange={(e) => setPaymentStatus({ ...paymentStatus, status: e.target.value })}
                  required
      
                >
                  <MenuItem value="">Select Payment Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                </Select>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  {editId ? 'Update Member' : 'Add Member'}
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Members</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Date of Joining</TableCell>
                      <TableCell>Shift</TableCell>
                      <TableCell>Payment Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.age}</TableCell>
                        <TableCell>{member.phoneNumber}</TableCell>
                        <TableCell>{new Date(member.dateOfJoining).toLocaleDateString()}</TableCell>
                        <TableCell>{member.shift}</TableCell>
                        <TableCell>{member.paymentStatus?.status || 'unpaid'}</TableCell> {/* Add fallback */}
                        <TableCell>
                          <IconButton onClick={() => handleEdit(member)}>
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton onClick={() => deleteMember(member._id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
        <Button variant="outlined" color="secondary" onClick={logout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Container>
    </Layout>
  );
};

export default Dashboard;
