import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Card, CardContent, Typography, List, ListItem } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalAmountPaid: 0,
    monthlyData: [],
    notifications: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  const { totalMembers, activeMembers, totalAmountPaid, monthlyData, notifications } = dashboardData;

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

  const revenueData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [{
      label: 'Total Revenue',
      data: monthlyData.map(monthly => monthly * 50), // Example revenue based on a fixed member fee
      backgroundColor: 'rgba(255,99,132,0.4)',
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

      <Grid container spacing={3}>
        {/* First Row */}
        <Grid item xs={12} md={6}>
          <MembershipStatistics 
            totalMembers={totalMembers} 
            activeMembers={activeMembers} 
            totalAmountPaid={totalAmountPaid} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <NotificationSystem notifications={notifications} />
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} md={6}>
          <AnalyticsChart data={chartData} title="Monthly Members Joined" />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalyticsChart data={revenueData} title="Monthly Revenue" />
        </Grid>
      </Grid>
    </Box>
  );
};

const MembershipStatistics = ({ totalMembers, activeMembers, totalAmountPaid }) => {
  return (
    <Card elevation={3} sx={{ padding: '15px', backgroundColor: '#f0f8ff' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <PersonIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> 
          Membership Statistics
        </Typography>
        <Typography variant="h6">Total Members: {totalMembers}</Typography>
        <Typography variant="h6">Active Members: {activeMembers}</Typography>
        <Typography variant="h6">
          <AttachMoneyIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> 
          Total Amount Paid: ${totalAmountPaid.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const NotificationSystem = ({ notifications }) => {
  return (
    <Card elevation={3} sx={{ padding: '15px', backgroundColor: '#fff8e1' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <NotificationsActiveIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> 
          Notifications
        </Typography>
        {notifications.length > 0 ? (
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index} sx={{ color: 'error.main' }}>
                {notification.message}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No upcoming payment issues.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

const AnalyticsChart = ({ data, title }) => {
  return (
    <Card elevation={3} sx={{ padding: '15px', height: '400px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Box sx={{ height: '300px' }}>
          <Bar data={data} options={{ maintainAspectRatio: false }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
