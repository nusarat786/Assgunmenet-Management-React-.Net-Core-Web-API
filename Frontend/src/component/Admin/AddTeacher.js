import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function AddTeacher() {
  const [formData, setFormData] = useState({
    tfname: '',
    tsname: '',
    tdob: '',
    tphone: '',
    temail: '',
    tjoiningDate: '',
    tpassword: '',
    ts: '',
    departmentId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/your-api-endpoint`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Form submission failed: ' + error.message);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTextField-root': { m: 1, width: '400px' },
        mt: 4,
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        required
        label="First Name"
        name="tfname"
        value={formData.tfname}
        onChange={handleChange}
      />
      <TextField
        required
        label="Surname"
        name="tsname"
        value={formData.tsname}
        onChange={handleChange}
      />
      <TextField
        required
        label="Date of Birth"
        name="tdob"
        type="date"
        value={formData.tdob}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        required
        label="Phone"
        name="tphone"
        value={formData.tphone}
        onChange={handleChange}
      />
      <TextField
        required
        label="Email"
        name="temail"
        type="email"
        value={formData.temail}
        onChange={handleChange}
      />
      <TextField
        required
        label="Joining Date"
        name="tjoiningDate"
        type="date"
        value={formData.tjoiningDate}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        required
        label="Password"
        name="tpassword"
        type="password"
        value={formData.tpassword}
        onChange={handleChange}
      />
      <TextField
        required
        label="Timestamp"
        name="ts"
        type="datetime-local"
        value={formData.ts}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormControl required sx={{ m: 1, width: '300px' }}>
        <InputLabel id="department-select-label">Department</InputLabel>
        <Select
          labelId="department-select-label"
          name="departmentId"
          value={formData.departmentId}
          label="Department"
          onChange={handleChange}
        >
          <MenuItem value={1}>Department 1</MenuItem>
          <MenuItem value={2}>Department 2</MenuItem>
          <MenuItem value={3}>Department 3</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
