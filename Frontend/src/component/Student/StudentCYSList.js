import React from 'react';
import { Box, Typography, Grid, Card, CardHeader, Avatar, CardActionArea } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CYSCard from './CYSCard'; // Import the CYSCard component

const CYSListMain = ({ cysList}) => {
  return (
    <Box sx={{marginY:'5rem'}}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Courses You Are Enrolled In 
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cysList && cysList.length > 0 ? (
          cysList.map((cys, index) => (
            <Grid key={cys.cysId} item xs={12} sm={6} md={4} lg={3} sx={{ p: 1 }}>
              <CYSCard cys={cys} />
            </Grid>
          ))
        ) : (
          <Grid item>
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
              <CardActionArea>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SchoolIcon />
                    </Avatar>
                  }
                  title="No Data Found"
                  titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default CYSListMain;
