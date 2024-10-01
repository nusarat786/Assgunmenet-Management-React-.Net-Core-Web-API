
import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardHeader,
    Avatar,
    CardActionArea,
    Box,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails
  } from '@mui/material';
  import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';  // For Created At
import AlarmIcon from '@mui/icons-material/Alarm';  // For Dead Line
import NoteIcon from '@mui/icons-material/Note';  // For Note
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';  // For important notes
import WarningIcon from '@mui/icons-material/Warning';  // For important warning or notes
import { useNavigate } from 'react-router-dom';
import { ExpandMore as ExpandMoreIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, FileCopy as FileCopyIcon } from '@mui/icons-material';
import { useEffect } from 'react';
import axios from 'axios';
import { showAlertMessage ,handleError } from '../Helper/GetError';
// Card component for each assignment
const StudentAssignmentCard = ({ assignment,index,maxWidth }) => {
  const {assNoteInstruction,subjectName,assMarks, assiId, assName, assQuestionFile, isCoding, codeCheckFileUrl,createdTs,lastDateToSubmitTs } = assignment;
  const navigate = useNavigate();
  const [isSubmited,setIsSubmited] = useState(false);
  const [isDeadLinePassed,setDeadLinePassed] = useState(false);


  function isSubmissionLate(lastDateToSubmit) {
    // Convert the current date and time to Indian Standard Time (IST)
    const currentDateInIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  
    // Convert the dates to Date objects for comparison
    const currentDate = new Date(currentDateInIST);
    const lastDate = new Date(lastDateToSubmit);
  
    // Check if the current date is past the last date to submit
    return currentDate > lastDate;
  }
  
  // Function to open the URL in a new tab
  const handleAssignmentClick = () => {
    window.open(assQuestionFile, '_blank'); // Opens the URL in a new tab
  };

  const handleSubmitionClick = (assiId,isCoding) => {
    console.log(`Card clicked with ID: ${assiId}`);
    //navigate(`/teacher-assignment-submition/${assiId}`)
    
  };

  const handelSubmitAssignment = ()=>{
    navigate(`/submit-coding-assignment/${assiId}`)
  }

  const handelSubmitNoCodeAssignment = ()=>{
    navigate(`/submit-no-code-assignment/${assiId}`)
  }


      // Function to copy code content to clipboard
    const handleCopyClick = (content) => {
        navigator.clipboard.writeText(content);
        alert('Code copied to clipboard!');
    };



    const GetSub = async () => {
        try {
          const request = await axios.get(`${process.env.REACT_APP_API_URL}/Submissions/GetSub/${assiId}`, {
            withCredentials: true,
          });
          console.log(request.data.data);
          setIsSubmited(true);
        } catch (error) {
          if(error?.response?.data?.notfound){
            setIsSubmited(false)
            return ;
          }
            //alert()
          //setIsSubmited(false);
          const { statusCode, errorDetails } = handleError(error);
          return showAlertMessage(statusCode, errorDetails);
        }
    };
    
      useEffect(() => {
        console.log(assignment)
        GetSub();
        setDeadLinePassed(isSubmissionLate(lastDateToSubmitTs))
      }, [assignment]);

  

  return (
    // <div className="card" key={assiId} style={{ border: '1px solid #ddd', padding: '16px', margin: '16px' }}>
    //   <h3>{assName}</h3>
    //   <img src={assQuestionFile} alt={assName} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
    //   {isCoding ? (
    //     <pre
    //       style={{
    //         background: '#f4f4f4',
    //         padding: '10px',
    //         borderRadius: '4px',
    //         overflowX: 'auto',
    //         whiteSpace: 'pre-wrap',
    //         fontFamily: 'monospace',
    //       }}
    //     >
    //       {codeCheckFileUrl}
    //     </pre>
    //   ) : (
    //     <p>This assignment is not coding-related.</p>
    //   )}
    // </div>
    <Grid container direction="column" spacing={2} sx={{ padding: 2 }}>
    {isCoding ? (
        <Grid item key={assiId}>
        <Card
          sx={{
            maxWidth: maxWidth ? maxWidth: 600 ,
            mx: 'auto',
            boxShadow: 3,
            borderRadius: 2,
            transition: 'transform 0.2s',
            // '&:hover': {
            //   transform: 'scale(1.02)',
            //   boxShadow: 6,
            // },
          }}
        >
          <CardActionArea >
            { (isDeadLinePassed && !isSubmited) && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="error">deadline has been passed</Alert>
              </Stack>
              )}
            
            {(!isSubmited && !isDeadLinePassed) && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="warning">assignment submition pending</Alert>
              </Stack>
            )}

            {isSubmited  && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="success">assignment alredy submited</Alert>
              </Stack>
            )}
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {index}
                </Avatar>
              }
              title={assiId + " : " + assName}
              titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
              onClick={() => handleSubmitionClick(assiId,isCoding)}

            />
            <CardContent>
            
            <Box sx={{display:'flex',justifyContent:'space-around' ,backgroundColor:'Highlight',padding:'0.1rem',margin:'0.3rem' ,color:'white' ,borderRadius:'0.2rem'}} >

              

              <Typography variant="body1" gutterBottom>
              Marks : <strong> {assMarks}</strong> 
              </Typography>
              <Typography variant="body1" gutterBottom>
              Subject : <strong> {subjectName}</strong> 
              </Typography>
              <Typography variant="body1" gutterBottom>
              Of Coding : <strong> {isCoding ? 'Yes' : 'No'}</strong> 
              </Typography>
              <Typography variant="body1" gutterBottom sx={{fontWeight:'900'}}  >
              Submited : <strong> {isSubmited ? 'Yes' : 'No'}</strong> 
              </Typography>
              </Box> 
            
            <Box sx={{display:'flex',justifyContent:'space-around'}}>

              <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
              <AccessTimeIcon  /> : <strong> {new Date(createdTs).toLocaleString()}</strong> 
              </Typography>
              <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
              
              <AlarmIcon  /> : <strong> {new Date(lastDateToSubmitTs).toLocaleString()}</strong> 
              </Typography>
            </Box>

           

                  

            

            
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
                {/* <roma>  */}
                <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
                  <WarningIcon  />  
                </Typography>
                  {assNoteInstruction}
                {/* </roma> */}
            </pre>
              



