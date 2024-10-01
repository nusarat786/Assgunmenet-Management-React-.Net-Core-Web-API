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



const Table = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [fetchedUsers, setFetchedUsers] = useState([]);

  const [error, setError] = useState({
    open: false,
    statusCode: null,
    errorDetails: {},
  });
  const URL = `${process.env.REACT_APP_API_URL}/Students`

  const getTeacher = async () =>{
    
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
  
//   const GetDepartments = async () => {
//     try {
//       const request = await axios.get(`${process.env.REACT_APP_API_URL}/Departments`);
//       console.log(request.data.data);
//       setDepartments(request.data.data);
      
//       //const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`); // replace with actual API endpoint
//       //setFetchedUsers(response.data.data)
      
//     }catch (error) {
//       const { statusCode, errorDetails } = handleError(error);
//       setError({ open: true, statusCode, errorDetails });
      
//       //return alert(statusCode);
//       return showAlertMessage(statusCode,errorDetails)
//     }
//   };


  useEffect(() => {
    //GetDepartments();
    //getTeacher();
  }, []); // Empty dependency array ensures this runs only once on component mount

  


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



  const studentColumns = useMemo(
    () => [
      {
        accessorKey: 'stId',
        enableEditing: false,
        header: 'ID',
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
        accessorKey: 'sfirstName',
        header: 'First Name',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.sfirstName,
          helperText: validationErrors?.sfirstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              sfirstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'sSurname',
        header: 'Surname',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.sSurname,
          helperText: validationErrors?.sSurname,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              sSurname: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
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
        muiEditTextFieldProps: {
          type: 'tel',
          required: true,
          error: !!validationErrors?.phone,
          helperText: validationErrors?.phone,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              phone: undefined,
            }),
        },
      },
      {
        accessorKey: 'dob',
        header: 'DOB',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: (row) => ({
          type: 'date',
          value:convertDateToInputFormat(row,row.row.original.dob),
          //value: convertDateToInputFormat(),
          onChange: (event) => {
            const newDate = event.target.value;
            row.row.original.dob = newDate;
          },
          required: true,
          error: !!validationErrors?.dob,
          helperText: validationErrors?.dob,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              dob: undefined,
            }),
        }),
      },
      // Additional columns can be added similarly
    ],
    [validationErrors]
  );
  
  
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
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    
    console.log(values)
    values.password="string"
    values.stId="0"
    try {
      const response = await axios.post(
        `${URL}`,
        values,
        {
          withCredentials: true, // Include credentials (cookies) with the request
        }
      );
      
      console.log(response.data)
      
      getTeacher();
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
    const newValidationErrors = validateUser(values);
    console.log(newValidationErrors)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    values.password="string"
    try {
      const response = await axios.patch(
        `${URL}/${values.stId}`,
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log(row?.id);
      console.log(fetchedUsers)
      try {
        const response = await axios.delete(
          `${URL}/${row.original.stId}`,
          {
            withCredentials: true, // Include credentials (cookies) with the request
          }
        );
        
        
        setFetchedUsers(fetchedUsers.filter((d) => d.stId !== row.original.stId));

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
    columns:studentColumns,
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
  
    
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Add Student</DialogTitle>
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
        <DialogTitle variant="h3">Edit Student</DialogTitle>
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Students`); // replace with actual API endpoint
      setFetchedUsers(response.data.data)
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    refetchOnWindowFocus: false,
  });
}


const validateUser = (student) => {
    const errors = {};
  
    // Check for required fields
    if (!student.sfirstName) errors.sfirstName = 'First name is required';
    if (!student.sSurname) errors.sSurname = 'Surname is required';
    if (!student.email) errors.email = 'Email is required';
    if (!student.phone) errors.phone = 'Phone number is required';
    if (!student.dob) errors.dob = 'Date of birth is required';
   // if (!student.departmentId) errors.departmentId = 'Department is required';
  
    // First name validation
    if (student.sfirstName) {
      if (student.sfirstName.length < 3) {
        errors.sfirstName = 'First name must be at least 3 characters long';
      }
      if (/\d/.test(student.sfirstName)) {
        errors.sfirstName = 'First name cannot contain numbers';
      }
    }
  
    // Surname validation
    if (student.sSurname) {
      if (student.sSurname.length < 3) {
        errors.sSurname = 'Surname must be at least 3 characters long';
      }
      if (/\d/.test(student.sSurname)) {
        errors.sSurname = 'Surname cannot contain numbers';
      }
    }
  
    // Email validation
    if (student.email && !/\S+@\S+\.\S+/.test(student.email)) {
      errors.email = 'Email is not valid';
    }
  
    // Phone number validation
    if (student.phone && !/^\d{10}$/.test(student.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits and numbers only';
    }
  
    // Date validation
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const dob = new Date(student.dob);
  
    if (student.dob && dob > new Date(today)) {
      errors.dob = 'Date of birth cannot be in the future';
    }
  
    // Return errors
    return errors;
  };
  


const queryClient = new QueryClient();

const StudentTable = () => (
  <QueryClientProvider client={queryClient}>
    {/* <Box sx={{ width: '90%', marginLeft:"1.5rem"}  }>     */}
        <Table />
    {/* </Box> */}
  </QueryClientProvider>
);

export default StudentTable;