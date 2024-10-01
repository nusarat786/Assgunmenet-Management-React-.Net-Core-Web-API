import * as React from 'react';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import request from 'superagent';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutBasic from './Admin.DashBoard';
import { useParams } from 'react-router-dom';

export default function Admin() {
  const { page } = useParams();
  return (
    <>
     <DashboardLayoutBasic page={`/${page}`} />          
    </>
  );
}


