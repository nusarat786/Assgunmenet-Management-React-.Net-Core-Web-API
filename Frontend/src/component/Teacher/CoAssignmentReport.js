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
import CoAssignmentTable from './CoAssignmentTable';
import CourseOfferedCard from './CourseOffredCard';
import CYSSUBCardT from './CYS2Card';

const dummyData = [
    {
      studentId: 8,
      studentFirstName: "DGFDFG",
      studentSurname: "DFGDFG",
      email: "nusarathaveliwala1@gmail.com",
      totalMarksObtained: 181.75,
      totalPossibleMarks: 280,
      totalAssignmentsSubmitted: 7,
      totalAssignments: 9,
      percentageObtained: 64.9107,
      courseOfferedId: 27,
      courseName: "MCA",
      yearName: "2020",
      semesterName: "SEM-2",
      subjectName: "c#"
    },
    {
      studentId: 9,
      studentFirstName: "test",
      studentSurname: "test",
      email: "test@gmail.com",
      totalMarksObtained: 160.5,
      totalPossibleMarks: 280,
      totalAssignmentsSubmitted: 5,
      totalAssignments: 9,
      percentageObtained: 57.3214,
      courseOfferedId: 27,
      courseName: "MCA",
      yearName: "2020",
      semesterName: "SEM-2",
      subjectName: "c#"
    },
    {
      studentId: 10,
      studentFirstName: "nusarat",
      studentSurname: "haveliwala",
      email: "vajju@gmail.com",
      totalMarksObtained: 65.05,
      totalPossibleMarks: 280,
      totalAssignmentsSubmitted: 3,
      totalAssignments: 9,
      percentageObtained: 23.2321,
      courseOfferedId: 27,
      courseName: "MCA",
      yearName: "2020",
      semesterName: "SEM-2",
      subjectName: "c#"
    },
    {
      studentId: 12,
      studentFirstName: "Bharg",
      studentSurname: "Gosawami",
      email: "bharg@gmail.com",
      totalMarksObtained: 60.55,
      totalPossibleMarks: 280,
      totalAssignmentsSubmitted: 3,
      totalAssignments: 9,
      percentageObtained: 21.625,
      courseOfferedId: 27,
      courseName: "MCA",
      yearName: "2020",
      semesterName: "SEM-2",
      subjectName: "c#"
    },
    {
      studentId: 13,
      studentFirstName: "Aakib",
      studentSurname: "HotelWala",
      email: "aakib@gmail.com",
      totalMarksObtained: 0,
      totalPossibleMarks: 280,
      totalAssignmentsSubmitted: 0,
      totalAssignments: 9,
      percentageObtained: 0,
      courseOfferedId: 27,
      courseName: "MCA",
      yearName: "2020",
      semesterName: "SEM-2",
      subjectName: "c#"
    }
  ];

const CoAssignmentReport = () => {
  const { coId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState();
  const [assignmentReport, setAssignmentReport] = useState();
  const [reportfilename, setreportFilename] = useState();

  const [course, setCourse] = useState();

  const getCourse = async () => {
    try {
      

      const response2 = await axios.get(
        `${process.env.REACT_APP_API_URL}/Retrieval/getDetailsByCourseOfferId/${coId}`,
        { withCredentials: true }
      );
      const temp2 = response2?.data?.data
      setCourse(response2?.data?.data);
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
      var filename = `${temp2?.courseName}_${temp2?.semesterName}${temp2?.yearName}_${temp2?.subjectName}_${temp2?.courseId}_${temp2?.teacherFName}_${temp2?.teacherLName}_${indianTime}`;


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
        `${process.env.REACT_APP_API_URL}/TeacherActivity/getCourseOfferedAssignmentReport/${coId}`,
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
    getCourse();
    //getAssignment();
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
           Assignment Report By Course Offred
          </Typography>
        {course && 
             <CYSSUBCardT cys={course} maxWidth={'md'} />
  
        }
        
        {(assignmentReport && reportfilename) && 
        (
            <CoAssignmentTable data={assignmentReport} reportfilename={reportfilename}/>        

       )
        }


    
      </Container>
    </>
  );
};

export default CoAssignmentReport;


