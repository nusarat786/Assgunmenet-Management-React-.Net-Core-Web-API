import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Divider } from '@mui/material';

const StudentCard = ({ student, maxWidth = 'md' }) => {
  return (
    <Card sx={{ maxWidth, marginX: 'auto', boxShadow: 3, borderRadius: 2, padding: 2, backgroundColor: '#f9f9f9' }}>
      <CardContent>
        {/* Avatar with Initials */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Avatar sx={{ bgcolor: 'rgb(25, 118, 210)', marginRight: 2 }}>
            {student.sfirstName[0]}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {student.sfirstName} {student.sSurname}
          </Typography>
        </Box>

        {/* Divider to separate content */}
        <Divider sx={{ marginBottom: 2 }} />

        {/* Personal Information */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Date of Birth: {new Date(student.dob).toLocaleDateString()}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Phone: {student.phone}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Email: {student.email}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Registration Date: {new Date(student.ts).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
