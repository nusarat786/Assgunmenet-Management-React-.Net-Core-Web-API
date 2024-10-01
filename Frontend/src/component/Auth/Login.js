import * as React from 'react';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import request from 'superagent';
import { useNavigate } from 'react-router-dom';
import  { useEffect, useState } from 'react';


const providers = [{ id: 'credentials', name: 'Email and Password' }];

// Ensure you have the API URL from your .env file
const API_URL = process.env.REACT_APP_API_URL;


const signIn2 = async (provider, formData, role,navigate) => {
  const email = formData.get('email');
  const password = formData.get('password');

  let endpoint;
  let navTo;
  // Determine the endpoint based on the role
  switch (role) {
    case 'admin':
      endpoint = `${API_URL}/Auth/adminLogin`;
      navTo="/admin-dashboard"
      break;
    case 'teacher':
      endpoint = `${API_URL}/Auth/teacherLogin`;
      navTo="/teacher-dashboard"
      break;
    case 'student':
      endpoint = `${API_URL}/Auth/studentLogin`;
      navTo="/student-dashboard"
      break;
    default:
      alert('Invalid role');
      return;
  }

  try {
    const response = await request
      .post(endpoint) // Use the role-specific endpoint
      .send({
        email,
        password,
      })
      .withCredentials(); // Important to include cookies

    // Set a cookie with the token
    document.cookie = `token=${response.body.id}; path=/; SameSite=Lax;`;

    console.log(response.data);
    alert('Login successful!');
    navigate(navTo);
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed: ' + error.message);
  }
};


const signIn = async (provider, formData, role,navigate) => {
  const email = formData.get('email');
  const password = formData.get('password');

  let endpoint;
  let roles;
  let navTo;
  // Determine the endpoint based on the role
  
  switch (role) {
    case 'admin':
      endpoint = `${API_URL}/Auth/adminLogin`;
      navTo="/admin-dashboard"
      break;
    case 'teacher':
      endpoint = `${API_URL}/Auth/teacherLogin`;
      navTo="/teacher-dashboard"
      break;
    case 'student':
      endpoint = `${API_URL}/Auth/studentLogin`;
      navTo="/student-dashboard"
      break;
    default:
      alert('Invalid role');
      return;
  }

  try {
        const response = await axios.post(endpoint, {
      email,
      password,
    }, {
      withCredentials: true, // Important to include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response);

    
    // Set a cookie with the token (if needed)
    document.cookie = `role=${role}/${response?.data?.data}; path=/; SameSite=Lax;`;

    alert('Login successful!');
    navigate(navTo);
  } catch (error) {
    
    console.error('Error:', error);
    alert('Login failed: ' + error.message);
  }
};

export default function CredentialsSignInPage() {
  const theme = useTheme();
  const [role, setRole] = React.useState('student'); // Default role is "student"
  const navigate = useNavigate(); // Use the useNavigate hook


  
  useEffect(() => {
    // Get cookies
    const cookies = document.cookie;

    if (!cookies) {
      return;
    }

    

    // Assuming the role is stored in a cookie like "roleName/tokenValue"
    const roleCookie = cookies.split('; ').find(row => row.startsWith('role='));

    if (!roleCookie) {
      return ;
    }

    if (roleCookie) {
      
      const roleValue = roleCookie.split('=')[1]; // Get the value after 'role='
      const r = roleValue.split('/')[0]; // Extract the role before the "/"
      let navTo;
      console.log(r);

      switch (r) {
        case 'admin':
          navTo="/admin-dashboard"
          break;
        case 'teacher':
          navTo="/teacher-dashboard"
          break;
        case 'student':
          navTo="/student-dashboard"
          break;
        default:
          // alert('Invalid role');
          // navTo="/login"
          return;
      }

      navigate(navTo);
      return;
    }
  }, []);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <AppProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 6,
          mb:0,
        }}
      >
        
        <FormControl   sx={{ mb: 0,width:"10rem" }}>
          <InputLabel id="role-select-label">Select Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label="Select Role"
            onChange={handleRoleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
        </FormControl>
        <SignInPage 
          signIn={(provider, formData) => signIn(provider, formData, role,navigate)} 
          providers={providers} 
        />

        
      </Box>
    </AppProvider>
  );
}


