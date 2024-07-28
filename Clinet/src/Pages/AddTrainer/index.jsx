import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';

const AddTrainer = () => {
  // State to manage form input
  const [trainer, setTrainer] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    address: '',
    salary: ''
  });
  
  // State to manage loading spinner
  const [loading, setLoading] = useState(false);

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer({ ...trainer, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert age and salary to numbers
      const trainerData = {
        ...trainer,
        age: Number(trainer.age),
        salary: Number(trainer.salary),
      };

      // Post data to the server
      await axios.post('/trainers', trainerData);

      // Show success message
      toast.success('Trainer added successfully.');

      // Clear form fields
      setTrainer({
        name: '',
        age: '',
        phoneNumber: '',
        address: '',
        salary: ''
      });
    } catch (error) {
      // Show error message
      console.error('Error adding trainer:', error);
      toast.error('Failed to add trainer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Trainer
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={trainer.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Age"
            name="age"
            value={trainer.age}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={trainer.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Address"
            name="address"
            value={trainer.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Salary"
            name="salary"
            value={trainer.salary}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add Trainer'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddTrainer;
