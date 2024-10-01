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
  
  const getTeacher = async () =>{
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`); // replace with actual API endpoint
      //console.log(response.data.data)
      setFetchedUsers(response.data.data)
    }catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  }
  
  const GetDepartments = async () => {
    try {
      const request = await axios.get(`${process.env.REACT_APP_API_URL}/Departments`);
      console.log(request.data.data);
      setDepartments(request.data.data);
      
      //const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`); // replace with actual API endpoint
      //setFetchedUsers(response.data.data)
      
    }catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      
      //return alert(statusCode);
      return showAlertMessage(statusCode,errorDetails)
    }
  };


  useEffect(() => {
    GetDepartments();
    getTeacher();
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



  const columns = useMemo(
    () => [
      {
        accessorKey: 'tid',
        enableEditing: false,
        header: 'ID',
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
      },
      {
        accessorKey: 'tfname',
        header: 'First Name',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 100, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 100, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.tfname,
          helperText: validationErrors?.tfname,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              tfname: undefined,
            }),
        },
      },
      {
        accessorKey: 'tsname',
        header: 'Surname',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 100, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 100, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.tsname,
          helperText: validationErrors?.tsname,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'temail',
        header: 'Email',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 150, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 150, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.temail,
          helperText: validationErrors?.temail,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'tphone',
        header: 'Phone',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 120, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 120, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiEditTextFieldProps: {
          type: 'phone',
          required: true,
          error: !!validationErrors?.tphone,
          helperText: validationErrors?.tphone,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              tphone: undefined,
            }),
        },
      },
      {
        accessorKey: 'tdob',
        header: 'DOB',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 150, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 150, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        // muiEditTextFieldProps: {
        //   type: 'date',
        //   required: true,
        //   error: !!validationErrors?.tdob,
        //   helperText: validationErrors?.tdob,
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       tdob: undefined,
        //     }),
        // },
        muiEditTextFieldProps: (row) => ({
          //component: <Box>{console.log(row)} </Box>,
          type: 'date',
          
          //value: '2002-02-10',
          value:convertDateToInputFormat(row,row.row.original.tdob),
          onChange: (event) => {
            // Handle the change event
            const newDate = event.target.value;          
            row.row.original.tdob=newDate;
            //console.log(newDate,row.row.original.tdob)
            // Update your state or call your method to handle the new date
            // Example: updateRowData(row.id, { tjoiningDate: newDate });
          },
          required: true,
          error: !!validationErrors?.tdob,
          helperText: validationErrors?.tdob,
          
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              tjoiningDate: undefined,
            }),
        })
      },
      {
        accessorKey: 'tjoiningDate',
        header: 'Joining Date',
        muiTableHeadCellProps: {
          sx: {
            maxWidth: 150, // Set max width for header cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            maxWidth: 150, // Set max width for body cells
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        // muiEditTextFieldProps: {
        //   type: 'date',
        //   required: true,
        //   value: () => {
        //     // Print the cell object to the console
        //     ///console.log('Cell object:', cell);
      
        //     // Access and format the date
        //     //const dateValue = cell.row.original.tjoiningDate;
        //     //console.log('Raw date value:', dateValue);
      
        //     return '2021-02-02';
        //   },
        //   error: !!validationErrors?.tjoiningDate,
        //   helperText: validationErrors?.tjoiningDate,
        //   value:( row ) =>{ return convertDateToInputFormat(row.tjoiningDate || '2002-02-10')

        //   },
          
        //   //defaultValue:'02-10-2002',  //row => row.tjoiningDate ? row.tjoiningDate.split('T')[0] : '', // Split the string to get the date part only
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       tjoiningDate: undefined,
        //     }),
        // },
        muiEditTextFieldProps: (row) => ({
          //component: <Box>{console.log(row)} </Box>,
          type: 'date',
          placeholder: 'Select a date',  // Add your placeholder text here

          //value: '2002-02-10',
          
          value:convertDateToInputFormat(row,row.row.original.tjoiningDate),
          onChange: (event) => {
            // Handle the change event
            const newDate = event.target.value;          
            row.row.original.tjoiningDate=newDate;
            //console.log(newDate,row.row.original.tjoiningDate)
            // Update your state or call your method to handle the new date
            // Example: updateRowData(row.id, { tjoiningDate: newDate });
          },
          required: true,
          error: !!validationErrors?.tjoiningDate,
          helperText: validationErrors?.tjoiningDate,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              tjoiningDate: undefined,
            }),
        })
      },
      // Add other columns similarly
      {
        accessorKey: 'departmentId',
        enableEditing: true,
        header: 'Department Id',
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
          error: !!validationErrors?.departmentId,
          helperText: validationErrors?.departmentId,
          onFocus: () =>
            setValidationErrors((prev) => ({
              ...prev,
              departmentId: undefined,
            })),
            //Array.isArray(departments) &&
            children:  departments.map((dept) => (
              <MenuItem 
              key={dept.departmentId} 
              value={dept.departmentId}>
                  {dept.departmentName + " : " + dept.departmentId}
              </MenuItem>
          )),
        },
      },
      
    ],
    [validationErrors]
  );
  
  //const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  var {
    //data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
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
    values.Tpassword="string"
    values.tid="0"
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Teachers`,
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
    values.Tpassword="string"
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/Teachers/${values.tid}`,
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
          `${process.env.REACT_APP_API_URL}/Teachers/${row.original.tid}`,
          {
            withCredentials: true, // Include credentials (cookies) with the request
          }
        );
        
        
        setFetchedUsers(fetchedUsers.filter((d) => d.tid !== row.original.tid));

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
    columns,
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
        <DialogTitle variant="h3">Add Teacher</DialogTitle>
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
        <DialogTitle variant="h3">Edit Teacher</DialogTitle>
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


