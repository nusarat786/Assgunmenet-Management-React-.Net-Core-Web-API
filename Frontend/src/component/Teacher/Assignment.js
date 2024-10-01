// import * as React from 'react';
// import Box from '@mui/material/Box';
// import CourseOffredCard from './CourseOffredCard';

// export default function TeacherAllCourseoffred() {
//   return (
//     <Box component="section" sx={{  border: '1px dashed grey',width:'100vw' }}>
//       <CourseOffredCard/>
//       <CourseOffredCard/>
//     </Box>
//   );
// }

// import React from 'react';
// import { Grid2, Card, CardContent, Typography } from '@mui/material';

// function TeacherAllCourseoffred() {
//   return (
//     <Grid2 container direction="column" spacing={2} padding={2} >
//       <Grid2 item>
//         <Card >
//           <CardContent>
//             <Typography variant="h5">Card 1</Typography>
//             <Typography variant="body2">This is the first card.</Typography>
//           </CardContent>
//         </Card>
//       </Grid2>
//       <Grid2 item>
//         <Card>
//           <CardContent>
//             <Typography variant="h5">Card 2</Typography>
//             <Typography variant="body2">This is the second card.</Typography>
//           </CardContent>
//         </Card>
//       </Grid2>
//       <Grid2 item>
//         <Card>
//           <CardContent>
//             <Typography variant="h5">Card 3</Typography>
//             <Typography variant="body2">This is the third card.</Typography>
//           </CardContent>
//         </Card>
//       </Grid2>
//     </Grid2>
//   );
// }

// export default TeacherAllCourseoffred;


import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardHeader,
  Avatar,
  CardActionArea,
  Box
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {handleError ,handleClose,showAlertMessage,showSuccess} from '../Helper/GetError';
//import { Assignment } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

// Sample data
const courseOffereds = [
  {
    coId: 1,
    cysId: 1,
    sid: 2,
    tid: 1008,
    ts: '2024-08-31T23:59:13',
    cofstr: '2024 MCA SEM-1 c# fghgfh gfhgf',
  },
  {
    coId: 2,
    cysId: 2,
    sid: 3,
    tid: 1014,
    ts: '2024-08-18T21:21:09.233',
    cofstr: '2023 MCA SEM-0 Python nmv nmv',
  },
  {
    coId: 5,
    cysId: 1,
    sid: 3,
    tid: 1014,
    ts: '2024-08-19T09:15:05.3',
    cofstr: '2024 MCA SEM-1 Python nmv nmv',
  },
  {
    coId: 6,
    cysId: 3,
    sid: 3,
    tid: 1014,
    ts: '2024-08-19T09:40:55.627',
    cofstr: '2024 BE SEM-1 Python nmv nmv',
  },
  {
    coId: 7,
    cysId: 1,
    sid: 2,
    tid: 1014,
    ts: '2024-08-19T09:40:55.627',
    cofstr: '2024 MCA SEM-1 c# nmv nmv',
  },
];

function Assignment() {
  const navigate = useNavigate();
  const [cof,setCof] = useState([]);
  // var getStrings = (cofstr) =>{
  //   let t = cofstr.split(" ");
    
  //   return 
  // }
  const { coId } = useParams(); // Access the coId parameter from the URL


  const handleCardClick = (coId) => {
    //navigate(`/assignment/${coId}`);
  };

  const GetCyss = async () => {
    try {
      
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/getCourse`, {
        withCredentials: true,
      });
      //const request = await axios.get(`https://localhost:7121/getCourse`);
      
      console.log(request.data.data);
      setCof(request.data.data);
       
    }catch (error) {
      console.log(error)
      const { statusCode, errorDetails } = handleError(error);
      //setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  };

  useEffect(()=>{
    GetCyss();
  },[])
  


  return (
    <Grid container direction="column" spacing={2} sx={{ padding: 2 }}>
        <h1>{coId}</h1>
      {cof?.length > 0 ? (
        cof.map((course) => (
          <Grid item key={course.coId}>
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
              <CardActionArea onClick={() => handleCardClick(course.coId)}>
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
                  {/* Uncomment these lines if needed */}
                  {/* <Typography variant="body1" gutterBottom>
                    <strong>Timestamp:</strong> {new Date(course.ts).toLocaleString()}
                  </Typography> */}
                  {/* <Typography variant="body1">
                    <strong>Description:</strong> {course.cofstr}
                  </Typography> */}
                </CardContent>
              </CardActionArea>
            </Card>
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
    </Grid>
  );
  
}

export default Assignment;
