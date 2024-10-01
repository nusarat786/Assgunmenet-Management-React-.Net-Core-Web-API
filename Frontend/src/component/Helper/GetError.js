const handleError = (error, defaultTable = 'N/A') => {
    const statusCode = error?.response?.status || 500;
    console.log(error?.response?.data)
    const errorDetails =error?.response?.data || {
      error: true,
      message: error?.response?.data?.message || 'Server error :Api No Connected',
      
    };
  
    return { statusCode, errorDetails };
  };
  

  const handleClose = (setError,error) => {
    setError({ ...error, open: false });
  };


  const showAlertMessage = (statusCode, errorDetails) => {
    // Format the error details into a multi-line string
    const errorDetailsLines = Object.entries(errorDetails).map(
      ([key, value]) => `${key}: ${value}`
    ).join('\n');
  
    // Create the complete error message
    const errorMessage = `
      Status Code: ${statusCode}
      ${errorDetailsLines}
    `.trim();
  
    // Display the error message in an alert dialog
     alert(errorMessage);
  };


  const showSuccess = (data,code) => {
    // Format the error details into a multi-line string
    const errorDetailsLines = Object.entries(data).map(
      ([key, value]) => `${key}: ${value}`
    ).join('\n');
  
    // Create the complete error message
    const errorMessage = `
      Status Code: ${code}
      ${errorDetailsLines}
    `.trim();
  
    // Display the error message in an alert dialog
     alert(errorMessage);
  };
  export  {handleError,handleClose,showAlertMessage,showSuccess};



  