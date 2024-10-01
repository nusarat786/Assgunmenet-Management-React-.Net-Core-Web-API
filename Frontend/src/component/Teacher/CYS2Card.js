
import React from 'react'; 
import { Card, CardContent, Typography, CardHeader, Avatar, CardActionArea, Grid } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';

const CYSSUBCardT = ({ cys,maxWidth }) => {
    const navigate = useNavigate();

    const onCardClick = () => {
        navigate(`/student-assignment-coid/${cys?.courseOfferId}`); // Adjusted to use `courseOfferId`
    }

    return (
        <Card
            sx={{
                maxWidth:maxWidth ? maxWidth : 800, // Increased card width
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
            <CardActionArea >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <SchoolIcon />
                        </Avatar>
                    }
                    title={`${cys.subjectName} - ${cys.courseName}`} // Highlighting subject
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    subheader={`Year: ${cys.yearName} | Semester: ${cys.semesterName}`}
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Course Offer ID:</strong> {cys.courseOfferId}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Year ID:</strong> {cys.yearId}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Year Name:</strong> {cys.yearName}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Subject ID:</strong> {cys.subjectId}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Year Start:</strong> {new Date(cys.yearStart).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Year End:</strong> {new Date(cys.yearEnd).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Subject Name:</strong> {cys.subjectName} {/* Emphasizing subject */}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Course ID:</strong> {cys.courseId}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Semester ID:</strong> {cys.semesterId}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Teacher ID:</strong> {cys.teacherId}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Teacher Name:</strong> {cys.teacherFName} {cys.teacherLName}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CYSSUBCardT;