{/*               

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
                       {codeCheckFileUrl}
                    </pre> */}



              {/* <Typography variant="body1" gutterBottom>
                <strong>Course Offered ID:</strong> {course.coId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>CYS ID:</strong> {course.cysId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Subject ID:</strong> {course.sid}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Teacher ID:</strong> {course.tid}
              </Typography> */}
              {/* Uncomment these lines if needed */}
              {/* <Typography variant="body1" gutterBottom>
                <strong>Timestamp:</strong> {new Date(course.ts).toLocaleString()}
              </Typography> */}
              {/* <Typography variant="body1">
                <strong>Description:</strong> {course.cofstr}
              </Typography> */}

                {/* {codeCheckFileUrl && (
                        <Accordion sx={{marginY:'0.5rem'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Test Code </Typography>
                            </AccordionSummary>
                           
                            <AccordionDetails>
                                <Box sx={{ position: 'relative' }}>
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
                                        {codeCheckFileUrl}
                                    </pre>
                                    <Button
                                        onClick={() => handleCopyClick(codeCheckFileUrl)}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            margin: '10px',
                                        }}
                                        size="small"
                                        variant="outlined"
                                        startIcon={<FileCopyIcon />}
                                    >
                                        Copy
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        )}
     */}

          

{/* disabled={isDeadLinePassed} */}

              <Box sx={{display:'flex',justifyContent:'space-around',marginX:'0.4rem'}}>
                <Button size="small" onClick={handleAssignmentClick}>Question File</Button>
                <Button  size="small" onClick={handelSubmitAssignment}>Submit</Button>
             </Box>
    
              {/* <Box >
    
              </Box> */}

              
            </CardContent>
            
          </CardActionArea>
        </Card>
      </Grid>
      ) : (
        <Grid item key={assiId}>
        <Card
          sx={{
            maxWidth: maxWidth ? maxWidth: 600 ,
            mx: 'auto',
            boxShadow: 3,
            borderRadius: 2,
            transition: 'transform 0.2s',
            // '&:hover': {
            //   transform: 'scale(1.02)',
            //   boxShadow: 6,
            // },
          }}
        >
          <CardActionArea >
          { (isDeadLinePassed && !isSubmited) && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="error">deadline has been passed</Alert>
              </Stack>
              )}
            
            {(!isSubmited && !isDeadLinePassed) && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="warning">assignment submition pending</Alert>
              </Stack>
            )}

            {isSubmited  && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="success">assignment alredy submited</Alert>
              </Stack>
            )}
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {index}
                </Avatar>
              }
              title={assiId + " : " + assName}
              titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
              onClick={() => handleSubmitionClick(assiId,isCoding)}

            />
            
            <CardContent>

            <Box sx={{display:'flex',justifyContent:'space-around' ,backgroundColor:'Highlight',padding:'0.1rem',margin:'0.3rem' ,color:'white' ,borderRadius:'0.2rem'}} >

              

              <Typography variant="body1" gutterBottom>
              Marks : <strong> {assMarks}</strong> 
              </Typography>
              <Typography variant="body1" gutterBottom>
              Subject : <strong> {subjectName}</strong> 
              </Typography>

              <Typography variant="body1" gutterBottom>
              Of Coding : <strong> {isCoding ? 'Yes' : 'No'}</strong> 
              </Typography>

              <Typography variant="warning" gutterBottom sx={{fontWeight:'900'}}>
              Submited : <strong > {isSubmited ? 'Yes' : 'No'}</strong> 
              </Typography>
              
              </Box> 
            
            <Box sx={{display:'flex',justifyContent:'space-around'}}>

              <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
              <AccessTimeIcon  /> : <strong> {new Date(createdTs).toLocaleString()}</strong> 
              </Typography>
              <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
              
              <AlarmIcon  /> : <strong> {new Date(lastDateToSubmitTs).toLocaleString()}</strong> 
              </Typography>
            </Box>

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
                      <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
                        <WarningIcon  />  
                      </Typography>
                       {assNoteInstruction}
            </pre>
              {/* <Typography variant="body1" gutterBottom>
                <strong>Course Offered ID:</strong> {course.coId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>CYS ID:</strong> {course.cysId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Subject ID:</strong> {course.sid}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Teacher ID:</strong> {course.tid}
              </Typography> */}
              {/* Uncomment these lines if needed */}
              {/* <Typography variant="body1" gutterBottom>
                <strong>Timestamp:</strong> {new Date(course.ts).toLocaleString()}
              </Typography> */}
              {/* <Typography variant="body1">
                <strong>Description:</strong> {course.cofstr}
              </Typography> */}

            
              <Box sx={{display:'flex',justifyContent:'space-around'}}>
                <Button size="small" onClick={handleAssignmentClick}>Question File</Button>
                <Button  size="small" onClick={handelSubmitNoCodeAssignment} >Submit</Button>
              </Box>
    
              <Box >
    
              </Box>
    
            </CardContent>
            
          </CardActionArea>
        </Card>
      </Grid>
      )}
    </Grid>
  );
};


