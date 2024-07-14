import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-hot-toast';

const AddMember = () => {
  const { id } = useParams(); 
  const [member, setMember] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    dateOfJoining: new Date().toISOString().split('T')[0], // Default to today
    shift: 'morning',
    paymentStatus: {
      status: 'unpaid',
      startDate: '',
      endDate: '',
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/members/${id}`);
          setMember(response.data);
        } catch (error) {
          console.error('Error fetching member:', error);
          toast.error('Failed to load member.');
        } finally {
          setLoading(false);
        }
      };
      fetchMember();
    }
  }, [id]);

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

  const validateDates = () => {
    const { startDate, endDate } = member.paymentStatus;
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      toast.error("Start date must be before end date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) return; // Validate dates before submission

    try {
      setLoading(true);
      if (id) {
        await axios.put(`/members/${id}`, member);
        toast.success('Member updated successfully!');
      } else {
        await axios.post('/members', member);
        toast.success('Member added successfully!');
        setMember({
          name: '',
          age: '',
          phoneNumber: '',
          dateOfJoining: new Date().toISOString().split('T')[0],
          shift: 'morning',
          paymentStatus: {
            status: 'unpaid',
            startDate: '',
            endDate: '',
          },
        });
      }
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Failed to save member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <CardHeader title={id ? "Edit Member" : "Add Member"} />
      <CardContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
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
              {member.paymentStatus.status === 'paid' && (
                <>
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
                </>
              )}
              <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                {id ? "Update Member" : "Add Member"}
              </Button>
            </Box>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddMember;