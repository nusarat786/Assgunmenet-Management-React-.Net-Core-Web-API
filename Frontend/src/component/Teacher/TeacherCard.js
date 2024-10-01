import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Divider } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const TeacherCard = ({ teacher, maxWidth = 'md' }) => {
  return (
    <Card sx={{ maxWidth, marginX: 'auto', boxShadow: 3, borderRadius: 2, padding: 2, backgroundColor: '#f9f9f9' }}>
      <CardContent>
        {/* Avatar with Initials */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Avatar sx={{ bgcolor: 'rgb(25, 118, 210)', marginRight: 2 }}>
            {teacher?.tfname[0]}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {teacher.tfname} {teacher.tsname}
          </Typography>
        </Box>

        {/* Divider to separate content */}
        <Divider sx={{ marginBottom: 2 }} />

        {/* Personal Information */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Date of Birth: {new Date(teacher.tdob).toLocaleDateString()}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Phone: {teacher.tphone}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Email: {teacher.temail}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Joining Date: {new Date(teacher.tjoiningDate).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TeacherCard;