export default StudentAssignmentCard;



// import React from 'react';
// import {
//     Grid,
//     Card,
//     CardContent,
//     Typography,
//     CardHeader,
//     Avatar,
//     CardActionArea,
//     Box,
//     Button
//   } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';  // For Created At
// import AlarmIcon from '@mui/icons-material/Alarm';  // For Dead Line
// import NoteIcon from '@mui/icons-material/Note';  // For Note
// import PriorityHighIcon from '@mui/icons-material/PriorityHigh';  // For important notes
// import WarningIcon from '@mui/icons-material/Warning';  // For important warning or notes
// import { useNavigate } from 'react-router-dom';
  

// // Card component for each assignment
// const StudentAssignmentCard = ({ assignment,index }) => {
   
//     const {assNoteInstruction,subjectName,assMarks, assiId, assName, assQuestionFile, isCoding, codeCheckFileUrl,createdTs,lastDateToSubmitTs } = assignment;
//     const navigate = useNavigate();
  
//     // Function to open the URL in a new tab
//     const handleAssignmentClick = () => {
//       window.open(assQuestionFile, '_blank'); // Opens the URL in a new tab
//     };
  
//     const handleSubmitionClick = (assiId,isCoding) => {
//       console.log(`Card clicked with ID: ${assiId}`);
//       navigate(`/teacher-assignment-submition/${assiId}`)
      
