import React from 'react';
import { Card, CardContent, Typography, CardHeader, Avatar, CardActionArea, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const CYSCard = ({ cys }) => {

    const navigate =  useNavigate();
    const onCardClick = ()=>{
        navigate(`/student-all-sub-cys/${cys?.cysId}`)
    }
  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={() => onCardClick(cys.cysId)}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <SchoolIcon />
            </Avatar>
          }
          title={`${cys.courseName} - ${cys.yearName}`}
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          subheader={`Semester: ${cys.semesterName}`}
        />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <strong>CYS ID:</strong> {cys.cysId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Course ID:</strong> {cys.cId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Semester ID:</strong> {cys.semId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Year ID:</strong> {cys.yearId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Timestamp:</strong> {new Date(cys.ts).toLocaleString()}
          </Typography>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button size="small" variant="outlined">View Details</Button>
            <Button size="small" variant="contained" color="primary">Assignments</Button>
          </Box> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CYSCard;
