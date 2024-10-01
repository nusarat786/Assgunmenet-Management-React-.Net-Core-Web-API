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
// Sample Data (Replace this with your actual data)
const assignments = [
  {
    assiId: 1030,
    assName: '4. GET STRING',
    assQuestionFile:
      'https://firebasestorage.googleapis.com/v0/b/fir-e1409.appspot.com/o/4.%20GET%20STRING_5b9552ce-810a-4ef0-be3a-0912a9a27701_1.png?alt=media',
    assNoteInstruction: 'METHOD ONLY',
    assTestCase: '""',
    assMarks: 20,
    coId: 1,
    createdTs: '2024-08-23T14:26:40.723',
    lastDateToSubmitTs: '2024-08-29T16:17:02.57',
    isCoding: true,
    subjectName: 'c#',
    codeCheckFileUrl: `
      using System;
      using System.Collections.Generic;

      class Program
      {
          static void Main()
          {
              // Define test cases
              var testCases = new List<(string, int)>
              {
                  ("abcabcbb", 3), // "abc"
                  ("bbbbb", 1),    // "b"
                  ("pwwkew", 3),   // "wke"
              };

              int totalTests = testCases.Count;
              int passedTests = 0;

              foreach (var (s, expected) in testCases)
              {
                  int result = LengthOfLongestSubstring(s);
                  if (result == expected)
                  {
                      passedTests++;
                  }
              }

              Console.WriteLine($"{passedTests}/{totalTests}");
          }
      }
    `,
  },
  {
    assiId: 1032,
    assName: 'a.) Longest Substring with At Most Two Distinct Characters',
    assQuestionFile:
      'https://firebasestorage.googleapis.com/v0/b/fir-e1409.appspot.com/o/a.)%20Longest%20Substring%20with%20At%20Most%20Two%20Distinct%20Characters_5b18f712-29c4-4792-b242-311c6419bfea_1.png?alt=media',
    assNoteInstruction: 'Problem:\nGiven a string s, find the length of the longest substring that contains at most two distinct characters.',
    assMarks: 30,
    coId: 1,
    createdTs: '2024-08-23T20:02:58.813',
    lastDateToSubmitTs: '2024-08-29T16:17:02.57',
    isCoding: true,
    subjectName: 'c#',
    codeCheckFileUrl: `
      using System;
      using System.Collections.Generic;

      class Program
      {
          static void Main()
          {
              var testCases = new List<(string, int)>
              {
                  ("eceba", 3),   // "ece"
                  ("ccaabbb", 5), // "aabbb"
              };

              int totalTests = testCases.Count;
              int passedTests = 0;

              foreach (var (s, expected) in testCases)
              {
                  int result = LengthOfLongestSubstringWithTwoDistinct(s);
                  if (result == expected)
                  {
                      passedTests++;
                  }
              }

              Console.WriteLine($"{passedTests}/{totalTests}");
          }
      }
    `,
  },
  {
    assiId: 1035,
    assName: 'c). Move Zeroes to End',
    assQuestionFile:
      'https://firebasestorage.googleapis.com/v0/b/fir-e1409.appspot.com/o/c).%20Move%20Zeroes%20to%20End_955b01bb-821e-4dae-a5b7-a1c85efe5d8b_1.pdf?alt=media',
    assNoteInstruction:
      "Problem: Given an integer array nums, move all 0's to the end while maintaining the relative order of the non-zero elements.",
    assMarks: 25,
    coId: 1,
    createdTs: '2024-08-23T21:27:05.287',
    lastDateToSubmitTs: '2024-08-29T16:17:02.57',
    isCoding: true,
    subjectName: 'c#',
    codeCheckFileUrl: `
      using System;
      using System.Collections.Generic;
      using System.Linq;

      class Program
      {
          static void Main()
          {
              var testCases = new List<(int[], int[], int[])>
              {
                  (new[] {1, 2, 2, 1}, new[] {2, 2}, new[] {2}),
              };

              int totalTests = testCases.Count;
              int passedTests = 0;

              foreach (var (nums1, nums2, expected) in testCases)
              {
                  var result = Intersection(nums1, nums2);
                  if (AreArraysEqual(result, expected))
                  {
                      passedTests++;
                  }
              }

              Console.WriteLine($"{passedTests}/{totalTests}");
          }
      }
    `,
  },
  // Add more assignments as needed
];

