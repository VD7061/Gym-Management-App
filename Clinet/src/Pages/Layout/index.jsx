import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import profileImg from '../../assets/react.svg'; // Replace with your profile image path

const Layout = ({ children }) => {
  const [gymName, setGymName] = useState('');
  const [userName, setUserName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/details'); 
        if (response.data.success) {
          setGymName(response.data.user.gymName);
          setUserName(response.data.user.name); 
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" style={{ background: "#8008A9" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
          <MenuIcon/>
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {gymName || 'My Gym'}
          </Typography>
          <img
            src={profileImg}
            alt="Profile"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <span style={{ marginLeft: '10px', color: '#ffffff' }}>{userName}</span>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={toggleDrawer}>
        <List style={{ width: 250 }}>
          {['Dashboard', 'Add Member', 'Manage Members', 'Payments'].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Container style={{ flex: 1, padding: '20px' }}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
