import React from 'react';
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';  // For Created At
import AlarmIcon from '@mui/icons-material/Alarm';  // For Dead Line
import NoteIcon from '@mui/icons-material/Note';  // For Note
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';  // For important notes
import WarningIcon from '@mui/icons-material/Warning';  // For important warning or notes
import { useNavigate } from 'react-router-dom';
import { ExpandMore as ExpandMoreIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, FileCopy as FileCopyIcon } from '@mui/icons-material';


// Card component for each assignment
const AssignmentCard2 = ({ assignment,index ,maxWidth}) => {
  const {assNoteInstruction,subjectName,assMarks, assiId, assName, assQuestionFile, isCoding, codeCheckFileUrl,createdTs,lastDateToSubmitTs } = assignment;
  const navigate = useNavigate();

  // Function to open the URL in a new tab
  const handleAssignmentClick = () => {
    window.open(assQuestionFile, '_blank'); // Opens the URL in a new tab
  };

  const handleSubmitionClick = (assiId,isCoding) => {
    console.log(`Card clicked with ID: ${assiId}`);
    navigate(`/teacher-assignment-submition/${assiId}`)
    
  };

  const handelEditAssignment = ()=>{
    navigate(`/edit-assignment/${assiId}`)
  }

  const handelEditNoCodeAssignment = ()=>{
    navigate(`/edit-no-code-assignment/${assiId}`)
  }

  const handelReport = ()=>{
    navigate(`/get-assignment-report/${assiId}`)
  }


      // Function to copy code content to clipboard
    const handleCopyClick = (content) => {
        navigator.clipboard.writeText(content);
        alert('Code copied to clipboard!');
    };

  

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
            maxWidth: maxWidth ? maxWidth :600,
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

{codeCheckFileUrl && (
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
    

              <Box sx={{display:'flex',justifyContent:'space-around',marginX:'0.4rem'}}>
                <Button size="small" onClick={handleAssignmentClick}>Question File</Button>
                <Button size="small" onClick={handelReport} >Get Report</Button>
                <Button size="small" onClick={handelEditAssignment}>Edit</Button>
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
            maxWidth:maxWidth? maxWidth: 600,
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
                <Button size="small" onClick={handelReport} >Get Report</Button>
                <Button size="small" onClick={handelEditNoCodeAssignment} >Edit</Button>
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


export default AssignmentCard2;