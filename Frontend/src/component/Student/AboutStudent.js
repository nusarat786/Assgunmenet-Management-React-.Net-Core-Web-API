import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardHeader,
    Avatar,
    CardActionArea,
    Box,
    Button
  } from '@mui/material';
import { useParams } from 'react-router-dom';
import { handleError, showAlertMessage } from '../Helper/GetError';
import axios from 'axios';
import StudentHeader from './StudentHeader';
import StudentCard from './StudentCard';
// Main component rendering all assignments
const AboutStudent = () => {

  const [student,setStudent] = useState();
  

  const GetTeacher = async () => {
    try {
        
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/StudentActivity/getStudent`, {
        withCredentials: true,
      });
      setStudent(request.data.data);
      console.log(request.data.data)
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  


  useEffect(()=>{
    GetTeacher();
  },[])

    

  return (
    <>
        <StudentHeader/>
        
        <Box sx={{marginTop:'5rem',  padding: 2,}}>
            {student && <StudentCard student={student}/>} 
        </Box>
    </>
  );
};

export default AboutStudent;



