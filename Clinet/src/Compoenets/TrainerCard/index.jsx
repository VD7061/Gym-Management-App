import React from 'react';
import { Card, CardContent, Avatar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';

const TrainerCard = ({ trainer, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar
          sx={{ width: 56, height: 56, mr: 2 }}
          src={trainer.photo || '/static/images/avatar/1.jpg'} 
          alt={`${trainer.name}'s photo`}
        />
        <Typography gutterBottom variant="h5" component="div">
          {trainer.name}
        </Typography>
      </Box>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Age: {trainer.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone: {trainer.phoneNo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {trainer.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Salary: ${trainer.salary}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Tooltip title="Delete Trainer">
          <IconButton onClick={onDelete} color="error">
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default TrainerCard;
