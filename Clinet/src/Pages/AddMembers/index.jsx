import React, { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material';
import { toast } from 'react-hot-toast'; // Import toast

const AddMember = () => {
  const [member, setMember] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    dateOfJoining: '',
    shift: 'morning',
    paymentStatus: {
      status: 'unpaid',
      startDate: '',
      endDate: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('paymentStatus.')) {
      setMember((prevState) => ({
        ...prevState,
        paymentStatus: {
          ...prevState.paymentStatus,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setMember({
        ...member,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/members', member);
      console.log(response.data);
      toast.success('Member added successfully!'); 
      setMember({
        name: '',
        age: '',
        phoneNumber: '',
        dateOfJoining: '',
        shift: 'morning',
        paymentStatus: {
          status: 'unpaid',
          startDate: '',
          endDate: '',
        },
      });
    } catch (error) {
      console.error('Add member error', error);
      toast.error('Failed to add member. Please try again.'); 
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <CardHeader title="Add Member" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={member.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={member.age}
              onChange={handleChange}
              required
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={member.phoneNumber}
              onChange={handleChange}
              required
            />
            <TextField
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={member.dateOfJoining}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Shift"
              name="shift"
              value={member.shift}
              onChange={handleChange}
              required
            >
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="evening">Evening</MenuItem>
            </TextField>
            <TextField
              select
              label="Payment Status"
              name="paymentStatus.status"
              value={member.paymentStatus.status}
              onChange={handleChange}
              required
            >
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </TextField>
            <TextField
              label="Payment Start Date"
              name="paymentStatus.startDate"
              type="date"
              value={member.paymentStatus.startDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Payment End Date"
              name="paymentStatus.endDate"
              type="date"
              value={member.paymentStatus.endDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              Add Member
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMember;
