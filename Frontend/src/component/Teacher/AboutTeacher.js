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
import { red } from '@mui/material/colors';
import AssignmentListMain from './AssignmentList';
import { handleError, showAlertMessage } from '../Helper/GetError';
import axios from 'axios';
import TeacherHeader from './TeacherHeader';
import SubmissionListMain from './SubmitionList';
import AssignmentCard from './AssCard';
import CYSSUBCard from '../Student/CYSSubjectCard';
import TeacherCard from './TeacherCard';
// Main component rendering all assignments
const AboutTeacher = () => {

  const [teacher,setTeacher] = useState();
  

  const GetTeacher = async () => {
    try {
        
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/TeacherActivity/getTeacher`, {
        withCredentials: true,
      });
      setTeacher(request.data.data);
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
        <TeacherHeader/>
        
        <Box sx={{marginTop:'5rem',  padding: 2,}}>
            {teacher && <TeacherCard teacher={teacher}/>}
            
        </Box>
    </>
  );
};

export default AboutTeacher;