// Card component for each assignment
const AssignmentCard = ({ assignment,index }) => {
  const { assiId, assName, assQuestionFile, isCoding, codeCheckFileUrl,createdTs,lastDateToSubmitTs } = assignment;
  // Function to open the URL in a new tab
  const handleAssignmentClick = () => {
    window.open(assQuestionFile, '_blank'); // Opens the URL in a new tab
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
            maxWidth: 600,
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
            />
            <CardContent>

              <Box sx={{display:'flex',justifyContent:'space-around'}}>
              <Typography variant="body1" gutterBottom>
              Created At : <strong> {new Date(createdTs).toLocaleString()}</strong> 
              </Typography>
              <Typography variant="body1" gutterBottom>
              Dead Line : <strong> {new Date(lastDateToSubmitTs).toLocaleString()}</strong> 
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
                       {codeCheckFileUrl}
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
                <Button size="small">Edit</Button>
              </Box>
    
              <Box >
    
              </Box>
    
            </CardContent>
            
          </CardActionArea>
        </Card>
      </Grid>
      ) : (
        <Grid item>
        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            boxShadow: 3,
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 6,
            },
          }}
        >
          <CardActionArea>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {/* <SchoolIcon /> */}
                </Avatar>
              }
              title="No Data Found"
              titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
            />
          </CardActionArea>
        </Card>
      </Grid>
      )}
    </Grid>
  );
};

// Main component rendering all assignments
const AssignmentList = () => {
  return (
    <div>
      <h1>Assignments</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {assignments.map((assignment,index) => (
          <AssignmentCard key={assignment.assiId} assignment={assignment}  index={index+1}/>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;


// <Grid container direction="column" spacing={2} sx={{ padding: 2 }}>
// {cof?.length > 0 ? (
//   cof.map((course) => (
//     <Grid item key={course.coId}>
//       <Card
//         sx={{
//           maxWidth: 600,
//           mx: 'auto',
//           boxShadow: 3,
//           borderRadius: 2,
//           transition: 'transform 0.2s',
//           '&:hover': {
//             transform: 'scale(1.02)',
//             boxShadow: 6,
//           },
//         }}
//       >
//         <CardActionArea onClick={() => handleCardClick(course.coId)}>
//           <CardHeader
//             avatar={
//               <Avatar sx={{ bgcolor: 'primary.main' }}>
//                 <SchoolIcon />
//               </Avatar>
//             }
//             title={course.cofstr}
//             titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
//           />
//           <CardContent>
//             <Typography variant="body1" gutterBottom>
//               <strong>Course Offered ID:</strong> {course.coId}
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               <strong>CYS ID:</strong> {course.cysId}
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               <strong>Subject ID:</strong> {course.sid}
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               <strong>Teacher ID:</strong> {course.tid}
//             </Typography>
//             {/* Uncomment these lines if needed */}
//             {/* <Typography variant="body1" gutterBottom>
//               <strong>Timestamp:</strong> {new Date(course.ts).toLocaleString()}
//             </Typography> */}
//             {/* <Typography variant="body1">
//               <strong>Description:</strong> {course.cofstr}
//             </Typography> */}
//             <Box sx={{display:'flex',justifyContent:'space-around'}}>
//               <Button size="small"></Button>
//               <Button size="small">Assignment</Button>
//             </Box>

//             <Box >

//             </Box>

//           </CardContent>
          
//         </CardActionArea>
//       </Card>
//     </Grid>
//   ))
// ) : (
//   <Grid item>
//     <Card
//       sx={{
//         maxWidth: 600,
//         mx: 'auto',
//         boxShadow: 3,
//         borderRadius: 2,
//         transition: 'transform 0.2s',
//         '&:hover': {
//           transform: 'scale(1.02)',
//           boxShadow: 6,
//         },
//       }}
//     >
//       <CardActionArea>
//         <CardHeader
//           avatar={
//             <Avatar sx={{ bgcolor: 'primary.main' }}>
//               <SchoolIcon />
//             </Avatar>
//           }
//           title="No Data Found"
//           titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
//         />
//       </CardActionArea>
//     </Card>
//   </Grid>
// )}
// </Grid>



