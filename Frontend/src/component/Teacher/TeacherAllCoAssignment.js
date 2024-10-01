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
import { useNavigate, useParams } from 'react-router-dom';
import { red } from '@mui/material/colors';
import AssignmentListMain from './AssignmentList';
import { handleError, showAlertMessage } from '../Helper/GetError';
import axios from 'axios';
import TeacherHeader from './TeacherHeader';
import CourseOfferedCard from './CourseOffredCard';

// Main component rendering all assignments
const TeacherAllCoAssignment = () => {

  const [assignment,setAssignments] = useState();
  const [course,setcourse] = useState();


  
  const navigate =useNavigate();
  const {coId} = useParams();

  const GetCyss = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/getCourse`, {
        withCredentials: true,
      });
      var t  = request.data.data;

      t = t?.filter((cur)=>{
        return cur.coId===parseInt(coId);
      })

      console.log(t)
      setcourse(t[0]);
      
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  const GetAssignments = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/TeacherActivity/getCoAssi/${coId}`, {
        withCredentials: true,
      });
      setAssignments(request.data.data);
      console.log(request.data.data)
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };
  useEffect(()=>{
    GetAssignments();
    GetCyss();
  },[])
  
  const handleCardClick = () => {
    navigate(`/teacher-co-assignment/${coId}`);
  };

  return (
    <>
    
    <TeacherHeader/>
    <Box sx={{marginTop:'5rem',  padding: 2}}>
      {course && <CourseOfferedCard onCardClick={handleCardClick} course={course}/> }
    </Box>
    <Box sx={{marginTop:'5rem'}}>      
      <AssignmentListMain assignments={assignment} coId={coId} />
    </Box>
    </>
  );
};

export default TeacherAllCoAssignment;
