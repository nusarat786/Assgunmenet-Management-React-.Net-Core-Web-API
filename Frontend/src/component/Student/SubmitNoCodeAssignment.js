import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Container,
  Box,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, showAlertMessage, showSuccess } from '../Helper/GetError';
import StudentHeader from './StudentHeader';
import CYSSUBCard from './CYSSubjectCard';
import StudentSubmitionCard from './StudentSubmitionCard';
import StudentAssignmentCard from './SudentAssignmentCard';

const SubmitNoCodeAssignment = () => {
  const { assId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [issubmited, setIsSubmited] = useState(false);
  const [submition, setsubmition] = useState();
  const [formData, setFormData] = useState({
    AnswerNote: '',
    AnswerFile: null,
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [compileError, setCompilationError] = useState();
  const [ce, setCE] = useState(false);

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
      setIsSubmited(true);
      setsubmition(request.data.data);
    } catch (error) {
      if (error?.response?.data?.notfound) {
        setIsSubmited(false);
        return;
      }
      const { statusCode, errorDetails } = handleError(error);
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  useEffect(() => {
    GetSub();
    getAssignment();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      AnswerFile: file, // Update file in state
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setCompilationError(null);

    if (!formData.AnswerNote || !formData.AnswerFile) {
      setErrors({
        AnswerNote: !formData.AnswerNote ? "Answer Note is required" : "",
        AnswerFile: !formData.AnswerFile ? "Answer File is required" : "",
      });
      return;
    }

    const confirmSubmit = window.confirm('You cannot edit once submitted.');
    if (!confirmSubmit) {
      return;
    }

    const form = new FormData();
    form.append('AssiId', assignment?.assiId);
    form.append('AnswerNote', formData.AnswerNote);
    form.append('AnswerFile', formData.AnswerFile); // Append the file to FormData

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Submissions/submitNoCodeAssignmentWithFile`,
        form,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setLoading(false);
      showSuccess(response?.data, response?.status);
      GetSub();
      getAssignment();

    } catch (error) {
      if (error?.response?.data?.iscompileerror) {
        setCompilationError(error?.response?.data?.compileError);
        setCE(true);
        setTimeout(() => setCE(false), 1000);
        return;
      }
      const { statusCode, errorDetails } = handleError(error);
      showAlertMessage(statusCode, errorDetails);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StudentHeader />
      <Container maxWidth="md" sx={{ mt: '5rem', mb: 4, width: '100vw' }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Submission of Non-Coding Assignment
        </Typography>
        {course && <CYSSUBCard cys={course} maxWidth={'md'} />}
        {assignment && <StudentAssignmentCard assignment={assignment} index={'A'} maxWidth={'md'} />}

        {!submition && (
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ width: '100%'}}>
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
                <Button
                  variant="contained"
                  component="label"
                  sx={{ width: '100%' }}
                >
                  Upload Answer File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    required
                  />
                </Button>
                {formData.AnswerFile && (
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Selected file: {formData.AnswerFile.name}
                  </Typography>
                )}
                {errors.AnswerFile && (
                  <Typography color="error">{errors.AnswerFile}</Typography>
                )}
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

        {submition && <StudentSubmitionCard submission={submition} index={'S'} maxWidth={'md'} />}
      </Container>
    </>
  );
};

export default SubmitNoCodeAssignment;
