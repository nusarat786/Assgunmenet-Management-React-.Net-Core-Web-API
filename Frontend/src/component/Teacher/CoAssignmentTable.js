import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  MaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import ExcelJS from 'exceljs';

const CoAssignmentTable = ({ data, reportfilename }) => {

  const columnHelper = createMRTColumnHelper();

  const columns = [
    columnHelper.accessor('studentId', { header: 'Student ID', size: 40 }),
    columnHelper.accessor('studentFirstName', { header: 'First Name', size: 120 }),
    columnHelper.accessor('studentSurname', { header: 'Surname', size: 120 }),
    columnHelper.accessor('email', { header: 'Email', size: 200 }),
    columnHelper.accessor('totalMarksObtained', { header: 'Total Marks Obtained' }),
    columnHelper.accessor('totalPossibleMarks', { header: 'Total Possible Marks' }),
    columnHelper.accessor('totalAssignmentsSubmitted', { header: 'Total Assignments Submitted' }),
    columnHelper.accessor('totalAssignments', { header: 'Total Assignments' }),
    columnHelper.accessor('percentageObtained', { header: 'Percentage Obtained' }),
    columnHelper.accessor('courseOfferedId', { header: 'Course Offered ID' }),
    columnHelper.accessor('courseName', { header: 'Course Name' }),
    columnHelper.accessor('yearName', { header: 'Year Name' }),
    columnHelper.accessor('semesterName', { header: 'Semester Name' }),
    columnHelper.accessor('subjectName', { header: 'Subject Name' }),
  ];

//   const handleExportData = async () => {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Students Report');

//     // Add header row
//     const headers = [
//       'Student ID', 'First Name', 'Surname', 'Email', 'Total Marks Obtained', 'Total Possible Marks',
//       'Total Assignments Submitted', 'Total Assignments', 'Percentage Obtained', 'Course Offered ID',
//       'Course Name', 'Year Name', 'Semester Name', 'Subject Name'
//     ];
//     worksheet.addRow(headers);

//     // Style the header row
//     const headerRow = worksheet.getRow(1);
//     headerRow.font = { bold: true };
//     headerRow.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFFF00' } // Yellow background color
//     };
//     headerRow.eachCell({ includeEmpty: true }, (cell) => {
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//       cell.alignment = { horizontal: 'center', vertical: 'middle' };
//     });

//     // Add data rows
//     data.forEach((item) => {
//       worksheet.addRow([
//         item.studentId ?? 'NA',
//         item.studentFirstName ?? 'NA',
//         item.studentSurname ?? 'NA',
//         item.email ?? 'NA',
//         item.totalMarksObtained ?? 'NA',
//         item.totalPossibleMarks ?? 'NA',
//         item.totalAssignmentsSubmitted ?? 'NA',
//         item.totalAssignments ?? 'NA',
//         item.percentageObtained ?? 'NA',
//         item.courseOfferedId ?? 'NA',
//         item.courseName ?? 'NA',
//         item.yearName ?? 'NA',
//         item.semesterName ?? 'NA',
//         item.subjectName ?? 'NA',
//       ]);
//     });

//     // Apply background color based on percentageObtained
//     worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
//       if (rowNumber === 1) return; // Skip header row

//       const percentage = row.getCell(9).value;
//       if (percentage < 40) {
//         row.eachCell({ includeEmpty: true }, (cell) => {
//           cell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FF0000' } // Red background color
//           };
//           cell.font = { color: { argb: 'FFFFFF' } }; // White font color for better contrast
//         });
//       }
//     });

//     // Auto size columns and center-align data
//     worksheet.columns.forEach((column) => {
//       const header = column.header ? column.header.toString() : '';
//       let maxLength = header.length + 2;

//       column.eachCell({ includeEmpty: true }, (cell) => {
//         if (cell.value) {
//           const cellLength = cell.value.toString().length + 2;
//           if (cellLength > maxLength) {
//             maxLength = cellLength;
//           }
//         }
//       });

//       column.width = maxLength;
//       column.alignment = { horizontal: 'center', vertical: 'middle' };
//     });

//     // Save the file
//     workbook.xlsx.writeBuffer().then((buffer) => {
//       const blob = new Blob([buffer], { type: 'application/octet-stream' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${reportfilename}.xlsx`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     });
//   };

const handleExportData = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Co Assignment Report');
  
    // Add header row
    const headers = [
      'Student ID', 'First Name', 'Surname', 'Email', 'Total Marks Obtained', 'Total Possible Marks',
      'Total Assignments Submitted', 'Total Assignments', 'Percentage Obtained', 'Course Offered ID',
      'Course Name', 'Year Name', 'Semester Name', 'Subject Name'
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
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  
    // Add data rows
    data.forEach((item) => {
      worksheet.addRow([
        item.studentId ?? 'NA',
        item.studentFirstName ?? 'NA',
        item.studentSurname ?? 'NA',
        item.email ?? 'NA',
        item.totalMarksObtained ?? 'NA',
        item.totalPossibleMarks ?? 'NA',
        item.totalAssignmentsSubmitted ?? 'NA',
        item.totalAssignments ?? 'NA',
        item.percentageObtained ?? 'NA',
        item.courseOfferedId ?? 'NA',
        item.courseName ?? 'NA',
        item.yearName ?? 'NA',
        item.semesterName ?? 'NA',
        item.subjectName ?? 'NA',
      ]);
    });
  
    // Apply background color based on percentageObtained
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
  
      const percentage = row.getCell(9).value;
      if (percentage < 40) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' } // Red background color
          };
          cell.font = { color: { argb: 'FFFFFF' } }; // White font color for better contrast
        });
      } else if (percentage >= 40) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5b9028' } // Green background color
          };
          cell.font = { color: { argb: 'FFFFFF' } }; // White font color for better contrast
        });
      }
  
      // Apply borders
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
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
      column.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  
    // Save the file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportfilename}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };
  
  return (
    <Box sx={{ marginY: '5rem' }}>
      <Button
        onClick={handleExportData}
        variant="contained"
        startIcon={<FileDownloadIcon />}
        sx={{ marginBottom: '1rem' }}
      >
        Export to Excel
      </Button>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowSelection
        enableSorting
        enablePagination
        enableColumnFilter
        enableColumnOrdering
      />
    </Box>
  );
};

export default CoAssignmentTable;
