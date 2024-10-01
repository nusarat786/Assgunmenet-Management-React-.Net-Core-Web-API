// import * as React from 'react';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// export default function CourseOffredCard() {
//   return (
//     <Card sx={{ maxWidth: 345 }}>
//       <CardMedia
//         sx={{ height: 140 }}
//         image="/static/images/cards/contemplative-reptile.jpg"
//         title="green iguana"
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           Lizard
//         </Typography>
//         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//           Lizards are a widespread group of squamate reptiles, with over 6,000
//           species, ranging across all continents except Antarctica
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small">Share</Button>
//         <Button size="small">Learn More</Button>
//       </CardActions>
//     </Card>
//   );
// }


// import React from 'react';
// import { Card, CardContent, Typography, CardHeader, Avatar, CardActionArea, Box } from '@mui/material';
// import SchoolIcon from '@mui/icons-material/School';
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';

// const CourseOfferedCard = ({ course, onCardClick }) => {
 
//   const navigate = useNavigate();

//   handle


//   return (
//     <Card
//       sx={{
//         maxWidth: 600,
//         mx: 'auto',
//         boxShadow: 3,
//         borderRadius: 2,
//         transition: 'transform 0.2s',
//         '&:hover': {
//           transform: 'scale(1.02)',
//           boxShadow: 6,
//         },
//       }}
//     >
//       <CardActionArea onClick={() => onCardClick(course.coId)}>
//         <CardHeader
//           avatar={
//             <Avatar sx={{ bgcolor: 'primary.main' }}>
//               <SchoolIcon />
//             </Avatar>
//           }
//           title={course.cofstr}
//           titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
//         />
//         <CardContent>
//           <Typography variant="body1" gutterBottom>
//             <strong>Course Offered ID:</strong> {course.coId}
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             <strong>CYS ID:</strong> {course.cysId}
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             <strong>Subject ID:</strong> {course.sid}
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             <strong>Teacher ID:</strong> {course.tid}
//           </Typography>
//           <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
//             <Button size="small">Get reoprt</Button>
//             <Button size="small">Assignment</Button>
//           </Box>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// };



// export default CourseOfferedCard;

import React from 'react';
import { Card, CardContent, Typography, CardHeader, Avatar, CardActionArea, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const CourseOfferedCard = ({ course, onCardClick }) => {
 
  const navigate = useNavigate();

  const handlerportClick = () =>{
    navigate(`/course-offred-assignment-report/${course.coId}`)
  }


  const handleAssignmentClick = () =>{
    onCardClick(course.coId)
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
      <CardActionArea >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <SchoolIcon />
            </Avatar>
          }
          title={course.cofstr}
          titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
        />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <strong>Course Offered ID:</strong> {course.coId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>CYS ID:</strong> {course.cysId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Subject ID:</strong> {course.sid}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Teacher ID:</strong> {course.tid}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button size="small" onClick={handlerportClick}>Get reoprt</Button>
            <Button size="small" onClick={handleAssignmentClick}>Assignment</Button>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};



export default CourseOfferedCard;



