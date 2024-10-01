import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, showAlertMessage,showSuccess } from '../Helper/GetError';
import TeacherHeader from './TeacherHeader';
import StudentAssignmentCard from '../Student/SudentAssignmentCard';
import CYSSUBCard from '../Student/CYSSubjectCard';
import AssignmentReportTable from './AssignmentReportTable';
import AssignmentCard2 from './Assignmentcard2';
import CYSSUBCardT from './CYS2Card';


const AssignmentReport = () => {
  const { assId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState();
  const [assignmentReport, setAssignmentReport] = useState();
  const [reportfilename, setreportFilename] = useState();

  const [course, setCourse] = useState();

  const getAssignment = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Assignments/${assId}`,
        { withCredentials: true }
      );
      const temp = response?.data?.data;
      setAssignment(temp);

      const response2 = await axios.get(
        `${process.env.REACT_APP_API_URL}/Retrieval/getDetailsByCourseOfferId/${temp?.coId}`,
        { withCredentials: true }
      );
      const temp2 = response2?.data?.data
      setCourse(response2?.data?.data);
      console.log(temp)
      console.log(temp2)

      // Get current Indian time (IST)
      const indianTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', // Set timezone to IST
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/[/, ]/g, '-').replace(/:/g, '.'); // Format the string

      // Construct the filename with the current IST time
      var filename = `${temp2?.courseName}_${temp2?.semesterName}${temp2?.yearName}_${temp2?.subjectName}_${temp2?.teacherFName}_${temp2?.teacherLName}_${temp?.assiId}_${temp?.assName}_${indianTime}`;


      console.log(filename)
      setreportFilename(filename);
      

      
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };


  const getAssignmentreport = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/TeacherActivity/getAssignmentReport/${assId}`,
        { withCredentials: true }
      );
      const temp = response?.data?.data;
      console.log(temp)
      setAssignmentReport(temp)

    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };


 

  useEffect(() => {
    getAssignment();
    getAssignmentreport();
  }, []);

  // Handle form input changes



  return (
    <>
      <TeacherHeader />
      <Container maxWidth="lg" sx={{ mt: '5rem', mb: 4, width: '100vw' }}>
        <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
           Assignment Report
          </Typography>
        {course && <CYSSUBCardT cys={course} maxWidth={'md'} />}
        {assignment && <AssignmentCard2 assignment={assignment} index={'A'} maxWidth={'md'} />}

        {(assignmentReport && reportfilename) && 
        (<AssignmentReportTable data={assignmentReport} reportfilename={reportfilename}/> )
        }
        
    
      </Container>
    </>
  );
};

export default AssignmentReport;












// import React, { useEffect, useState } from 'react';
// import { Grid,Typography ,Box} from '@mui/material';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { handleError, showAlertMessage } from '../Helper/GetError';
// import TeacherHeader from './TeacherHeader';

// function AssignmentReport() {
//   const navigate = useNavigate();
//   const [cyss, setCYS] = useState([]);
//   const [assignment,setAssignments] = useState();
//   const {coId} = useParams();
//   const[courseo,setCourseO] = useState();

//   const handleCardClick = (coId) => {
//     navigate(`/teacher-co-assignment/${coId}`);
//   };

//   const GetCyss = async () => {
//     try {
//       const request = await axios.get(`${process.env.REACT_APP_API_URL}/StudentActivity/getStudentCYS`, {
//         withCredentials: true,
//       });
//       setCYS(request.data.data);
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       return showAlertMessage(statusCode, errorDetails);
//     }
//   };


//   const GetCoureO = async () => {
//     try {
//       const request = await axios.get(`${process.env.REACT_APP_API_URL}/Retrieval/getDetailsByCourseOfferId/${coId}`, {
//         withCredentials: true,
//       });
//       setCourseO(request.data.data);
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       return showAlertMessage(statusCode, errorDetails);
//     }
//   };


  

//   const GetAssignments = async () => {
//     try {
//       const request = await axios.get(`${process.env.REACT_APP_API_URL}/StudentActivity/getCoAssi/${coId}`, {
//         withCredentials: true,
//       });
//       setAssignments(request.data.data);
//       //console.log(request.data)
//       console.log(request.data.data)
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       return showAlertMessage(statusCode, errorDetails);
//     }
//   };


//   useEffect(() => {
//     GetAssignments();
//     GetCoureO();
//   }, []);

//   return (


//     <Box sx={{mt:'5rem',}}>
//     <TeacherHeader/>
    


//     {/* <Grid container direction="column" spacing={2} sx={{ padding: 2 ,marginTop:'4rem'}}
//     >

//       <Typography
//         variant="h5"
//         align="center"
//         gutterBottom
//         sx={{ fontWeight: 'bold' }}
//       >
//         All Courses You Are Enrolled In
//       </Typography>

      
//       {cys?.length > 0 ? (
//         cys.map((course) => (
//           <Grid item key={course.coId}>
//             <CourseOfferedCard course={course} onCardClick={handleCardClick} />
//           </Grid>
//         ))
//       ) : (
//         <Grid item>
//           <CourseOfferedCard course={{ cofstr: 'No Data Found', coId: '', cysId: '', sid: '', tid: '' }} />
//         </Grid>
//       )}
//     </Grid> */}
//     </Box>
//   );
// }

// export default AssignmentReport;