//   // UPDATE hook (put user in API)
// function useUpdateUser() {
//   console.log("test")

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       user.Tpassword ='str'
//       console.log('user',user);
      
//       try{
//         const response = await axios.patch(`${process.env.REACT_APP_API_URL}/Teachers/${user.tid}`, user,
//           {
//             withCredentials: true, // Include credentials (cookies) with the request
//           }
//         );
//         return response.data.data; // Adjusted to get the data from response.data.data
    
//       }catch(error){
//         const { statusCode, errorDetails } = handleError(error);
//         setError({ open: true, statusCode, errorDetails });
//       }
//        // replace with actual API endpoint  
//     },
//     // onMutate: (newUserInfo) => {
//     //   console.log('New User Info:', newUserInfo);

//     //   queryClient.setQueryData(['users'], (prevUsers) =>
        
//     //     prevUsers?.map((prevUser) =>
//     //       prevUser.tid === newUserInfo.tid ? newUserInfo : prevUser,
//     //     ),
//     //   );
//     // },
//     onSettled: () => {
//       // Invalidate and refetch the users query to get the updated data
//       queryClient.invalidateQueries(['users']);
//     },
//   });
// }

// function useUpdateUser(values) {
//   console.log("test");

//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (user) => {
//       user.Tpassword = 'str'; // Ensure this is intended
      
//       console.log('user', user);

//       try {
//         const response = await axios.patch(
//           `${process.env.REACT_APP_API_URL}/Teachers/${user.tid}`,
//           user,
//           {
//             withCredentials: true, // Include credentials (cookies) with the request
//           }
//         );
//         return response.data.data; // Adjust as needed for response structure
//       } catch (error) {
//         const { statusCode, errorDetails } = handleError(error);
//         // Handle error (e.g., show notification or set state)
//         throw new Error(`Error: ${statusCode} - ${errorDetails}`); // Rethrow or handle the error
//       }
//     },
//     onError: (error) => {
//       console.error('Mutation error:', error);
//       // Optionally, handle errors or show notifications
//     },
//     onSettled: () => {
//       // Invalidate and refetch the users query to get the updated data
//       queryClient.invalidateQueries(['users']);
//     },
//   });
// }

// async function Update(values) {
//   console.log(values);

  

  
// }

  
  return(
  <> 
  {/* Error Snackbar */}
        {/* <ErrorSnackbar
        open={error.open}
        //handleClose={handleClose}
        statusCode={error.statusCode}
        errorDetails={error.errorDetails}
      /> */}

      {/* <ErrorSnackbar statusCode={500} errorDetails={null} open={true}/> */}

  <MaterialReactTable table={table} /> 
  
  </>);
};

