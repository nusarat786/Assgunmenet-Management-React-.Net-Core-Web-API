import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { handleError, showAlertMessage, showSuccess } from '../Helper/GetError';
import TeacherHeader from './TeacherHeader';
import { useNavigate } from 'react-router-dom';

const AddNocodeAssignment = () => {
  const [formData, setFormData] = useState({
    AssName: '',
    AssNoteInstruction: '',
    AssMarks: '',
    CoId: '',
    File: null,
    LastDateToSubmitTs: '',
    IsCoding: 0, // Ensure IsCoding is false for No-Code assignments
  });

  const [fileNames, setFileNames] = useState({ FileName: '' });
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
 const navigate =useNavigate();
  const GetCyss = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/getCourse`, {
        withCredentials: true,
      });
      setCourses(request.data.data);
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  useEffect(() => {
    GetCyss();
  }, []);

  const validate = () => {
    const newErrors = {};
    const currentDate = new Date();
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
      newErrors.LastDateToSubmitTs = 'Last date must be in the future.';
    }
    if (!formData.File) newErrors.File = 'Question file is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const { files } = event.target;
    setFormData({ ...formData, File: files[0] });
    setFileNames({ FileName: files[0] ? files[0].name : '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('AssName', formData.AssName);
    formDataToSend.append('AssNoteInstruction', formData.AssNoteInstruction);
    formDataToSend.append('AssMarks', formData.AssMarks);
    formDataToSend.append('CoId', formData.CoId);
    formDataToSend.append('File', formData.File);
    formDataToSend.append('LastDateToSubmitTs', formData.LastDateToSubmitTs);
    formDataToSend.append('IsCoding', false); // Set IsCoding to 0

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addNoCodeAssignment`, formDataToSend, {
        withCredentials: true,
      });
      showSuccess(response?.data, response?.status);
      navigate(`/teacher-assignment-submition/${response?.data?.assignment?.assiId}`)
    
    } catch (error) {
      console.log(error)
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TeacherHeader />
      <Container maxWidth="sm" sx={{ mt: '5rem', mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Typography variant="h5" align="center" gutterBottom>
            Add No-Code Assignment
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
                error={!!errors.AssName}
                helperText={errors.AssName}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.CoId}>
                <InputLabel>Course</InputLabel>
                <Select name="CoId" value={formData.CoId} onChange={handleChange}>
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
                InputLabelProps={{ shrink: true }}
                required
                error={!!errors.LastDateToSubmitTs}
                helperText={errors.LastDateToSubmitTs}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant="contained" component="label">
                Upload Question File
                <input type="file" name="File" hidden onChange={handleFileChange} required />
              </Button>
              {fileNames.FileName && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Selected File: {fileNames.FileName}
                </Typography>
              )}
              {errors.File && <Typography color="error">{errors.File}</Typography>}
            </Grid>

            <Grid item xs={12}>
              <Box textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Assignment'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default AddNocodeAssignment;












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
// import TeacherHeader from './TeacherHeader';
// const AddAssignmentForm = () => {
//   const [formData, setFormData] = useState({
//     AssName: '',
//     AssNoteInstruction: '',
//     AssMarks: '',
//     CoId: '',
//     File: null,
//     Question: null,
//     LastDateToSubmitTs: '',
//     IsCoding: 1, // Default value set to true
//   });

//   const [fileNames, setFileNames] = useState({
//     FileName: '',
//     QuestionFileName: '',
//   });

//   const [courses, setCourses] = useState([]);
//   const [errors, setErrors] = useState({});

//   const GetCyss = async () => {
//     try {
//       const request = await axios.get(`${process.env.REACT_APP_API_URL}/getCourse`, {
//         withCredentials: true,
//       });
//       setCourses(request.data.data);
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       return showAlertMessage(statusCode, errorDetails);
//     }
//   };

//   useEffect(() => {
//     GetCyss();
//   }, []);

//   const validate = () => {
//     const newErrors = {};

//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0); // Set time to midnight to compare only the date part
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
//       // Compares the selected date with today's date, ensuring it is not in the past
//       newErrors.LastDateToSubmitTs = 'Last date to submit must be today or a future date.';
//     }
//     if (!formData.File) newErrors.File = 'Question file is required.';
//     if (!formData.Question) newErrors.Question = 'Code file is required.'; // Code file is mandatory

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
    
//     // Update the file name display
//     setFileNames({
//       ...fileNames,
//       [name === 'File' ? 'FileName' : 'QuestionFileName']: files[0] ? files[0].name : '',
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
//     formDataToSend.append('File', formData.File);
//     formDataToSend.append('Question', formData.Question);
//     formDataToSend.append('LastDateToSubmitTs', formData.LastDateToSubmitTs);
//     formDataToSend.append('IsCoding', formData.IsCoding);
//     formDataToSend.append('AssTestCase', 'none');
    
//     try {
//         console.log(formData)
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/Assignments`, formDataToSend ,{
//         withCredentials: true,

//       });
//       console.log('Assignment added successfully:', response.data);
//       return showSuccess(response?.data, response?.status);
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       return showAlertMessage(statusCode, errorDetails);
//     }
//   };

//   return (

//     <>


//     <TeacherHeader/>
 
//     <Container maxWidth="sm" sx={{ mt: '5rem', mb: 4, width: '100vw' }}>
//       <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
//         <Typography
//             variant="h5"
//             align="center"
//             gutterBottom
//             sx={{ fontWeight: 'bold' }}
//         >
//             Add Assignment
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
//                 <MenuItem value={true}>Yes</MenuItem>
//                 <MenuItem value={false}>No</MenuItem>
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
//                 required
//               />
//             </Button>
//             {fileNames.FileName && (
//               <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                 Selected File: {fileNames.FileName}
//               </Typography>
//             )}
//             {errors.File && <Typography color="error">{errors.File}</Typography>}
//           </Grid>

//           <Grid item xs={12}>
//             <Button
//               fullWidth
//               variant="contained"
//               component="label"
//               sx={{ height: '56px' }}
//               error={!!errors.Question}
//             >
//               Upload Code File
//               <input
//                 type="file"
//                 name="Question"
//                 hidden
//                 onChange={handleFileChange}
//                 required
//               />
//             </Button>
//             {fileNames.QuestionFileName && (
//               <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                 Selected File: {fileNames.QuestionFileName}
//               </Typography>
//             )}
//             {errors.Question && <Typography color="error">{errors.Question}</Typography>}
//           </Grid>

//           <Grid item xs={12}>
//             <Box textAlign="center">
//               <Button type="submit" variant="contained" color="primary">
//                 Submit Assignment
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//     </>
//   );
// };

// export default AddAssignmentForm;