//     };
  
//     const handelEditAssignment = ()=>{
//       navigate(`/edit-assignment/${assiId}`)
//     }

//     const handelEditNoCodeAssignment = ()=>{
//         navigate(`/edit-no-code-assignment/${assiId}`)
//       }
  
//     return (
//       // <div className="card" key={assiId} style={{ border: '1px solid #ddd', padding: '16px', margin: '16px' }}>
//       //   <h3>{assName}</h3>
//       //   <img src={assQuestionFile} alt={assName} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
//       //   {isCoding ? (
//       //     <pre
//       //       style={{
//       //         background: '#f4f4f4',
//       //         padding: '10px',
//       //         borderRadius: '4px',
//       //         overflowX: 'auto',
//       //         whiteSpace: 'pre-wrap',
//       //         fontFamily: 'monospace',
//       //       }}
//       //     >
//       //       {codeCheckFileUrl}
//       //     </pre>
//       //   ) : (
//       //     <p>This assignment is not coding-related.</p>
//       //   )}
//       // </div>
//       <Grid container direction="column" spacing={2} sx={{ padding: 2 }}>
//       {isCoding ? (
//           <Grid item key={assiId}>
//           <Card
//             sx={{
//               maxWidth: 600,
//               mx: 'auto',
//               boxShadow: 3,
//               borderRadius: 2,
//               transition: 'transform 0.2s',
//               // '&:hover': {
//               //   transform: 'scale(1.02)',
//               //   boxShadow: 6,
//               // },
//             }}
//           >
//             <CardActionArea >
//               <CardHeader
//                 avatar={
//                   <Avatar sx={{ bgcolor: 'primary.main' }}>
//                     {index}
//                   </Avatar>
//                 }
//                 title={assiId + " : " + assName}
//                 titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
//                 onClick={() => handleSubmitionClick(assiId,isCoding)}
  
//               />
//               <CardContent>
              
//               <Box sx={{display:'flex',justifyContent:'space-around' ,backgroundColor:'Highlight',padding:'0.1rem',margin:'0.3rem' ,color:'white' ,borderRadius:'0.2rem'}} >
  
                
  
//                 <Typography variant="body1" gutterBottom>
//                 Marks : <strong> {assMarks}</strong> 
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                 Subject : <strong> {subjectName}</strong> 
//                 </Typography>
//                 </Box> 
              
//               <Box sx={{display:'flex',justifyContent:'space-around'}}>
  
//                 <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
//                 <AccessTimeIcon  /> : <strong> {new Date(createdTs).toLocaleString()}</strong> 
//                 </Typography>
//                 <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
                
//                 <AlarmIcon  /> : <strong> {new Date(lastDateToSubmitTs).toLocaleString()}</strong> 
//                 </Typography>
//               </Box>
  
              
  
              
//               <pre
//                          style={{
//                           background: '#f4f4f4',
//                           padding: '10px',
//                           borderRadius: '4px',
//                           overflowX: 'auto',
//                           whiteSpace: 'pre-wrap',
//                           fontFamily: 'monospace',
//                          }}
//                        >
//                   {/* <roma>  */}
//                   <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
//                     <WarningIcon  />  
//                   </Typography>
//                     {assNoteInstruction}
//                   {/* </roma> */}
//               </pre>
                
  
  
  
                
  
//                       <pre
//                          style={{
//                           background: '#f4f4f4',
//                           padding: '10px',
//                           borderRadius: '4px',
//                           overflowX: 'auto',
//                           whiteSpace: 'pre-wrap',
//                           fontFamily: 'monospace',
//                          }}
//                        >
//                          {codeCheckFileUrl}
//                       </pre>
//                 {/* <Typography variant="body1" gutterBottom>
//                   <strong>Course Offered ID:</strong> {course.coId}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>CYS ID:</strong> {course.cysId}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Subject ID:</strong> {course.sid}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Teacher ID:</strong> {course.tid}
//                 </Typography> */}
//                 {/* Uncomment these lines if needed */}
//                 {/* <Typography variant="body1" gutterBottom>
//                   <strong>Timestamp:</strong> {new Date(course.ts).toLocaleString()}
//                 </Typography> */}
//                 {/* <Typography variant="body1">
//                   <strong>Description:</strong> {course.cofstr}
//                 </Typography> */}
//                 <Box sx={{display:'flex',justifyContent:'space-around',marginX:'0.4rem'}}>
//                   <Button size="small" onClick={handleAssignmentClick}>Question File</Button>
//                   <Button size="small" onClick={handelEditAssignment}>Edit</Button>
//                </Box>
      
