import React, { useEffect, useState } from 'react';
import { Grid,Typography ,Box} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { handleError, showAlertMessage } from '../Helper/GetError';
import StudentHeader from './StudentHeader';
import CYSListMain from './StudentCYSList';
import StudAssignmntList from './StudAssignmntList';
import CYSSUBCard from './CYSSubjectCard';

function StudentCoAssignment() {
  const navigate = useNavigate();
  const [cyss, setCYS] = useState([]);
  const [assignment,setAssignments] = useState();
  const {coId} = useParams();
  const[courseo,setCourseO] = useState();

  const handleCardClick = (coId) => {
    navigate(`/teacher-co-assignment/${coId}`);
  };

  const GetCyss = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/StudentActivity/getStudentCYS`, {
        withCredentials: true,
      });
      setCYS(request.data.data);
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };


  const GetCoureO = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Retrieval/getDetailsByCourseOfferId/${coId}`, {
        withCredentials: true,
      });
      setCourseO(request.data.data);
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };


  

  const GetAssignments = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/StudentActivity/getCoAssi/${coId}`, {
        withCredentials: true,
      });
      setAssignments(request.data.data);
      //console.log(request.data)
      console.log(request.data.data)
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };


  useEffect(() => {
    GetAssignments();
    GetCoureO();
  }, []);

  return (


    <Box sx={{mt:'5rem',}}>
    <StudentHeader/>
    
    {courseo && (
        <Box
        
        sx={{
          
            mb: 2, // Adds margin between the cards for spacing
            mx: { xs: 2, sm: 3, md: 5 }, // Responsive margin
        }}
        > 
        <CYSSUBCard cys={courseo}/>
        </Box>

    )}
    {assignment && (<StudAssignmntList assignments={assignment} />)} 
    {/* <Grid container direction="column" spacing={2} sx={{ padding: 2 ,marginTop:'4rem'}}
    >

      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        All Courses You Are Enrolled In
      </Typography>

      
      {cys?.length > 0 ? (
        cys.map((course) => (
          <Grid item key={course.coId}>
            <CourseOfferedCard course={course} onCardClick={handleCardClick} />
          </Grid>
        ))
      ) : (
        <Grid item>
          <CourseOfferedCard course={{ cofstr: 'No Data Found', coId: '', cysId: '', sid: '', tid: '' }} />
        </Grid>
      )}
    </Grid> */}
    </Box>
  );
}

export default StudentCoAssignment;

