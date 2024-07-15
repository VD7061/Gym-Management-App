import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/members/${id}`);
        setMember(response.data);
      } catch (error) {
        console.error('Error fetching member:', error);
        toast.error('Failed to load member details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
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
    if (!validateDates()) return;

    try {
      setLoading(true);
      await axios.put(`/members/${id}`, member);
      toast.success('Member updated successfully!');
      navigate('/members'); // Navigate back after successful update
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '10px', marginTop: '15px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Typography variant="subtitle2" component="p" color="textSecondary">
          Overview
        </Typography>
        <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
          Edit Member
        </Typography>
      </Box>

      <Card variant="elevation" sx={{ maxWidth: "100%", mt: 3, boxShadow:"5" , borderRadius: "10px"}}>
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
                  value={member.dateOfJoining.split('T')[0]} // Format date for input
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
                      value={member.paymentStatus.startDate ? member.paymentStatus.startDate.split('T')[0] : ''} // Format date for input
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Payment End Date"
                      name="paymentStatus.endDate"
                      type="date"
                      value={member.paymentStatus.endDate ? member.paymentStatus.endDate.split('T')[0] : ''} // Format date for input
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </>
                )}
                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                  Update Member
                </Button>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditMember;
