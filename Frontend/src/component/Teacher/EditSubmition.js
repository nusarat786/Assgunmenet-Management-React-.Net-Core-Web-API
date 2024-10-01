import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
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
import SubmissionListMain from './SubmitionList';
import SubmissionCard from './SubmitionCard';
import AssignmentCard from './AssCard';


const EditSubmition = () => {
  const { id } = useParams(); // Get the assignment ID from the URL parameters
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [formData, setFormData] = useState({
    AssMarks: '',
    AssCheckNote: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const [submitions,setSubmition] = useState();
  const [assignment,setAssignment] = useState();
  const[assid,setAssId] = useState();
  
  // Fetch existing assignment details to prefill the form
  const fetchSubmition = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Submissions/${id}`,
        { withCredentials: true }
      );
      const assignment = response.data.data;
      //setSubmition([assignment])
      setSubmition(assignment)
      setAssId(assignment?.assiId)
      const response2 = await axios.get(
        `${process.env.REACT_APP_API_URL}/Assignments/${assignment?.assiId}`,
        { withCredentials: true }
      );
      const data = response2.data.data;
      setAssignment(data)

      //console.log(submitions)
      setFormData({
        AssMarks: assignment.marks || '',
        AssCheckNote: assignment.assCheckNote || '',
      });
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };


//    // Fetch existing assignment details to prefill the form
//    const fetchAssignmentDetails = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/Assignments/${id}`,
//         { withCredentials: true }
//       );
//       const data = response.data.data;

//       setAssignment(data)
      
//     } catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       showAlertMessage(statusCode, errorDetails);
//     }
//   };

  useEffect(() => {
    fetchSubmition();
    // fetchAssignmentDetails();
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!formData.AssMarks) newErrors.AssMarks = 'Marks are required.';
    if (formData.AssMarks < 0 || formData.AssMarks > 100) {
      newErrors.AssMarks = 'Marks must be greater than or equals to 0 and less than 100';
    }
    if (!formData.AssCheckNote) newErrors.AssCheckNote = 'Assessment check note is required.';

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const updateData = {
      AssMarks: formData.AssMarks,
      AssCheckNote: formData.AssCheckNote,
      Marks:formData.AssMarks
    };
    console.log(updateData);
    setLoading(true); // Start loading

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/TeacherActivity/checkAssignment/${id}`,
        updateData,
        { withCredentials: true }
      );
      showSuccess(response?.data, response?.status);
      console.log(response.data)
      navigate(`/teacher-assignment-submition/${assid}`); // Redirect after successful update
    } catch (error) {
      console.log(error);
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
            Check Assignment
          </Typography>
          <Grid container spacing={2}>
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
                label="Assessment Check Note"
                name="AssCheckNote"
                value={formData.AssCheckNote}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                required
                error={!!errors.AssCheckNote}
                helperText={errors.AssCheckNote}
              />
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
          </Grid>

          
          {assignment && <AssignmentCard assignment={assignment} index={'A'}/>}
          {submitions && (<SubmissionCard submission={submitions}/>)}

        </Box>


        {/* <SubmissionListMain submissions={submitions}/> */}
      </Container>
    </>
  );
};

export default EditSubmition;
