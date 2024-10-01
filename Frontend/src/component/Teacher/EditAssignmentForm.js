import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  Container,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { handleError, showAlertMessage, showSuccess } from '../Helper/GetError';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import TeacherHeader from './TeacherHeader';

const EditAssignmentForm = () => {
  const { id } = useParams(); // Get the assignment ID from the URL parameters
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [formData, setFormData] = useState({
    AssName: '',
    AssNoteInstruction: '',
    AssMarks: '',
    CoId: '',
    File: null,
    Question: null,
    LastDateToSubmitTs: '',
    IsCoding: true,
  });

  const [code, setCode] = useState();
  const preRef = useRef(null);

  const handleInput = (event) => {
    // Update the state with the new content
    setCode(preRef.current.innerText);
  };

  const [fileNames, setFileNames] = useState({
    FileName: '',
    QuestionFileName: '',
  });

  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch existing assignment details to prefill the form
  const fetchAssignmentDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Assignments/${id}`,
        { withCredentials: true }
      );
      const assignment = response.data.data;

      setCode(assignment?.codeCheckFileUrl)
      let formattedDate = '';
      if (assignment.lastDateToSubmitTs) {
        const parsedDate = new Date(assignment.lastDateToSubmitTs);
        if (!isNaN(parsedDate)) {
          formattedDate = assignment.lastDateToSubmitTs.substring(0, 16); // Format date to match datetime-local input
        }
      }

      setFormData({
        AssName: assignment.assName,
        AssNoteInstruction: assignment.assNoteInstruction,
        AssMarks: assignment.assMarks,
        CoId: assignment.coId,
        LastDateToSubmitTs: formattedDate, // use the correctly formatted date
        IsCoding: assignment.isCoding ? 1 : 0,
      });

      setFileNames({
        FileName: assignment.AssQuestionFile || '',
        QuestionFileName: assignment.CodeCheckFileUrl || '',
      });
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };

  const GetCourses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getCourse`,
        { withCredentials: true }
      );
      setCourses(response.data.data);
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };

  useEffect(() => {
    fetchAssignmentDetails();
    GetCourses();
  }, []);

  const validate = () => {
    const newErrors = {};
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.LastDateToSubmitTs);

    if (!formData.AssName) newErrors.AssName = 'Assignment name is required.';
    if (!formData.AssMarks) {
      newErrors.AssMarks = 'Assignment marks are required.';
    } else if (formData.AssMarks < 10 || formData.AssMarks > 100) {
      newErrors.AssMarks = 'Marks must be between 10 and 100.';
    }
    if (!formData.CoId) newErrors.CoId = 'Course is required.';
    if (!formData.AssNoteInstruction)
      newErrors.AssNoteInstruction = 'Instructions are required.';
    if (!formData.LastDateToSubmitTs)
      newErrors.LastDateToSubmitTs = 'Last date to submit is required.';
    else if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      newErrors.LastDateToSubmitTs =
        'Last date to submit must be today or a future date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });

    setFileNames({
      ...fileNames,
      [name === 'File' ? 'FileName' : 'QuestionFileName']: files[0]
        ? files[0].name
        : '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('AssName', formData.AssName);
    formDataToSend.append('AssNoteInstruction', formData.AssNoteInstruction);
    formDataToSend.append('AssMarks', formData.AssMarks);
    formDataToSend.append('CoId', formData.CoId);
    if (formData.File) formDataToSend.append('File', formData.File);
    if (formData.Question) formDataToSend.append('Question', formData.Question);
    formDataToSend.append('LastDateToSubmitTs', formData.LastDateToSubmitTs);
    formDataToSend.append('IsCoding', true);
    formDataToSend.append('AssiId', id);
    formDataToSend.append('AssTestCase', 'none');

    setLoading(true); // Start loading

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/Assignments/updateCodeAssignmnet/${id}`,
        formDataToSend,
        {
          withCredentials: true,
        }
      );
      showSuccess(response?.data, response?.status);
      console.log(response?.data)
      navigate(`/teacher-assignment-submition/${response?.data?.data?.assiId}`)
    
      //navigate('/assignments'); // Redirect after successful update
    } catch (error) {
      console.log(error)
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <>
      <TeacherHeader />
      <Container maxWidth="sm" sx={{ mt: '5rem', mb: 4, width: '100vw' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Edit Assignment
          </Typography>
          <Grid container spacing={2}>
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
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Is Coding Assignment?</InputLabel>
                <Select
                  name="IsCoding"
                  value={formData.IsCoding}
                  onChange={handleChange}
                  label="Is Coding Assignment?"
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </Select>
              </FormControl>
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
                component="label"
                sx={{ height: '56px' }}
                error={!!errors.Question}
              >
                Upload Coding File (if applicable)
                <input
                  type="file"
                  name="Question"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Typography variant="body2" color="textSecondary">
                {fileNames.QuestionFileName || 'No file selected'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading} // Disable button while loading
              >
                {loading ? <CircularProgress size={24} /> : 'Update Assignment'}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <pre
                style={{
                  background: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '4px',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                }}
              >
                {code}
              </pre>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default EditAssignmentForm;














// import React, { useState, useEffect } from 'react';
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
// } from '@mui/material';
// import axios from 'axios';
// import { handleError, showAlertMessage, showSuccess } from '../Helper/GetError';
// import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
// import TeacherHeader from './TeacherHeader';
// import { useRef } from 'react';
// const EditAssignmentForm = () => {
//   const { id } = useParams(); // Get the assignment ID from the URL parameters
//   const navigate = useNavigate(); // Replace useHistory with useNavigate
//   const [formData, setFormData] = useState({
//     AssName: '',
//     AssNoteInstruction: '',
//     AssMarks: '',
//     CoId: '',
//     File: null,
//     Question: null,
//     LastDateToSubmitTs: '',
//     IsCoding: true,
//   });

//   const [code, setCode] = useState();
//   const preRef = useRef(null);

//   const handleInput = (event) => {
//     // Update the state with the new content
//     setCode(preRef.current.innerText);
//   };

//   const [fileNames, setFileNames] = useState({
//     FileName: '',
//     QuestionFileName: '',
//   });

//   const [courses, setCourses] = useState([]);
//   const [errors, setErrors] = useState({});



//   // // Fetch existing assignment details to prefill the form
//   // const fetchAssignmentDetails = async () => {
//   //   try {
//   //     const response = await axios.get(
//   //       `${process.env.REACT_APP_API_URL}/Assignments/${id}`,
//   //       { withCredentials: true }
//   //     );
//   //     const assignment = response.data.data;

//   //     console.log(response)
//   //     // Populate form data with the fetched assignment details
//   //     setFormData({
//   //       AssName: assignment.AssName,
//   //       AssNoteInstruction: assignment.AssNoteInstruction,
//   //       AssMarks: assignment.AssMarks,
//   //       CoId: assignment.CoId,
//   //       LastDateToSubmitTs: new Date(assignment.LastDateToSubmitTs)
//   //         .toISOString()
//   //         .substring(0, 16), // format date to match datetime-local input
//   //       IsCoding: assignment.IsCoding ? 1 : 0,
//   //     });

//   //     setFileNames({
//   //       FileName: assignment.AssQuestionFile || '',
//   //       QuestionFileName: assignment.CodeCheckFileUrl || '',
//   //     });
//   //   } catch (error) {
//   //     console.log(error)
//   //     const { statusCode, errorDetails } = handleError(error);
//   //     return showAlertMessage(statusCode, errorDetails);
//   //   }
//   // };

//   // Fetch existing assignment details to prefill the form
// const fetchAssignmentDetails = async () => {
//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API_URL}/Assignments/${id}`,
//       { withCredentials: true }
//     );
//     const assignment = response.data.data;

//     console.log(assignment)
//     setCode(assignment?.codeCheckFileUrl)
//     let formattedDate = '';
//     // Check if the date string is valid and in the right format
//     if (assignment.lastDateToSubmitTs) {
//       const parsedDate = new Date(assignment.lastDateToSubmitTs);
//       if (!isNaN(parsedDate)) {
//         formattedDate = assignment.lastDateToSubmitTs.substring(0, 16); // Format date to match datetime-local input
//       }
//     }


//     // Populate form data with the fetched assignment details
//     setFormData({
//       AssName: assignment.assName,
//       AssNoteInstruction: assignment.assNoteInstruction,
//       AssMarks: assignment.assMarks,
//       CoId: assignment.coId,
//       LastDateToSubmitTs: formattedDate, // use the correctly formatted date
//       IsCoding: assignment.isCoding ? 1 : 0,
//     });


//     console.log(formData)
//     setFileNames({
//       FileName: assignment.AssQuestionFile || '',
//       QuestionFileName: assignment.CodeCheckFileUrl || '',
//     });
//   } catch (error) {
//     const { statusCode, errorDetails } = handleError(error);
//     showAlertMessage(statusCode, errorDetails);
//   }
// };


//   const GetCourses = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/getCourse`,
//         { withCredentials: true }
//       );
//       setCourses(response.data.data);
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       showAlertMessage(statusCode, errorDetails);
//     }
//   };


//   useEffect(() => {
//     fetchAssignmentDetails();
//     GetCourses();
//   }, []);


//   const validate = () => {
//     const newErrors = {};
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);
//     const selectedDate = new Date(formData.LastDateToSubmitTs);

//     if (!formData.AssName) newErrors.AssName = 'Assignment name is required.';
//     if (!formData.AssMarks) {
//       newErrors.AssMarks = 'Assignment marks are required.';
//     } else if (formData.AssMarks < 10 || formData.AssMarks > 100) {
//       newErrors.AssMarks = 'Marks must be between 10 and 100.';
//     }
//     if (!formData.CoId) newErrors.CoId = 'Course is required.';
//     if (!formData.AssNoteInstruction)
//       newErrors.AssNoteInstruction = 'Instructions are required.';
//     if (!formData.LastDateToSubmitTs)
//       newErrors.LastDateToSubmitTs = 'Last date to submit is required.';
//     else if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
//       newErrors.LastDateToSubmitTs =
//         'Last date to submit must be today or a future date.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (event) => {
//     const { name, files } = event.target;
//     setFormData({
//       ...formData,
//       [name]: files[0],
//     });

//     setFileNames({
//       ...fileNames,
//       [name === 'File' ? 'FileName' : 'QuestionFileName']: files[0]
//         ? files[0].name
//         : '',
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!validate()) return;