//                 {/* <Box >
      
//                 </Box> */}
      
//               </CardContent>
              
//             </CardActionArea>
//           </Card>
//         </Grid>
//         ) : (
//           <Grid item key={assiId}>
//           <Card
//             sx={{
//               maxWidth: 600,
//               mx: 'auto',
//               boxShadow: 3,
//               borderRadius: 2,
//               transition: 'transform 0.2s',
//               // '&:hover': {
//               //   transform: 'scale(1.02)',
//               //   boxShadow: 6,
//               // },
//             }}
//           >
//             <CardActionArea >
//               <CardHeader
//                 avatar={
//                   <Avatar sx={{ bgcolor: 'primary.main' }}>
//                     {index}
//                   </Avatar>
//                 }
//                 title={assiId + " : " + assName}
//                 titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
//                 onClick={() => handleSubmitionClick(assiId,isCoding)}
  
//               />
              
//               <CardContent>
  
//               <Box sx={{display:'flex',justifyContent:'space-around' ,backgroundColor:'Highlight',padding:'0.1rem',margin:'0.3rem' ,color:'white' ,borderRadius:'0.2rem'}} >
  
                
  
//                 <Typography variant="body1" gutterBottom>
//                 Marks : <strong> {assMarks}</strong> 
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                 Subject : <strong> {subjectName}</strong> 
//                 </Typography>
//                 </Box> 
              
//               <Box sx={{display:'flex',justifyContent:'space-around'}}>
  
//                 <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
//                 <AccessTimeIcon  /> : <strong> {new Date(createdTs).toLocaleString()}</strong> 
//                 </Typography>
//                 <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
                
//                 <AlarmIcon  /> : <strong> {new Date(lastDateToSubmitTs).toLocaleString()}</strong> 
//                 </Typography>
//               </Box>
  
//               <pre
//                          style={{
//                           background: '#f4f4f4',
//                           padding: '10px',
//                           borderRadius: '4px',
//                           overflowX: 'auto',
//                           whiteSpace: 'pre-wrap',
//                           fontFamily: 'monospace',
//                          }}
//                        >
//                         <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
//                           <WarningIcon  />  
//                         </Typography>
//                          {assNoteInstruction}
//               </pre>
//                 {/* <Typography variant="body1" gutterBottom>
//                   <strong>Course Offered ID:</strong> {course.coId}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>CYS ID:</strong> {course.cysId}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Subject ID:</strong> {course.sid}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Teacher ID:</strong> {course.tid}
//                 </Typography> */}
//                 {/* Uncomment these lines if needed */}
//                 {/* <Typography variant="body1" gutterBottom>
//                   <strong>Timestamp:</strong> {new Date(course.ts).toLocaleString()}
//                 </Typography> */}
//                 {/* <Typography variant="body1">
//                   <strong>Description:</strong> {course.cofstr}
//                 </Typography> */}
//                 <Box sx={{display:'flex',justifyContent:'space-around'}}>
//                   <Button size="small" onClick={handleAssignmentClick}>Question File</Button>
//                   <Button size="small" onClick={handelEditNoCodeAssignment}>Edit</Button>
//                 </Box>
      
//                 <Box >
      
//                 </Box>
      
//               </CardContent>
              
//             </CardActionArea>
//           </Card>
//         </Grid>
//         )}
//       </Grid>
//     );
//   };


//   export default StudentAssignmentCard;
