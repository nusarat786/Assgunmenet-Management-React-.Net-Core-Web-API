import axios from 'axios'; // Import axios for making API requests
import { useEffect, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
  MenuItem
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BorderAll } from '@mui/icons-material';
import ErrorSnackbar from '../Helper/HandelError';
import {handleError ,handleClose,showAlertMessage,showSuccess} from '../Helper/GetError';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Autocomplete, TextField } from '@mui/material';



const Table = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [fetchedUsers, setFetchedUsers] = useState([]);

  const [courses, setCourses] = useState([]);
  const [sems, setSems] = useState([]);
  const [years, setYears] = useState([]);

  const [cyss, setCyss] = useState([]);
  const [teachers, setTeacheres] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [error, setError] = useState({
    open: false,
    statusCode: null,
    errorDetails: {},
  });
  const URL = `${process.env.REACT_APP_API_URL}/StudentAllEnrolment`

  const [students, setStudents] = useState([]);

        
const getAllEnrolment = async () =>{
    
    try {
      console.log(URL)
      const response = await axios.get(`${URL}`); // replace with actual API endpoint
      //console.log(response.data.data)
      setFetchedUsers(response.data.data)
      
    }catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  }
  
  const GetSubjects = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Subjects`);
      console.log(request.data.data);
      setSubjects(request.data.data);
       
    }catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  };

  const GetCyss = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Cys`);
      console.log(request.data.data);
      setCyss(request.data.data);
       
    }catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  };

  const GetTeacher = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`);
      console.log(request.data.data);
      setTeacheres(request.data.data);
       
    }catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  };

  const GetNameByCO = async (id) => {
    let str = ''
    try {
      
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Retrieval/getDetailsByCysId/${id}`);
      //const request = await axios.get(`${process.env.REACT_APP_API_URL}/Retrieval/getDetailsByCourseOfferId/${id}`);
      
      console.log(request.data.data);
      let data = request.data.data;
      
      // Construct the formatted string
      let formattedString = `${data.yearName} - ${data.courseName} - ${data.semesterName} - ${data.subjectName}`;

      console.log("Formatted String:", formattedString); // Output: 2024 - MCA - SEM-1 - c#
      str = formattedString
    }catch (error) {
      
    }finally{
      console.log(str)
      return str;
    }
  };


  const GetStudents = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Students`);
      console.log(request.data.data);
      setStudents(request.data.data);
       
    }catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  };
 
  



  

  

  useEffect(() => {
    GetCyss();
    GetStudents();
 
    //getCys();
  }, []); // Empty dependency array ensures this runs only once on component mount

//   var getCYSString = ()=>{
    
//     let course=  courses.filter((d) => d.cId === row.original.cId)
//     let coursename = course[0] ? course[0].cName :'N/A'

//     //console.log(years)
//     let year=  years.filter((d) => d.yearId === row.original.yearId)
//     let yearname = year[0] ? year[0].yearName :'N/A'

//     console.log(years)
//     let sem=  sems.filter((d) => d.semId === row.original.semId)
//     let semname = sem[0] ? sem[0].semName :'N/A'

//    //const externalData = getExternalData(row.original);  // Function to get external data
//    return <div>{coursename + " - " + semname + " - " + yearname }</div>;
 
//   }


  const convertDateToInputFormat = (row,dateString) => {

    const getTodayDate = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    //console.log('row',row.row.original);
    if (!dateString) return getTodayDate;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };


//   {
//     "cysId": 1,
//     "cId": 2,
//     "semId": 2,
//     "yearId": 5,
//     "ts": "2024-08-18T21:13:14.267"
//   },
  

function EditableCellWithSearch({ value, onChange, options }) {
    return (
      <Autocomplete
        disablePortal
        options={options}
        getOptionLabel={(option) => `${option.stId}: ${option.sSurname} ${option.sfirstName}`}
        sx={{ width: 300 }}
        value={options.find((opt) => opt.stId === value) || null}
        onChange={(event, newValue) => {
          onChange(newValue ? newValue.stId : '');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Student"
            variant="standard"
            required
            error={!!validationErrors?.stId}
            helperText={validationErrors?.stId}
          />
        )}
      />
    );
  }
  const CourseOffredColumn = useMemo(
    () => [
      {
        accessorKey: 'eiD',
        enableEditing: false,
        header: 'Enrolment ID',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 80,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 80,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },

      {
        accessorKey: 'cysstr',
        enableEditing: false,
        header: 'CYS Name',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },

      {
        accessorKey: 'name',
        enableEditing: false,
        header: 'Student Name',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },


      {
        accessorKey: 'stId',
        enableEditing: true,
        header: 'Student Id',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 80, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 80, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },

        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.stId,
          helperText: validationErrors?.stId,
          onFocus: () =>
            setValidationErrors((prev) => ({
              ...prev,
              tid: undefined,
            })),
            //Array.isArray(departments) &&
            children:  students.map((data) => (
              <MenuItem 
              key={data.stId} 
              value={data.stId}>
                  {data.stId + " : " + data.sSurname + " " + data.sfirstName }
              </MenuItem>
          )),
        },
      },


    // Usage inside your table column
        // {
        //     accessorKey: 'stId',
        //     enableEditing: true,
        //     header: 'Student Id',
        //     muiTableHeadCellProps: {
        //     sx: {
        //         maxWidth: 80,
        //         overflow: 'hidden',
        //         textOverflow: 'ellipsis',
        //         whiteSpace: 'nowrap',
        //     },
        //     },
        //     muiTableBodyCellProps: {
        //     sx: {
        //         maxWidth: 80,
        //         overflow: 'hidden',
        //         textOverflow: 'ellipsis',
        //         whiteSpace: 'nowrap',
        //     },
        //     },
        //     muiEditTextFieldProps: {
        //     required: true,
        //     error: !!validationErrors?.stId,
        //     helperText: validationErrors?.stId,
        //     render: (props) => (
        //         <EditableCellWithSearch
        //         {...props}
        //         options={students} // Pass your array of student objects here
        //         value={props.value}
        //         onChange={props.onChange}
        //         />
        //     ),
        //     },
        // },


      {
        accessorKey: 'cysId',
        enableEditing: true,
        header: 'Cys Id',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 80, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 80, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },

        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.cysId,
          helperText: validationErrors?.cysId,
          onFocus: () =>
            setValidationErrors((prev) => ({
              ...prev,
              cysId: undefined,
            })),
            //Array.isArray(departments) &&
            children:  cyss.map((data) => (
              <MenuItem 
              key={data.cysId} 
              value={data.cysId}>
                  {data.cysId + " : " + data.cysstr}
              </MenuItem>
          )),
        },
      },





    //   {
    //     accessorKey: 'ts',
    //     header: 'Timestamp',
    //     enableEditing: false,
    //     muiTableHeadCellProps: {
    //       sx: {
    //         maxWidth: 200,
    //         overflow: 'hidden',
    //         textOverflow: 'ellipsis',
    //         whiteSpace: 'nowrap',
    //       },
    //     },
    //     muiTableBodyCellProps: {
    //       sx: {
    //         maxWidth: 200,
    //         overflow: 'hidden',
    //         textOverflow: 'ellipsis',
    //         whiteSpace: 'nowrap',
    //       },
    //     },
    //     muiEditTextFieldProps: (row) => ({
    //       type: 'datetime-local',
    //       value: convertDateToInputFormat(row,row.row.original.ts),
    //       onChange: (event) => {
    //         const newDateTime = event.target.value;
    //         row.row.original.ts = newDateTime;
    //       },
    //       required: true,
    //       error: !!validationErrors?.ts,
    //       helperText: validationErrors?.ts,
    //       onFocus: () =>
    //         setValidationErrors({
    //           ...validationErrors,
    //           ts: undefined,
    //         }),
    //     }),
    //   },
      
            // External column
        // {
        //         header: 'Course Sem Year',
        //         id: 'Course Sem Year',  // Provide an ID for the column
        //         enableEditing: false,
        //         Cell: ({ row }) => {
                    
        //         // //   return  setTimeout(()=>{

        //         //    console.log(row.original)
        //         //    console.log(courses)
        //         //    let course=  courses.filter((d) => d.cId === row.original.cId)
        //         //    let coursename = course[0] ? course[0].cName :'N/A'

        //         //    //console.log(years)
        //         //    let year=  years.filter((d) => d.yearId === row.original.yearId)
        //         //    let yearname = year[0] ? year[0].yearName :'N/A'

        //         //    console.log(years)
        //         //    let sem=  sems.filter((d) => d.semId === row.original.semId)
        //         //    let semname = sem[0] ? sem[0].semName :'N/A'

        //           //const externalData = getExternalData(row.original);  // Function to get external data
        //           return <div>
        //             {/* {GetNameByCO(row.original.coId)}
        //            */}
        //           </div>;

        //             // },3000)
        //         },
        //         muiTableHeadCellProps: {
        //           sx: {
        //             maxWidth: 100,
        //             overflow: 'hidden',
        //             textOverflow: 'ellipsis',
        //             whiteSpace: 'nowrap',
        //           },
        //         },
        //         muiTableBodyCellProps: {
        //           sx: {
        //             maxWidth: 100,
        //             overflow: 'hidden',
        //             textOverflow: 'ellipsis',
        //             whiteSpace: 'nowrap',
                    
        //           },
        //         },
        //         muiEditTextFieldProps: (row) => ({
        //             type: 'text',
        //             value: "Hei",
        //             required: false,
        //             error: !!validationErrors?.ts,
        //             helperText: validationErrors?.ts,
        //             onFocus: () =>
        //               setValidationErrors({
        //                 ...validationErrors,
        //                 ts: undefined,
        //               }),
        //           }),
        //       },
    ],
    [validationErrors]
  );
  
//   {
//     "cysId": 2,
//     "cId": 2,
//     "semId": 4,
//     "yearId": 6,
//     "ts": "2024-08-18T21:13:14.267"
// }
  
  //const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  var {
    //data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers(setFetchedUsers);
  //var isUpdatingUser = false
  //const { mutateAsync: updateUser, isPending: isUpdatingUser } = null;
  // const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateYear(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    
    console.log(values)
    //values.password="string"
    values.eiD="0"
    //values.ts=getISTTimeString();
    try {
      const response = await axios.post(
        `${URL}`,
        values,
        {
          withCredentials: true, // Include credentials (cookies) with the request
        }
      );
      
      console.log(response.data)
      
      getAllEnrolment();
      table.setCreatingRow(null);
      return showSuccess(response?.data,response?.status); // Adjust as needed for response structure
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      showAlertMessage(statusCode,errorDetails)
    }finally{

      
    }  

    
  };

  const handleSaveUser = async ({ values, table }) => {
    console.log(values);
    //isUpdatingUser=true;
    const newValidationErrors = validateYear(values);
    console.log(newValidationErrors)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    
    values.ts=getISTTimeString();

    try {
      const response = await axios.patch(
        `${URL}/${values.eiD}`,
        values,
        {
          withCredentials: true, // Include credentials (cookies) with the request
        }
      );
      table.setEditingRow(null);
      console.log(response.data)
      return showSuccess(response?.data,response?.status); // Adjust as needed for response structure
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      showAlertMessage(statusCode,errorDetails)
    }finally{
      //table.setEditingRow(null);
    }  
  };

  const openDeleteConfirmModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      console.log(row?.id);
      console.log(fetchedUsers)
      try {
        const response = await axios.delete(
          `${URL}/${row.original.eiD}`,
          {
            withCredentials: true, // Include credentials (cookies) with the request
          }
        );
        
        
        setFetchedUsers(fetchedUsers.filter((d) => d.eiD !== row.original.eiD));

        //   // Set the row to display: none using its unique id
        // const rowElement = document.getElementById(row?.id);
        // if (rowElement) {
        //   rowElement.style.display = 'none';
        // }
        return showSuccess(response?.data,response?.status); // Adjust as needed for response structure
      } catch (error) {
        const { statusCode, errorDetails } = handleError(error);
        setError({ open: true, statusCode, errorDetails });
        
        //return alert(statusCode);
        return showAlertMessage(statusCode,errorDetails)
      }finally{
        table.setEditingRow(null);
      } 
    }
  };

  
const table = useMaterialReactTable({
    columns:CourseOffredColumn,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) =>{
      //console.log(row)
      return row.tid
    },

    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    
    muiTableContainerProps: {
      sx: {
        minHeight: '400px',
        width:'100%',
        //position: 'relative',
        boxShadow: 'none', // Removes shadow

        border: 'none',
        //marginTop:'3rem',
        marginTop:{
          xs: '4rem',  
          sm: '4rem',
        },
        
      
        position:'absolute',
        // width: {
        //     xs: '90vw',  // 90% of the viewport width for extra-small devices (like mobile)
        //     sm: '90vw',  // 80% of the viewport width for small devices (like tablets)
        //     md: '70vw',  // 70% of the viewport width for medium and up devices (like laptops and desktops)
            
        // },
        marginLeft:{
            xs:'auto',
            sm:'auto',
            md:'auto',
        }
      },
      

      

    },
  
    muiTableBodyRowProps: ({ row }) => ({
        onMouseEnter: () => {
          // Set some state or perform actions on mouse enter if needed
        },
        onMouseLeave: () => {
          // Reset state or perform actions on mouse leave if needed
        },
        sx: {
          position: 'relative',
          '&:hover': {
            backgroundColor: '#f5f5f5', // Change row background color on hover
          },
        },
         //title:'info: ' +getToolTip(row)
        
      }),
    
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Add Enrolment</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Enrolment</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
    <>
        <Button
            variant="text"
            onClick={() => {
            table.setCreatingRow(true); //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            // table.setCreatingRow(
            //   createRow(table, {
            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //   }),
            // );
            }}
        >
            <AddBoxIcon/>
        </Button>

        {/* <Button
            variant="text"
            onClick={() => {
                table.setCreatingRow(true);
                
                table.setCreatingRow(false);
                

            //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            // table.setCreatingRow(
            //   createRow(table, {
            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //   }),
            // );
            }}
        >
            <AddBoxIcon/>
        </Button> */}
    </>
    ),
    state: {
      isLoading: isLoadingUsers,
      //isSaving: isCreatingUser ||  isDeletingUser, //|| isUpdatingUser,
      // 
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
    muiTopToolbarProps: {
      sx: {
        boxShadow: 'none', // Removes shadow

      },
    },
    muiTablePaginationProps: {
      sx: {
        boxShadow: 'none', // Removes shadow
      },
    },
  });

  return(
  <> 
    <MaterialReactTable table={table} /> 
  </>
  );
};


// READ hook (get users from API)
function useGetUsers(setFetchedUsers) {
  console.log("useGetUsers",Date.now().toLocaleString())

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/StudentAllEnrolment`); // replace with actual API endpoint
      setFetchedUsers(response.data.data)
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    refetchOnWindowFocus: false,
  });
}



  
const validateYear = (c) => {
    const errors = {};
  
    // Check for required fields
    if (!c.stId) errors.stId = 'Student id is required';
    if (!c.cysId) errors.cysId = 'CYS id is required';
    //if (!sem.ts) errors.ts = 'Timestamp is required';
    // Return errors
    return errors;
  };
  
  function getISTTimeString() {
    const date = new Date();
    
    // Create an Intl.DateTimeFormat object for IST (Asia/Kolkata)
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
      hour12: false,  // 24-hour format
      fractionalSecondDigits: 2
    };
    
    // Format the date to IST
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const [
      { value: day },,
      { value: month },,
      { value: year },,
      { value: hour },,
      { value: minute },,
      { value: second }
    ] = formatter.formatToParts(date);
    
    // Get the milliseconds as two digits
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
  
    // Construct the final date-time string in the required format
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}`;
  }
  
const queryClient = new QueryClient();

const EnrolmentTable = () => (
  <QueryClientProvider client={queryClient}>
    {/* <Box sx={{ width: '90%', marginLeft:"1.5rem"}  }>     */}
        <Table />
    {/* </Box> */}
  </QueryClientProvider>
);

export default EnrolmentTable;