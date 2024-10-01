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
import StudentHeader from './StudentHeader';
import StudentAssignmentCard from './SudentAssignmentCard';
import CYSSUBCard from './CYSSubjectCard';
import StudentSubmitionCard from './StudentSubmitionCard';

const SubmitCodeAssignment = () => {
  const { assId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [issubmited , setIsSubmited] = useState(false);
  const [submition , setsubmition] = useState();

  const [formData, setFormData] = useState({
    AnswerNote: '',
    Code: '',
  });
  const [toastOpen, setToastOpen] = useState(false); // State for toast notification
  const [compileError,setCompilationError]=useState();
  const [ce, setCE] = useState(false); // State for toast notification

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

      setCourse(response2?.data?.data);
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };


      const GetSub = async () => {
        try {
          const request = await axios.get(`${process.env.REACT_APP_API_URL}/Submissions/GetSub/${assId}`, {
            withCredentials: true,
          });
          console.log(request.data.data);
          setIsSubmited(true);
          setsubmition(request.data.data)
        } catch (error) {
          console.log(error)
          if(error?.response?.data?.notfound){
            setIsSubmited(false)
            return ;
          }
            //alert()
          //setIsSubmited(false);
          const { statusCode, errorDetails } = handleError(error);
          return showAlertMessage(statusCode, errorDetails);
        }
    };

  useEffect(() => {
    GetSub()
    getAssignment();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Prevent paste in the Code field
  const handlePaste = (e) => {
    e.preventDefault(); // Prevent pasting
    setToastOpen(true); // Show toast notification
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

  

    setCompilationError(null)
    if (!formData.AnswerNote || !formData.Code) {
      setErrors({
        AnswerNote: !formData.AnswerNote ? "Answer Note is required" : "",
        Code: !formData.Code ? "Code is required" : "",
      });
      return;
    }

    var confir = window.confirm('You can not Edit Once Submited');

    if(!confir){
      return;
    }
    
    // {
    //   "subId": 0,
    //   "assiId": 0,
    //   "answerNote": "string",
    //   "assCheckNote": "string",
    //   "testCasePassed": 0,
    //   "testCaseFailed": 0,
    //   "submittedTs": "2024-09-15T19:16:42.445Z",
    //   "turnedInTs": "2024-09-15T19:16:42.445Z",
    //   "marks": 0,
    //   "code": "string"
    // }

    let obj = {
      subId:course?.subjectId,
      assiId:assignment?.assiId,
      answerNote:formData.AnswerNote,
      assCheckNote:'none',
      testCasePassed:0,
      testCaseFailed:0,
      submittedTs:null,
      turnedInTs:null,
      marks:0,
      code:formData.Code

    };


    


    try {
      console.log(obj)
      setLoading(true);
      console.log(formData)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Submissions/submitCodeAssignment`,
        obj,
        { withCredentials: true }
      );
      setLoading(false);
      showSuccess(response?.data, response?.status);
      GetSub();
      getAssignment();
      //navigate("/assignments");
    } catch (error) {
      console.log(error);
      if(error?.response?.data?.iscompileerror){
        setCompilationError(error?.response?.data?.compileError)
        setCE(true)
        
        setTimeout(() => {
          setCE(false);  
        }, 1000);
        return
      }
      //setLoading(false);
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
      
    }finally{
      setLoading(false);
      
    }
  };

  // Close the toast notification
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const handleCloseToast2 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCE(false);
  };

  return (
    <>
      <StudentHeader />
      <Container maxWidth="lg" sx={{ mt: '5rem', mb: 4, width: '100vw' }}>
        <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            Submition Of Coding Assignment
          </Typography>
        {course && <CYSSUBCard cys={course} maxWidth={'md'} />}
        {assignment && <StudentAssignmentCard assignment={assignment} index={'A'} maxWidth={'md'} />}

        {!submition && 
        
        (<Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ width: '100%' }}>
          

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Answer Note"
                name="AnswerNote"
                value={formData.AnswerNote}
                onChange={handleChange}
                multiline
                required
                variant="outlined"
                error={!!errors.AnswerNote}
                helperText={errors.AnswerNote}
              />
            </Grid>

            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: '#fff', // Set background color to white
                  minHeight: '80vh',
                  minWidth: '80vw', // Set minimum width based on viewport height
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Monaco, monospace',
                    fontSize: '16px',
                    color: '#000', // Change text color to black for contrast
                    mb: 1,
                  }}
                >
                  Code Editor:
                </Typography>
                <TextField
                  fullWidth
                  name="Code"
                  value={formData.Code}
                  onChange={handleChange}
                  multiline
                  required
                  placeholder="// Write your code here"
                  variant="standard"
                  error={!!errors.Code}
                  helperText={errors.Code}
                  onPaste={handlePaste} // Disable paste
                  sx={{
                    '& textarea': {
                      fontFamily: 'Monaco, monospace',
                      color: '#000', // Set text color to black
                      backgroundColor: '#fff', // Set background color to white
                      border: 'none',
                      outline: 'none',
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      fontFamily: 'Monaco, monospace',
                      color: '#000', // Set text color to black
                    },
                  }}
                />
              </Paper>

              <TextField
                  fullWidth
                  name="Code"
                  value={formData.Code}
                  onChange={handleChange}
                  multiline
                  required
                  //placeholder="// Write your code here"
                  variant="standard"
                  error={!!errors.Code}
                  helperText={errors.Code}
                  
                  sx={{
                    '& textarea': {
                      fontFamily: 'Monaco, monospace',
                      color: '#000', // Set text color to black
                      backgroundColor: '#fff', // Set background color to white
                      border: 'none',
                      outline: 'none',
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      fontFamily: 'Monaco, monospace',
                      color: '#000', // Set text color to black
                    },
                  }}
                />
            </Grid>

            

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ height: 50, fontSize: '18px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Assignment'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        )}

        {submition && 
        (
          <StudentSubmitionCard submission={submition} index={'S'} maxWidth={'md'} />
        )}

        {/* Snackbar for toast notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
            Pasting is not allowed in the code editor.
          </Alert>
        </Snackbar>

        <Snackbar
          open={ce}
          autoHideDuration={3000}
          onClose={handleCloseToast2}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
            Compile Eroor
          </Alert>
        </Snackbar>

        { compileError && (
            <Stack sx={{ width: '100%',marginY:'2.5rem' }} spacing={2}>
                <Alert severity="error">{compileError}</Alert>
            </Stack>
        )}
      </Container>
    </>
  );
};

export default SubmitCodeAssignment;






// import React, { useState, useEffect, useRef } from 'react';
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Typography,
//   Grid,
//   Container,
//   Box,
//   CircularProgress
// } from '@mui/material';
// import axios from 'axios';
// import { handleError, showAlertMessage, showSuccess } from '../Helper/GetError';
// import { useParams, useNavigate } from 'react-router-dom';
// import StudentHeader from './StudentHeader';
// import StudentAssignmentCard from './SudentAssignmentCard';
// import CYSSUBCard from './CYSSubjectCard';

// const SubmitCodeAssignment = () => {
//   const { assId } = useParams(); // Get the assignment ID from the URL parameters
//   const navigate = useNavigate(); // Replace useHistory with useNavigate
//   const [courses, setCourses] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [assignment, setAssignment] = useState();
//   const [course, setCourse] = useState();

 



//   const getAssignment = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/Assignments/${assId}`,
//         { withCredentials: true }
//       );
//       const temp = response?.data?.data
//       setAssignment(temp);

//       //console.log(temp);

//       const response2 = await axios.get(
//         `${process.env.REACT_APP_API_URL}/Retrieval/getDetailsByCourseOfferId/${temp?.coId}`,
//         { withCredentials: true }
//       );
      
//       setCourse(response2?.data?.data);
      
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       showAlertMessage(statusCode, errorDetails);
//     }
//   };
  
  
//   useEffect(() => {
//     getAssignment();
//   }, []);


  

  
//   return (
//     <>
//       <StudentHeader />
      
//       <Container maxWidth="lg" sx={{ mt: '5rem', mb: 4, width: '100vw' }}>

//         {course && 
//           (
//           <CYSSUBCard cys={course} maxWidth={'md'} />
//         ) 
//         }

//         {assignment && 
//           (
//           <StudentAssignmentCard assignment={assignment} index={'A'} maxWidth={'md'}/>
//         ) 
//         }


//         <Box component="form" noValidate autoComplete="off" sx={{width:'100%'}}>
//           <Typography
//             variant="h5"
//             align="center"
//             gutterBottom
//             sx={{ fontWeight: 'bold' }}
//           >

//             Submit No-Code Assignment
//           </Typography>

//           <TextField
//             fullWidth
//             label="Assignment Name"
//             name="AssName"
//             //value={formData.AssName}
//             //onChange={handleChange}
//             required
//             variant="outlined"
//             error={!!errors.AssName}
//             helperText={errors.AssName}
//           />
         
//         </Box>
//       </Container>

      
//     </>
//   );
// };

// export default SubmitCodeAssignment;


{/* <Grid container spacing={2}>
<Grid item xs={12}>
  <TextField
    fullWidth
    label="Assignment Name"
    name="AssName"
    value={formData.AssName}
    onChange={handleChange}
    required
    variant="outlined"
    error={!!errors.AssName}
    helperText={errors.AssName}
  />
</Grid>

<Grid item xs={12}>
  <FormControl fullWidth variant="outlined" required error={!!errors.CoId}>
    <InputLabel>Course</InputLabel>
    <Select
      name="CoId"
      value={formData.CoId}
      onChange={handleChange}
      label="Course"
    >
      {courses.map((course) => (
        <MenuItem key={course.coId} value={course.coId}>
          {course.cofstr}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12}>
  <TextField
    fullWidth
    label="Assignment Marks"
    name="AssMarks"
    value={formData.AssMarks}
    onChange={handleChange}
    type="number"
    required
    variant="outlined"
    error={!!errors.AssMarks}
    helperText={errors.AssMarks}
  />
</Grid>

<Grid item xs={12}>
  <TextField
    fullWidth
    label="Assignment Instructions"
    name="AssNoteInstruction"
    value={formData.AssNoteInstruction}
    onChange={handleChange}
    multiline
    rows={4}
    variant="outlined"
    required
    error={!!errors.AssNoteInstruction}
    helperText={errors.AssNoteInstruction}
  />
</Grid>

<Grid item xs={12}>
  <TextField
    fullWidth
    label="Last Date to Submit"
    name="LastDateToSubmitTs"
    type="datetime-local"
    value={formData.LastDateToSubmitTs}
    onChange={handleChange}
    InputLabelProps={{
      shrink: true,
    }}
    required
    variant="outlined"
    error={!!errors.LastDateToSubmitTs}
    helperText={errors.LastDateToSubmitTs}
  />
</Grid>

<Grid item xs={12}>
  <Button
    fullWidth
    variant="contained"
    component="label"
    sx={{ height: '56px' }}
    error={!!errors.File}
  >
    Upload Question File
    <input
      type="file"
      name="File"
      hidden
      onChange={handleFileChange}
    />
  </Button>
  <Typography variant="body2" color="textSecondary">
    {fileNames.FileName || 'No file selected'}
  </Typography>
</Grid>

<Grid item xs={12}>
  <Button
    fullWidth
    variant="contained"
    color="primary"
    type="submit"
    disabled={loading}
  >
    {loading ? <CircularProgress size={24} /> : 'Update Assignment'}
  </Button>
</Grid>
</Grid> */}