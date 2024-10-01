import React, { useEffect, useState } from 'react';
import { Grid,Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleError, showAlertMessage } from '../Helper/GetError';
import StudentHeader from './StudentHeader';
import CYSListMain from './StudentCYSList';

function StudentAllCys() {
  const navigate = useNavigate();
  const [cyss, setCYS] = useState([]);

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

  useEffect(() => {
    GetCyss();
  }, []);

  return (


    <>
    <StudentHeader/>
    <CYSListMain cysList={cyss} coId={'none'} onCardClick={()=>{alert('hello')}}/>
    
    
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
    </>
  );
}

export default StudentAllCys;

