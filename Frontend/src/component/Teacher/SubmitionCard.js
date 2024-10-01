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
    Button
} from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime'; // For Submitted At
// import AlarmIcon from '@mui/icons-material/Alarm'; // For Turned In At
// import NoteIcon from '@mui/icons-material/Note'; // For Notes
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // For Passed Tests
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, AccessTime as AccessTimeIcon, Alarm as AlarmIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, Note as NoteIcon, FileCopy as FileCopyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// // Card component for each submission
// const SubmissionCard = ({ submission, index }) => {
//     const { subId, assiId, stId, answerFile, answerNote, testCasePassed, testCaseFailed, submittedTs, turnedInTs, marks, code,assCheckNote } = submission;

//     // Function to open the answer file (if available)
//     const handleAnswerFileClick = () => {
//         if (answerFile) {
//             window.open(answerFile, '_blank');
//         }
//     };

//     return (
//         <Grid item key={subId}>
//             <Card
//                 sx={{
//                     maxWidth: 600,
//                     mx: 'auto',
//                     boxShadow: 3,
//                     borderRadius: 2,
//                     transition: 'transform 0.2s',
//                 }}
//             >
//                 <CardActionArea>
//                     <CardHeader
//                         avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{index}</Avatar>}
//                         title={`Submission ID: ${subId} (Assignment: ${assiId})`}
//                         titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
//                     />
//                     <CardContent>

//                         {answerFile && (
//                             <Box sx={{ display: 'flex', justifyContent: 'space-around', marginX: '0.4rem' }}>
//                                 <Button size="small" onClick={handleAnswerFileClick}>Answer File</Button>
//                             </Box>
//                         )}
//                         <Box sx={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'Highlight', padding: '0.1rem', margin: '0.3rem', color: 'white', borderRadius: '0.2rem' }}>
//                             <Typography variant="body1" gutterBottom>
//                                 Marks: <strong>{marks}</strong>
//                             </Typography>
//                             <Typography variant="body1" gutterBottom>
//                                 Student ID: <strong>{stId}</strong>
//                             </Typography>
//                         </Box>

//                         <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
//                             <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
//                                 <AccessTimeIcon /> Submitted: <strong>{new Date(submittedTs).toLocaleString()}</strong>
//                             </Typography>
//                             {turnedInTs && (
//                                 <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
//                                     <AlarmIcon /> Turned In: <strong>{new Date(turnedInTs).toLocaleString()}</strong>
//                                 </Typography>
//                             )}
//                         </Box>

//                         <Typography variant="body1" gutterBottom>
//                             <AssignmentTurnedInIcon /> Test Cases Passed: {testCasePassed}, Failed: {testCaseFailed}
//                         </Typography>

//                         <pre
//                             style={{
//                                 background: '#f4f4f4',
//                                 padding: '10px',
//                                 borderRadius: '4px',
//                                 overflowX: 'auto',
//                                 whiteSpace: 'pre-wrap',
//                                 fontFamily: 'monospace',
//                             }}
//                         >
//                             {code}
//                         </pre>

//                         <pre
//                             style={{
//                                 background: '#f4f4f4',
//                                 padding: '10px',
//                                 borderRadius: '4px',
//                                 overflowX: 'auto',
//                                 whiteSpace: 'pre-wrap',
//                                 fontFamily: 'monospace',
//                             }}
//                         >
//                             <NoteIcon /> Answer Notes: {answerNote}
//                         </pre>

//                         {assCheckNote &&
//                         (<pre
//                             style={{
//                                 background: '#f4f4f4',
//                                 padding: '10px',
//                                 borderRadius: '4px',
//                                 overflowX: 'auto',
//                                 whiteSpace: 'pre-wrap',
//                                 fontFamily: 'monospace',
//                             }}
//                         >
//                             <NoteIcon /> Assignment Check Notes: {assCheckNote}
//                         </pre>)
//                         }

                        



                        
//                     </CardContent>
//                 </CardActionArea>
//             </Card>
//         </Grid>
//     );
// };

const SubmissionCard = ({ submission, index }) => {
    const { subId, assiId, stId, answerFile, answerNote, testCasePassed, testCaseFailed, submittedTs, turnedInTs, marks, code, assCheckNote } = submission;

    const navigate = useNavigate();
    // Function to open the answer file (if available)
    const handleAnswerFileClick = () => {
        if (answerFile) {
            window.open(answerFile, '_blank');
        }
    };

    // Function to copy code content to clipboard
    const handleCopyClick = (content) => {
        navigator.clipboard.writeText(content);
        alert('Code copied to clipboard!');
    };

    const handleCheck = () => {
        navigate(`/checkAssignment/${subId}`)
    };
    

    return (
        <Grid item key={subId} sx={{marginY:'1rem'}}>
            <Card
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                }}
            >
                <CardActionArea>
                    <CardHeader
                        avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{index}</Avatar>}
                        title={`Submission ID: ${subId} (Assignment: ${assiId})`}
                        titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
                    />
                    <CardContent>

                        {answerFile && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginX: '0.4rem' }}>
                                <Button size="small" onClick={handleAnswerFileClick}>Answer File</Button>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'Highlight', padding: '0.1rem', margin: '0.3rem', color: 'white', borderRadius: '0.2rem' }}>
                            <Typography variant="body1" gutterBottom>
                                Marks: <strong>{marks}</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Student ID: <strong>{stId}</strong>
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
                                <AccessTimeIcon /> Submitted: <strong>{new Date(submittedTs).toLocaleString()}</strong>
                            </Typography>
                            {turnedInTs && (
                                <Typography sx={{ verticalAlign: 'middle', mr: 1 }} variant="body1" gutterBottom>
                                    <AlarmIcon /> Turned In: <strong>{new Date(turnedInTs).toLocaleString()}</strong>
                                </Typography>
                            )}
                        </Box>

                        <Typography variant="body1" gutterBottom>
                            <AssignmentTurnedInIcon /> Test Cases Passed: {testCasePassed}, Failed: {testCaseFailed}
                        </Typography>

                        
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
                            <NoteIcon /> Answer Notes: {answerNote}
                        </pre>


                        {assCheckNote &&
                        (<pre
                            style={{
                                background: '#f4f4f4',
                                padding: '10px',
                                borderRadius: '4px',
                                overflowX: 'auto',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                            }}
                        >
                            <NoteIcon /> Assignment Check Notes: {assCheckNote}
                        </pre>)
                        }


                        {/* Accordion for code block */}
                        {code && (
                        <Accordion sx={{marginY:'0.5rem'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>View Code</Typography>
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
                                        {code}
                                    </pre>
                                    <Button
                                        onClick={() => handleCopyClick(code)}
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
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', marginX: '0.4rem' }}>
                                <Button size="small" onClick={handleCheck}>Check Submition</Button>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};


export default SubmissionCard;
