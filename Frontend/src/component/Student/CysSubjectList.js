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

const CysSubjectList = ({ cyssub }) => {
    return (
        <Box sx={{marginY:'6rem'}}>
            <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
            >
                Subjects ({cyssub.length})
            </Typography>

            <Box>
                {cyssub && cyssub.length > 0 ? (
                    cyssub.map((cys, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 2, // Adds margin between the cards for spacing
                                mx: { xs: 2, sm: 3, md: 5 }, // Responsive margin
                            }}
                        >
                            <CYSSUBCard cys={cys} index={index + 1} />
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

export default CysSubjectList;
