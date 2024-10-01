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
// Main component rendering all assignments
const TeacherSubmition = () => {

  const [submissions,setSubmissions] = useState()
  const [assignments,setAssignment] = useState()
  const [courseo,setCourseO] = useState();

  const {id} = useParams();

  const GetSubmition = async () => {
    try {
        
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Submissions/getSubByAssId/${id}`, {
        withCredentials: true,
      });
      setSubmissions(request.data.data);
      console.log(request.data.data)
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  // Fetch existing assignment details to prefill the form
  const fetchAssignmentDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Assignments/${id}`,
        { withCredentials: true }
      );
    
      console.log(response.data.data)
      GetCoureO(response?.data?.data?.coId);
      setAssignment([response.data.data])
      
      
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };

  const GetCoureO = async (coId) => {
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


  useEffect(()=>{
    GetSubmition();
    fetchAssignmentDetails();
  },[])

    

  return (
    <>
        <TeacherHeader/>
        
        <Box sx={{marginTop:'5rem',  padding: 2}}>
        {courseo && <CYSSUBCard cys={courseo}/>}
        <br></br>
        <br></br>
        <AssignmentListMain assignments={assignments} coId={id}/>
        {/* <AssignmentCard assignment={assignments} index={'A'}/> */}
        <SubmissionListMain submissions={submissions} coId={id} />
        </Box>
    </>
  );
};

export default TeacherSubmition;