// // CREATE hook (post new user to API)
// function useCreateUser() {
//   console.log("test")
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       try{
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/Teachers`, user); // replace with actual API endpoint
//         return response.data.data; // Adjusted to get the data from response.data.data
//       }catch(err){

//       }
//     },
//     onMutate: (newUserInfo) => {
//       queryClient.setQueryData(['users'], (prevUsers) => [
//         ...prevUsers,
//         {
//           ...newUserInfo,
//           id: (Math.random() + 1).toString(36).substring(7),
//         },
//       ]);
//     },
//   });
// }

// READ hook (get users from API)
function useGetUsers() {
  console.log("test",Date.now().toLocaleString())

  //useGetDepartments();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`); // replace with actual API endpoint
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    refetchOnWindowFocus: false,
  });
}



// // UPDATE hook (put user in API)
// function useUpdateUser() {
//   console.log("test")

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       user.Tpassword ='str'
//       console.log('user',user);
//       const response = await axios.patch(`${process.env.REACT_APP_API_URL}/Teachers/${user.tid}`, user,
//         {
//           withCredentials: true, // Include credentials (cookies) with the request
//         }
//       ); // replace with actual API endpoint
      
//       return response.data.data; // Adjusted to get the data from response.data.data
    
//     },
//     onMutate: (newUserInfo) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.map((prevUser) =>
//           prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
//         ),
//       );
//     },
//   });
// }

// // DELETE hook (delete user in API)
// function useDeleteUser() {
//   console.log("test")

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (userId) => {
//       await axios.delete(`/api/users/${userId}`); // replace with actual API endpoint
//     },
//     onMutate: (userId) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.filter((user) => user.id !== userId),
//       );
//     },
//   });
// }

const queryClient = new QueryClient();

const TeacherTable = () => (
  <QueryClientProvider client={queryClient}>
    {/* <Box sx={{ width: '90%', marginLeft:"1.5rem"}  }>     */}
        <Table />
    {/* </Box> */}
  </QueryClientProvider>
);

export default TeacherTable;

const validateRequired = (value) => {
  return !value
};
const validateEmail = (email) =>
  !!email?.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/,
    );


// const validateUser = (user) => {
//   return {
//     temail: validateEmail(user.temail) ? '' : 'Invalid Email',
//     tfname: validateRequired(user.tfname) ? '' : 'Required',
//     tsname: validateRequired(user.tsname) ? '' : 'Required',
//     tphone:user.tphone ? '' : "Required"
//   };
// };

const validateUser = (user) => {
  const errors = {};

  // Check for required fields
  if (!user.tfname) errors.tfname = 'First name is required';
  if (!user.tsname) errors.tsname = 'Surname is required';
  if (!user.temail) errors.temail = 'Email is required';
  if (!user.tphone) errors.tphone = 'Phone number is required';
  if (!user.tdob) errors.tdob = 'Date of birth is required';
  if (!user.tjoiningDate) errors.tjoiningDate = 'Joining date is required';
  if (!user.departmentId) errors.departmentId = 'Department is required';

  // First name validation
  if (user.tfname) {
    if (user.tfname.length < 3) {
      errors.tfname = 'First name must be at least 3 characters long';
    }
    if (/\d/.test(user.tfname)) {
      errors.tfname = 'First name cannot contain numbers';
    }
  }

  // Surname validation
  if (user.tsname) {
    if (user.tsname.length < 3) {
      errors.tsname = 'Surname must be at least 3 characters long';
    }
    if (/\d/.test(user.tsname)) {
      errors.tsname = 'Surname cannot contain numbers';
    }
  }
  // Email validation
  if (user.temail && !/\S+@\S+\.\S+/.test(user.temail)) {
    errors.temail = 'Email is not valid';
  }

  // Phone number validation
  if (user.tphone && !/^\d{10}$/.test(user.tphone)) {
      errors.tphone = 'Phone number must be exactly 10 digits and numbers only';
  }

  // Date validation
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const dob = new Date(user.tdob);
  const joiningDate = new Date(user.tjoiningDate);

  if (user.tdob && joiningDate < dob) {
    errors.tjoiningDate = 'Joining date cannot be earlier than date of birth';
  }

  if (user.tjoiningDate && joiningDate > new Date(today)) {
    errors.tjoiningDate = 'Joining date cannot be later than today';
  }

  // Return errors
  return errors;
};




