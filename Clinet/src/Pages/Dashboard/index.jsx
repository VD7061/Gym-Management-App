import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/members', { withCredentials: true });
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const joiningDates = members.map(member => new Date(member.dateOfJoining));
  const joiningMonths = joiningDates.map(date => date.getMonth());

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Members Joined',
        data: joiningMonths.reduce((acc, month) => {
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, new Array(12).fill(0)),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Card to show total members */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Members</Typography>
              <Typography variant="h2">{members.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

       
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Bar data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
