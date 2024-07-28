import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Avatar } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

// Helper function to calculate days remaining
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

const MemberDetails = () => {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/members/${memberId}`);
        setMember(response.data);
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching member details:', err);
        setError('Failed to load member details.');
        toast.error('Failed to load member details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [memberId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  if (!member) {
    return <Typography variant="h6">Member not found</Typography>;
  }

  return (

    
   


    <Box sx={{ padding: '10px', marginTop: '15px' }}>
       <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography variant="subtitle2" component="p" color="textSecondary">
        Overview
      </Typography>
      <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
       Members Details 
      </Typography>
    </Box>

    
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          alt={member.name}
          src="/static/images/avatar/1.jpg" // Placeholder image URL
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <Box>
          <Typography variant="h6" component="h1">
            {member.name}
          </Typography>
          <Typography variant="subtitle2" component="p" color="textSecondary">
            {member.shift} Shift
          </Typography>
        </Box>
      </Box>

      <Card variant="outlined" sx={{ boxShadow: 5, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            <strong>Phone Number:</strong> {member.phoneNumber}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Date of Joining:</strong> {new Date(member.dateOfJoining).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Payment Status:</strong> {member.paymentStatus.status}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Amount Paid:</strong> ₹{member.paymentStatus.amount || 0}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Days Remaining:</strong> {calculateDaysRemaining(member.paymentStatus)}
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {member.paymentHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>No payment records found</TableCell>
                  </TableRow>
                ) : (
                  member.paymentHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(record.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>₹{record.amount}</TableCell>
                      <TableCell>{record.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MemberDetails;
