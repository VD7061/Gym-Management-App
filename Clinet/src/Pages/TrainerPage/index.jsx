import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TrainerCard from '../../Compoenets/TrainerCard';
const TrainerPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get('/trainers');
        // Ensure trainers is an array
        const trainersData = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched trainers:', trainersData); // Log the response data
        setTrainers(trainersData);
      } catch (error) {
        console.error('Error fetching trainers:', error);
        toast.error('Failed to load trainers.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleDelete = async (trainerId) => {
    try {
      await axios.delete(`/trainers/${trainerId}`);
      setTrainers(trainers.filter((trainer) => trainer._id !== trainerId));
      toast.success('Trainer deleted successfully.');
    } catch (error) {
      console.error('Error deleting trainer:', error);
      toast.error('Failed to delete trainer.');
    }
  };

  const handleOpenDialog = (trainerId) => {
    setSelectedTrainerId(trainerId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTrainerId(null);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedTrainerId);
    handleCloseDialog();
  };

  return (
    <Box sx={{ padding: '10px', marginTop: '15px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" component="p" color="textSecondary">
            Overview
          </Typography>
          <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
            Manage Trainers
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/addtrainer')}
        >
          Add Trainer
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        Array.isArray(trainers) && trainers.length > 0 ? (
          <Grid container spacing={2}>
            {trainers.map((trainer) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={trainer._id}>
                <TrainerCard trainer={trainer} onDelete={() => handleOpenDialog(trainer._id)} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No trainers available.</Typography>
        )
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this trainer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerPage;
