import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Typography, Stack } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ErrorSnackbar = ({ open, errorDetails, statusCode }) => {
  const renderErrorContent = () => {
    switch (statusCode) {
      case 409: // Conflict
        return (
          <Stack spacing={1}>
            {console.log(errorDetails)}
            <Typography variant="body1"><strong>SQL Error:</strong> {errorDetails.sqlError}</Typography>
            <Typography variant="body1"><strong>Message:</strong> {errorDetails.message}</Typography>
            <Typography variant="body1"><strong>SQL No:</strong> {errorDetails.sqlNo}</Typography>
            <Typography variant="body1"><strong>Exception:</strong> {errorDetails.exception}</Typography>
            <Typography variant="body1"><strong>Stack Trace:</strong> {errorDetails.stackTrace}</Typography>
            <Typography variant="body1"><strong>Table:</strong> {errorDetails.table}</Typography>
          </Stack>
        );
      case 417: // Expectation Failed
        return (
          <Stack spacing={1}>
            {console.log(errorDetails)}
            <Typography variant="body1"><strong>Error:</strong> {errorDetails.error.toString()}</Typography>
            <Typography variant="body1"><strong>Message:</strong> {errorDetails.message}</Typography>
            <Typography variant="body1"><strong>Exception:</strong> {errorDetails.exception}</Typography>
            <Typography variant="body1"><strong>Stack Trace:</strong> {errorDetails.stackTrace}</Typography>
            <Typography variant="body1"><strong>Table:</strong> {errorDetails.table}</Typography>
          </Stack>
        );
     case 400: // Expectation Failed
        return (
          <Stack spacing={1}>
            {console.log(errorDetails)}
            <Typography variant="body1"><strong>Error:</strong> {errorDetails.error.toString()}</Typography>
            <Typography variant="body1"><strong>Message:</strong> {errorDetails.message}</Typography>            
            </Stack>
        );
      default:
        return (
            <Stack spacing={1}>
              {console.log(errorDetails)}
              <Typography variant="body1"><strong>Error:</strong> {errorDetails.error.toString()}</Typography>
              <Typography variant="body1"><strong>Message:</strong> {errorDetails.message}</Typography>            
            </Stack>
          );
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={15000}
    >
      <Alert severity="error" sx={{ width: '100%' }}>
        {renderErrorContent()}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
