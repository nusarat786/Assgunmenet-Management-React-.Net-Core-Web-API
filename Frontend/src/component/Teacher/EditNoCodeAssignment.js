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
import { useParams, useNavigate } from 'react-router-dom';
import TeacherHeader from './TeacherHeader';

const EditNoCodeAssignmentForm = () => {
  const { id } = useParams(); // Get the assignment ID from the URL parameters
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [formData, setFormData] = useState({
    AssName: '',
    AssNoteInstruction: '',
    AssMarks: '',
    CoId: '',
    File: null,
    LastDateToSubmitTs: '',
  });

  const [fileNames, setFileNames] = useState({
    FileName: '',
  });

  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch existing assignment details to prefill the form
  const fetchAssignmentDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Assignments/${id}`,
        { withCredentials: true }
      );
      const assignment = response.data.data;

      let formattedDate = '';
      if (assignment.lastDateToSubmitTs) {
        const parsedDate = new Date(assignment.lastDateToSubmitTs);
        if (!isNaN(parsedDate)) {
          formattedDate = assignment.lastDateToSubmitTs.substring(0, 16);
        }
      }

      setFormData({
        AssName: assignment.assName,
        AssNoteInstruction: assignment.assNoteInstruction,
        AssMarks: assignment.assMarks,
        CoId: assignment.coId,
        LastDateToSubmitTs: formattedDate,
      });

      setFileNames({
        FileName: assignment.AssQuestionFile || '',
      });
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    }
  };

  const getCourses = async () => {
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
    getCourses();
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
    formDataToSend.append('LastDateToSubmitTs', formData.LastDateToSubmitTs);
    formDataToSend.append('AssiId', id);

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/Assignments/updateNoCodeAssignmnet/${id}`,
        formDataToSend,
        {
          withCredentials: true,
        }
      );
      showSuccess(response?.data, response?.status);
      navigate(`/teacher-assignment-submition/${response?.data?.data?.assiId}`)
    
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    } finally {
      setLoading(false);
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
            Edit No-Code Assignment
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
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default EditNoCodeAssignmentForm;
