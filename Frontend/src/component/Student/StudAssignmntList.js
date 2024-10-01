import React from 'react';
import {
    Grid,
    Card,
    Typography,
    CardHeader,
    Avatar,
    CardActionArea,
    Box,
} from '@mui/material';
import CYSSUBCard from './CYSSubjectCard';
import StudentAssignmentCard from './SudentAssignmentCard';

const StudAssignmntList = ({ assignments }) => {
    return (
        <Box sx={{marginY:'3rem'}}>
            <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
            >
                Assignments ({assignments.length})
            </Typography>

            <Box>
                {assignments && assignments.length > 0 ? (
                    assignments.map((assignment, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 2, // Adds margin between the cards for spacing
                                mx: { xs: 2, sm: 3, md: 5 }, // Responsive margin
                            }}
                        >                            
                            <StudentAssignmentCard assignment={assignment} index={index+1}/>
                        </Box>
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
                                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }} />}
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

export default StudAssignmntList;
