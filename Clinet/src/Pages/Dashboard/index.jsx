import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Card, CardContent, Typography, List, ListItem } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyData: [],
    notifications: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dashboard'); // Adjust to your API endpoint
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  const { totalMembers, activeMembers, monthlyData, notifications } = dashboardData;

  const chartData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [{
      label: 'Members Joined',
      data: monthlyData,
      backgroundColor: 'rgba(75,192,192,0.4)',
    }],
  };

  return (
    <Box sx={{ padding: '10px', marginTop: '15px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Typography variant="subtitle2" component="p" color="textSecondary">
          Overview
        </Typography>
        <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MembershipStatistics totalMembers={totalMembers} activeMembers={activeMembers} />
        </Grid>
        <Grid item xs={12} md={4}>
          <NotificationSystem notifications={notifications} />
        </Grid>
        <Grid item xs={12}>
          <AnalyticsChart data={chartData} />
        </Grid>
      </Grid>
    </Box>
  );
};

const MembershipStatistics = ({ totalMembers, activeMembers }) => {
  return (
    <Card elevation={4} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h5">Membership Statistics</Typography>
        <Typography variant="h6">Total Members: {totalMembers}</Typography>
        <Typography variant="h6">Active Members: {activeMembers}</Typography>
      </CardContent>
    </Card>
  );
};

const NotificationSystem = ({ notifications }) => {
  return (
    <Card elevation={4} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h5">Notifications</Typography>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Typography key={index} color="error">
              {notification.message}
            </Typography>
          ))
        ) : (
          <Typography>No upcoming payment issues.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

const AnalyticsChart = ({ data }) => {
  return (
    <Card elevation={4} sx={{ height: '100%', marginTop: '15px', width: "60%" }}>
      <CardContent>
        <Bar data={data} />
      </CardContent>
    </Card>
  );
};

export default Dashboard;
