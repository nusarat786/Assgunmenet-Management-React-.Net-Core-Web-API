import React from 'react';
import { Box, Button, Typography,Select,MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import ExcelJS from 'exceljs';

const data = [
  {
    studentId: 8,
    studentFirstName: "DGFDFG",
    studentSurname: "DFGDFG",
    email: "nusarathaveliwala1@gmail.com",
    submitted: "Yes",
    obtainedMarks: 24.5,
    totalMarks: 35,
    assignmentId: 2073,
    isCoding: false,
    assignmentQuestionFile: "https://firebasestorage.googleapis.com/v0/b/fir-e1409.appspot.com/o/No%20Code%20Test%20UPdate_fb57c052-56bc-4205-9c13-8d853f79c3a2_27.pdf?alt=media",
    submissionId: 1023,
    answerFile: "https://firebasestorage.googleapis.com/v0/b/fir-e1409.appspot.com/o/No%20Code%20Test%20UPdate_60a79e04-793a-48b0-a153-c840838ea1dd_27.pdf?alt=media",
    assignmentCheckNote: null,
    submittedTimestamp: "2024-09-16T21:52:48.193",
    deadlinePassed: "No",
    courseName: "MCA",
    yearName: "2020",
    semesterName: "SEM-2",
    subjectName: "c#"
  },
  {
    studentId: 9,
    studentFirstName: "test",
    studentSurname: "test",
    email: "test@gmail.com",
    submitted: "No",
    obtainedMarks: null,
    totalMarks: 35,
    assignmentId: 2073,
    isCoding: false,
    assignmentQuestionFile: null,
    submissionId: null,
    answerFile: null,
    assignmentCheckNote: null,
    submittedTimestamp: null,
    deadlinePassed: "No",
    courseName: "MCA",
    yearName: "2020",
    semesterName: "SEM-2",
    subjectName: "c#"
  },
  // Add more student objects as needed
];

const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('studentId', { header: 'Student ID', size: 40 }),
  columnHelper.accessor('studentFirstName', { header: 'First Name', size: 120 }),
  columnHelper.accessor('studentSurname', { header: 'Surname', size: 120 }),
  columnHelper.accessor('email', { header: 'Email', size: 200 }),
  columnHelper.accessor('submitted', {
    header: 'Submitted',
    filterFn: 'equals', // Use 'equals' as filter function
    Filter: ({ column }) => (
      <Select
        value={column.getFilterValue() || ''}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        displayEmpty
        fullWidth
        size="small"  // This makes the Select smaller
        sx={{ minWidth: 80 }}  // Adjust the width as needed
      >
        <MenuItem value=''>All</MenuItem>
        <MenuItem value='Yes'>Yes</MenuItem>
        <MenuItem value='No'>No</MenuItem>
      </Select>
    ),
    size: 100,
  }),
  columnHelper.accessor('obtainedMarks', { header: 'Obtained Marks' }),
  columnHelper.accessor('totalMarks', { header: 'Total Marks' }),
  columnHelper.accessor('assignmentId', { header: 'Assignment ID' }),
  columnHelper.accessor('isCoding', { header: 'Is Coding?' }),
  columnHelper.accessor('submissionId', { header: 'Submission ID' }),
  columnHelper.accessor('submittedTimestamp', { header: 'Submitted Timestamp' }),
  columnHelper.accessor('deadlinePassed', { header: 'Deadline Passed' }),
  columnHelper.accessor('courseName', { header: 'Course Name' }),
  columnHelper.accessor('yearName', { header: 'Year Name' }),
  columnHelper.accessor('semesterName', { header: 'Semester Name' }),
  columnHelper.accessor('subjectName', { header: 'Subject Name' }),
  columnHelper.accessor('assignmentQuestionFile', {
    header: 'Assignment Question File',
    Cell: ({ cell }) => {
      const link = cell.getValue();
      return (
        <Typography>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              Open Link
            </a>
          ) : (
            'NA'
          )}
        </Typography>
      );
    },
  }),
  columnHelper.accessor('answerFile', {
    header: 'Answer File',
    Cell: ({ cell }) => {
      const link = cell.getValue();
      return (
        <Typography>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              Open Link
            </a>
          ) : (
            'NA'
          )}
        </Typography>
      );
    },
  }),
];

// Function to randomly assign row colors
const getRandomColor = () => {
  const colors = ['#FFCCCC', '#CCFFCC', '#CCCCFF', '#FFCC99', '#FFFF99'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const handleExportData = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Students Report');

  // Add header row
  const headers = [
    'Student ID', 'First Name', 'Surname', 'Email', 'Submitted', 'Obtained Marks',
    'Total Marks', 'Assignment ID', 'Is Coding?', 'Submission ID', 'Submitted Timestamp',
    'Deadline Passed', 'Course Name', 'Year Name', 'Semester Name', 'Subject Name',
    'Assignment Question File', 'Answer File'
  ];
  worksheet.addRow(headers);

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFF00' } // Yellow background color
  };

  // Add data rows
  data.forEach((item) => {
    worksheet.addRow([
      item.studentId ?? 'NA',
      item.studentFirstName ?? 'NA',
      item.studentSurname ?? 'NA',
      item.email ?? 'NA',
      item.submitted ?? 'NA',
      item.obtainedMarks ?? 'NA',
      item.totalMarks ?? 'NA',
      item.assignmentId ?? 'NA',
      item.isCoding !== undefined ? item.isCoding.toString() : 'NA',
      item.submissionId ?? 'NA',
      item.submittedTimestamp ?? 'NA',
      item.deadlinePassed ?? 'NA',
      item.courseName ?? 'NA',
      item.yearName ?? 'NA',
      item.semesterName ?? 'NA',
      item.subjectName ?? 'NA',
      item.assignmentQuestionFile ? { text: 'Open Link', hyperlink: item.assignmentQuestionFile } : 'NA',
      item.answerFile ? { text: 'Open Link', hyperlink: item.answerFile } : 'NA',
    ]);
  });

  // Auto size columns and center-align data
  worksheet.columns.forEach((column) => {
    const header = column.header ? column.header.toString() : '';
    let maxLength = header.length + 2;

    column.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value) {
        const cellLength = cell.value.toString().length + 2;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      }
    });

    column.width = maxLength;
  });

  // Save the file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_report.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  });
};

const ASSREPORTTable = () => {
  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
        pagination: {
          pageSize: 100,  // Set default number of rows per page to 100
        },
      },
    enableRowSelection: true,
    getRowProps: () => ({
      sx: {
        backgroundColor: getRandomColor(),
      },
    }),
    
  });

  return (
    <Box>
      <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
        Export Data to Excel
      </Button>
      <MaterialReactTable table={table} />
    </Box>
  );
};

const TestCard2 = () => {
  return (
    <Box sx={{ marginY: '5rem' }}>
      <ASSREPORTTable />
    </Box>
  );
};

export default TestCard2;