//     const formDataToSend = new FormData();
//     formDataToSend.append('AssName', formData.AssName);
//     formDataToSend.append('AssNoteInstruction', formData.AssNoteInstruction);
//     formDataToSend.append('AssMarks', formData.AssMarks);
//     formDataToSend.append('CoId', formData.CoId);
//     if (formData.File) formDataToSend.append('File', formData.File);
//     if (formData.Question) formDataToSend.append('Question', formData.Question);
//     formDataToSend.append('LastDateToSubmitTs', formData.LastDateToSubmitTs);
//     formDataToSend.append('IsCoding', true);
//     formDataToSend.append('AssiId', id);
//     formDataToSend.append('AssTestCase', 'none');


    
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/Assignments/updateCodeAssignmnet/${id}`,
//         formDataToSend,
//         {
//           withCredentials: true,
//         }
//       );
//       showSuccess(response?.data, response?.status);
//       //navigate('/assignments'); // Redirect after successful update
//     } catch (error) {
//       console.log(error)
//       const { statusCode, errorDetails } = handleError(error);
//       showAlertMessage(statusCode, errorDetails);
//     }
//   };

//   return (
//     <>
//      <TeacherHeader/>
    
//     <Container maxWidth="sm" sx={{ mt: '5rem', mb: 4, width: '100vw' }}>
//       <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
//         <Typography
//             variant="h5"
//             align="center"
//             gutterBottom
//             sx={{ fontWeight: 'bold' }}
//         >
//             Edit Assignment
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Assignment Name"
//               name="AssName"
//               value={formData.AssName}
//               onChange={handleChange}
//               required
//               variant="outlined"
//               error={!!errors.AssName}
//               helperText={errors.AssName}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <FormControl fullWidth variant="outlined" required error={!!errors.CoId}>
//               <InputLabel>Course</InputLabel>
//               <Select
//                 name="CoId"
//                 value={formData.CoId}
//                 onChange={handleChange}
//                 label="Course"
//               >
//                 {courses.map((course) => (
//                   <MenuItem key={course.coId} value={course.coId}>
//                     {course.cofstr}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Assignment Marks"
//               name="AssMarks"
//               value={formData.AssMarks}
//               onChange={handleChange}
//               type="number"
//               required
//               variant="outlined"
//               error={!!errors.AssMarks}
//               helperText={errors.AssMarks}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Assignment Instructions"
//               name="AssNoteInstruction"
//               value={formData.AssNoteInstruction}
//               onChange={handleChange}
//               multiline
//               rows={4}
//               variant="outlined"
//               required
//               error={!!errors.AssNoteInstruction}
//               helperText={errors.AssNoteInstruction}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Last Date to Submit"
//               name="LastDateToSubmitTs"
//               type="datetime-local"
//               value={formData.LastDateToSubmitTs}
//               onChange={handleChange}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               required
//               variant="outlined"
//               error={!!errors.LastDateToSubmitTs}
//               helperText={errors.LastDateToSubmitTs}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <FormControl fullWidth variant="outlined" required>
//               <InputLabel>Is Coding Assignment?</InputLabel>
//               <Select
//                 name="IsCoding"
//                 value={formData.IsCoding}
//                 onChange={handleChange}
//                 label="Is Coding Assignment?"
//               >
//                 <MenuItem value={1}>Yes</MenuItem>
//                 <MenuItem value={0}>No</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12}>
//             <Button
//               fullWidth
//               variant="contained"
//               component="label"
//               sx={{ height: '56px' }}
//               error={!!errors.File}
//             >
//               Upload Question File
//               <input
//                 type="file"
//                 name="File"
//                 hidden
//                 onChange={handleFileChange}
//               />
//             </Button>
//             <Typography variant="body2" color="textSecondary">
//               {fileNames.FileName || 'No file selected'}
//             </Typography>
//           </Grid>

//           <Grid item xs={12}>
//             <Button
//               fullWidth
//               variant="contained"
//               component="label"
//               sx={{ height: '56px' }}
//               error={!!errors.Question}
//             >
//               Upload Coding File (if applicable)
//               <input
//                 type="file"
//                 name="Question"
//                 hidden
//                 onChange={handleFileChange}
//               />
//             </Button>
//             <Typography variant="body2" color="textSecondary">
//               {fileNames.QuestionFileName || 'No file selected'}
//             </Typography>
//           </Grid>

//           <Grid item xs={12}>
//             <Button fullWidth variant="contained" color="primary" type="submit">
//               Update Assignment
//             </Button>
//           </Grid>


//           <Grid item xs={12}>
//           <pre
//           //ref={preRef}
//           //contentEditable
//           style = {
//               {
//                 background: '#f4f4f4',
//                 padding: '10px',
//                 borderRadius: '4px',
//                 overflowX: 'auto',
//                 whiteSpace: 'pre-wrap',
//                 fontFamily: 'monospace',
//               }
//             } 
          
//           //onInput={handleInput}  
            
//           >

//             {code}

//             </pre>
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//     </>
//   );
// };

// export default EditAssignmentForm;
