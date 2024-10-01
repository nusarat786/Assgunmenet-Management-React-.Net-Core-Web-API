// import axios from 'axios'; // Import axios for making API requests
// import { useMemo, useState } from 'react';
// import {
//   MRT_EditActionButtons,
//   MaterialReactTable,
//   useMaterialReactTable,
// } from 'material-react-table';
// import {
//   Box,
//   Button,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Tooltip,
//   TextField,
//   MenuItem,
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
// import {
//   QueryClient,
//   QueryClientProvider,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// const Table = () => {
//   const [validationErrors, setValidationErrors] = useState({});
//   const  departments  = useGetDepartments(); // Fetch departments

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'tid',
//         enableEditing: false,
//         header: 'ID',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 80,
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 80,
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//       },
//       {
//         accessorKey: 'tfname',
//         header: 'First Name',
//         muiEditTextFieldProps: {
//           required: true,
//           error: !!validationErrors?.tfname,
//           helperText: validationErrors?.tfname,
//           onFocus: () =>
//             setValidationErrors((prev) => ({ ...prev, tfname: undefined })),
//         },
//       },
//       {
//         accessorKey: 'tsname',
//         header: 'Surname',
//         muiEditTextFieldProps: {
//           required: true,
//           error: !!validationErrors?.tsname,
//           helperText: validationErrors?.tsname,
//           onFocus: () =>
//             setValidationErrors((prev) => ({ ...prev, tsname: undefined })),
//         },
//       },
//       {
//         accessorKey: 'temail',
//         header: 'Email',
//         muiEditTextFieldProps: {
//           type: 'email',
//           required: true,
//           error: !!validationErrors?.temail,
//           helperText: validationErrors?.temail,
//           onFocus: () =>
//             setValidationErrors((prev) => ({ ...prev, temail: undefined })),
//         },
//       },
//       {
//         accessorKey: 'tphone',
//         header: 'Phone',
//         muiEditTextFieldProps: {
//           required: true,
//           error: !!validationErrors?.tphone,
//           helperText: validationErrors?.tphone,
//           onFocus: () =>
//             setValidationErrors((prev) => ({ ...prev, tphone: undefined })),
//         },
//       },
//       {
//         accessorKey: 'tdob',
//         header: 'DOB',
//         Cell: ({ cell }) => (
//           <TextField
//             type="date"
//             value={cell.getValue()}
//             onChange={(e) => cell.setValue(e.target.value)}
//             required
//             error={!!validationErrors?.tdob}
//             helperText={validationErrors?.tdob}
//           />
//         ),
//         muiEditTextFieldProps: {
//           required: true,
//           type: 'date',
//           error: !!validationErrors?.tdob,
//           helperText: validationErrors?.tdob,
//           onFocus: () =>
//             setValidationErrors((prev) => ({ ...prev, tdob: undefined })),
//         },
//       },
//       {
//         accessorKey: 'tjoiningDate',
//         header: 'Joining Date',
//         Cell: ({ cell }) => (
//           <TextField
//             type="date"
//             value={cell.getValue()}
//             onChange={(e) => cell.setValue(e.target.value)}
//             required
//             error={!!validationErrors?.tjoiningDate}
//             helperText={validationErrors?.tjoiningDate}
//           />
//         ),
//         muiEditTextFieldProps: {
//           required: true,
//           type: 'date',
//           error: !!validationErrors?.tjoiningDate,
//           helperText: validationErrors?.tjoiningDate,
//           onFocus: () =>
//             setValidationErrors((prev) => ({
//               ...prev,
//               tjoiningDate: undefined,
//             })),
//         },
//       },
//       {
//         accessorKey: 'departmentId',
//         header: 'Department',
//         Cell: ({ cell }) => (
//           <TextField
//             select
//             value={cell.getValue()}
//             onChange={(e) => cell.setValue(e.target.value)}
//             required
//             error={!!validationErrors?.departmentId}
//             helperText={validationErrors?.departmentId}
//           >
//             {departments?.map((dept) => (
//               <MenuItem key={dept.id} value={dept.id}>
//                 {dept.name}
//               </MenuItem>
//             ))}
//           </TextField>
//         ),
//         muiEditTextFieldProps: {
//           required: true,
//           select: true,
//           error: !!validationErrors?.departmentId,
//           helperText: validationErrors?.departmentId,
//           onFocus: () =>
//             setValidationErrors((prev) => ({
//               ...prev,
//               departmentId: undefined,
//             })),
//           children: departments.map((dept) => (
//             <MenuItem key={dept.id} value={dept.id}>
//               {dept.name}
//             </MenuItem>
//           )),
//         },
//       },
//     ],
//     [validationErrors, departments]
//   );

//   const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
//   const {
//     data: fetchedUsers = [],
//     isError: isLoadingUsersError,
//     isFetching: isFetchingUsers,
//     isLoading: isLoadingUsers,
//   } = useGetUsers();
//   const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
//   const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

//   const handleCreateUser = async ({ values, table }) => {
//     const newValidationErrors = validateUser(values);
//     if (Object.values(newValidationErrors).some((error) => error)) {
//       setValidationErrors(newValidationErrors);
//       return;
//     }
//     setValidationErrors({});
//     await createUser(values);
//     table.setCreatingRow(null);
//   };

//   const handleSaveUser = async ({ values, table }) => {
//     const newValidationErrors = validateUser(values);
//     if (Object.values(newValidationErrors).some((error) => error)) {
//       setValidationErrors(newValidationErrors);
//       return;
//     }
//     setValidationErrors({});
//     await updateUser(values);
//     table.setEditingRow(null);
//   };

//   const openDeleteConfirmModal = (row) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       deleteUser(row.original.id);
//     }
//   };

//   const table = useMaterialReactTable({
//     columns,
//     data: fetchedUsers,
//     createDisplayMode: 'modal',
//     editDisplayMode: 'modal',
//     enableEditing: true,
//     getRowId: (row) => row.id,

//     muiToolbarAlertBannerProps: isLoadingUsersError
//       ? {
//           color: 'error',
//           children: 'Error loading data',
//         }
//       : undefined,

//     onCreatingRowCancel: () => setValidationErrors({}),
//     onCreatingRowSave: handleCreateUser,
//     onEditingRowCancel: () => setValidationErrors({}),
//     onEditingRowSave: handleSaveUser,
//     renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
//       <>
//         <DialogTitle variant="h3">Create New User</DialogTitle>
//         <DialogContent
//           sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
//         >
//           {internalEditComponents}
//         </DialogContent>
//         <DialogActions>
//           <MRT_EditActionButtons variant="text" table={table} row={row} />
//         </DialogActions>
//       </>
//     ),
//     renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
//       <>
//         <DialogTitle variant="h3">Edit User</DialogTitle>
//         <DialogContent
//           sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
//         >
//           {internalEditComponents}
//         </DialogContent>
//         <DialogActions>
//           <MRT_EditActionButtons variant="text" table={table} row={row} />
//         </DialogActions>
//       </>
//     ),
//     renderRowActions: ({ row, table }) => (
//       <Box sx={{ display: 'flex', gap: '1rem' }}>
//         <Tooltip title="Edit">
//           <IconButton onClick={() => table.setEditingRow(row)}>
//             <EditIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Delete">
//           <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       </Box>
//     ),
//     state: {
//       isLoading: isLoadingUsers,
//       isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
//       showAlertBanner: isLoadingUsersError,
//       showProgressBars: isFetchingUsers,
//     },
//   });

//   return <MaterialReactTable {...table} />;
// };

// // Validate user input, including required fields
// const validateUser = (user) => {
//   const errors = {};

//   if (!user.tfname) errors.tfname = 'First name is required';
//   if (!user.tsname) errors.tsname = 'Surname is required';
//   if (!user.temail) errors.temail = 'Email is required';
//   if (!user.tphone) errors.tphone = 'Phone number is required';
//   if (!user.tdob) errors.tdob = 'Date of birth is required';
//   if (!user.tjoiningDate) errors.tjoiningDate = 'Joining date is required';
//   if (!user.departmentId) errors.departmentId = 'Department is required';

//   return errors;
// };

// // Custom hooks for API requests
// const useGetUsers = () => {
//   return useQuery(['users'], async () => {
//     const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`);
//     return data;
//   });
// };

// const useCreateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (values) => {
//       await axios.post(`${process.env.REACT_APP_API_URL}/Teachers`, values);
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries(['users']),
//     }
//   );
// };

// const useUpdateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (values) => {
//       await axios.put(`/api/users/${values.id}`, values);
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries(['users']),
//     }
//   );
// };

// const useDeleteUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (id) => {
//       await axios.delete(`/api/users/${id}`);
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries(['users']),
//     }
//   );
// };

// // Fetch departments data from API
// const useGetDepartments = () => {
//   return useQuery(['departments'], async () => {
//     const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/Departments`);
//     console.log(data)
//     return data?.data;
//   });
// };

// export default function Home() {
//   const queryClient = new QueryClient();
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Table />
//     </QueryClientProvider>
//   );
// }


// import axios from 'axios'; // Import axios for making API requests
// import { useEffect, useMemo, useState } from 'react';
// import {
//   MRT_EditActionButtons,
//   MaterialReactTable,
//   useMaterialReactTable,
// } from 'material-react-table';
// import {
//   Box,
//   Button,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Tooltip,
//   Typography,
//   MenuItem
// } from '@mui/material';
// import {
//   QueryClient,
//   QueryClientProvider,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { BorderAll } from '@mui/icons-material';
// import ErrorSnackbar from '../Helper/HandelError';
// import {handleError ,handleClose} from '../Helper/GetError';
// const Table = () => {
//   const [validationErrors, setValidationErrors] = useState({});
//   const [departments, setDepartments] = useState([]);
  
  
//   const GetDepartments = async () => {
//     try {
//       const request = await axios.get(`${process.env.REACT_APP_API_URL}/Departments`);
//       console.log(request.data.data);
//       setDepartments(request.data.data);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   useEffect(() => {
//     GetDepartments();
//   }, []); // Empty dependency array ensures this runs only once on component mount

  


//   const convertDateToInputFormat = (row,dateString) => {

//     console.log('row',row.row.original);
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
//     const day = ('0' + date.getDate()).slice(-2);
//     return `${year}-${month}-${day}`;
//   };



//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'tid',
//         enableEditing: false,
//         header: 'ID',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 80, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 80, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//       },
//       {
//         accessorKey: 'tfname',
//         header: 'First Name',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 100, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 100, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiEditTextFieldProps: {
//           required: true,
//           error: !!validationErrors?.tfname,
//           helperText: validationErrors?.tfname,
//           onFocus: () =>
//             setValidationErrors({
//               ...validationErrors,
//               tfname: undefined,
//             }),
//         },
//       },
//       {
//         accessorKey: 'tsname',
//         header: 'Surname',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 100, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 100, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiEditTextFieldProps: {
//           required: true,
//           error: !!validationErrors?.tsname,
//           helperText: validationErrors?.tsname,
//           onFocus: () =>
//             setValidationErrors({
//               ...validationErrors,
//               lastName: undefined,
//             }),
//         },
//       },
//       {
//         accessorKey: 'temail',
//         header: 'Email',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 150, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 150, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiEditTextFieldProps: {
//           type: 'email',
//           required: true,
//           error: !!validationErrors?.temail,
//           helperText: validationErrors?.temail,
//           onFocus: () =>
//             setValidationErrors({
//               ...validationErrors,
//               email: undefined,
//             }),
//         },
//       },
//       {
//         accessorKey: 'tphone',
//         header: 'Phone',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 120, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 120, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiEditTextFieldProps: {
//           type: 'phone',
//           required: true,
//           error: !!validationErrors?.tphone,
//           helperText: validationErrors?.tphone,
//           onFocus: () =>
//             setValidationErrors({
//               ...validationErrors,
//               tphone: undefined,
//             }),
//         },
//       },
//       {
//         accessorKey: 'tdob',
//         header: 'DOB',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 150, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 150, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         // muiEditTextFieldProps: {
//         //   type: 'date',
//         //   required: true,
//         //   error: !!validationErrors?.tdob,
//         //   helperText: validationErrors?.tdob,
//         //   onFocus: () =>
//         //     setValidationErrors({
//         //       ...validationErrors,
//         //       tdob: undefined,
//         //     }),
//         // },
//         muiEditTextFieldProps: (row) => ({
//           //component: <Box>{console.log(row)} </Box>,
//           type: 'date',
//           //value: '2002-02-10',
//           value:convertDateToInputFormat(row,row.row.original.tdob),
//           onChange: (event) => {
//             // Handle the change event
//             const newDate = event.target.value;          
//             row.row.original.tdob=newDate;
//             console.log(newDate,row.row.original.tdob)
//             // Update your state or call your method to handle the new date
//             // Example: updateRowData(row.id, { tjoiningDate: newDate });
//           },
//           required: true,
//           error: !!validationErrors?.tdob,
//           helperText: validationErrors?.tdob,
//           onFocus: () =>
//             setValidationErrors({
//               ...validationErrors,
//               tjoiningDate: undefined,
//             }),
//         })
//       },
//       {
//         accessorKey: 'tjoiningDate',
//         header: 'Joining Date',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 150, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 150, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         // muiEditTextFieldProps: {
//         //   type: 'date',
//         //   required: true,
//         //   value: () => {
//         //     // Print the cell object to the console
//         //     ///console.log('Cell object:', cell);
      
//         //     // Access and format the date
//         //     //const dateValue = cell.row.original.tjoiningDate;
//         //     //console.log('Raw date value:', dateValue);
      
//         //     return '2021-02-02';
//         //   },
//         //   error: !!validationErrors?.tjoiningDate,
//         //   helperText: validationErrors?.tjoiningDate,
//         //   value:( row ) =>{ return convertDateToInputFormat(row.tjoiningDate || '2002-02-10')

//         //   },
          
//         //   //defaultValue:'02-10-2002',  //row => row.tjoiningDate ? row.tjoiningDate.split('T')[0] : '', // Split the string to get the date part only
//         //   onFocus: () =>
//         //     setValidationErrors({
//         //       ...validationErrors,
//         //       tjoiningDate: undefined,
//         //     }),
//         // },
//         muiEditTextFieldProps: (row) => ({
//           //component: <Box>{console.log(row)} </Box>,
//           type: 'date',
//           //value: '2002-02-10',
//           value:convertDateToInputFormat(row,row.row.original.tjoiningDate),
//           onChange: (event) => {
//             // Handle the change event
//             const newDate = event.target.value;          
//             row.row.original.tjoiningDate=newDate;
//             console.log(newDate,row.row.original.tjoiningDate)
//             // Update your state or call your method to handle the new date
//             // Example: updateRowData(row.id, { tjoiningDate: newDate });
//           },
//           required: true,
//           error: !!validationErrors?.tjoiningDate,
//           helperText: validationErrors?.tjoiningDate,
//           onFocus: () =>
//             setValidationErrors({
//               ...validationErrors,
//               tjoiningDate: undefined,
//             }),
//         })
//       },
//       // Add other columns similarly
//       {
//         accessorKey: 'departmentId',
//         enableEditing: true,
//         header: 'Department Id',
//         muiTableHeadCellProps: {
//           sx: {
//             maxWidth: 80, // Set max width for header cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },
//         muiTableBodyCellProps: {
//           sx: {
//             maxWidth: 80, // Set max width for body cells
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//           },
//         },

//         muiEditTextFieldProps: {
//           required: true,
//           select: true,
//           error: !!validationErrors?.departmentId,
//           helperText: validationErrors?.departmentId,
//           onFocus: () =>
//             setValidationErrors((prev) => ({
//               ...prev,
//               departmentId: undefined,
//             })),
//             //Array.isArray(departments) &&
//             children:  departments.map((dept) => (
//               <MenuItem 
//               key={dept.departmentId} 
//               value={dept.departmentId}>
//                   {dept.departmentName + " : " + dept.departmentId}
//               </MenuItem>
//           )),
//         },
//       },
      
//     ],
//     [validationErrors]
//   );
  
//   const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
//   const {
//     data: fetchedUsers = [],
//     isError: isLoadingUsersError,
//     isFetching: isFetchingUsers,
//     isLoading: isLoadingUsers,
//   } = useGetUsers();
//   const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
//   const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

//   const handleCreateUser = async ({ values, table }) => {
//     const newValidationErrors = validateUser(values);
//     if (Object.values(newValidationErrors).some((error) => error)) {
//       setValidationErrors(newValidationErrors);
//       return;
//     }
//     setValidationErrors({});
//     await createUser(values);
//     table.setCreatingRow(null);
//   };

//   const handleSaveUser = async ({ values, table }) => {
//     console.log(values);
//     const newValidationErrors = validateUser(values);
//     console.log(newValidationErrors)
//     if (Object.values(newValidationErrors).some((error) => error)) {
//       setValidationErrors(newValidationErrors);
//       return;
//     }
//     setValidationErrors({});
//     await updateUser(values);
//     table.setEditingRow(null);
//   };

//   const openDeleteConfirmModal = (row) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       deleteUser(row.original.id);
//     }
//   };

  
// const table = useMaterialReactTable({
//     columns,
//     data: fetchedUsers,
//     createDisplayMode: 'modal',
//     editDisplayMode: 'modal',
//     enableEditing: true,
//     getRowId: (row) => row.id,

//     muiToolbarAlertBannerProps: isLoadingUsersError
//       ? {
//           color: 'error',
//           children: 'Error loading data',
//         }
//       : undefined,
    
//     muiTableContainerProps: {
//       sx: {
//         minHeight: '400px',
//         width:'100%',
//         //position: 'relative',
//         boxShadow: 'none', // Removes shadow

//         border: 'none',
//         //marginTop:'3rem',
//         marginTop:{
//           xs: '4rem',  
//           sm: '4rem',
//         },
        
      
//         position:'absolute',
//         // width: {
//         //     xs: '90vw',  // 90% of the viewport width for extra-small devices (like mobile)
//         //     sm: '90vw',  // 80% of the viewport width for small devices (like tablets)
//         //     md: '70vw',  // 70% of the viewport width for medium and up devices (like laptops and desktops)
            
//         // },
//         marginLeft:{
//             xs:'auto',
//             sm:'auto',
//             md:'auto',
//         }
//       },

      

//     },
  
    
//     onCreatingRowCancel: () => setValidationErrors({}),
//     onCreatingRowSave: handleCreateUser,
//     onEditingRowCancel: () => setValidationErrors({}),
//     onEditingRowSave: handleSaveUser,
//     renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
//       <>
//         <DialogTitle variant="h3">Create New User</DialogTitle>
//         <DialogContent
//           sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
//         >
//           {internalEditComponents}
//         </DialogContent>
//         <DialogActions>
//           <MRT_EditActionButtons variant="text" table={table} row={row} />
//         </DialogActions>
//       </>
//     ),
//     renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
//       <>
//         <DialogTitle variant="h3">Edit User</DialogTitle>
//         <DialogContent
//           sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
//         >
//           {internalEditComponents}
//         </DialogContent>
//         <DialogActions>
//           <MRT_EditActionButtons variant="text" table={table} row={row} />
//         </DialogActions>
//       </>
//     ),
//     renderRowActions: ({ row, table }) => (
//       <Box sx={{ display: 'flex', gap: '1rem' }}>
//         <Tooltip title="Edit">
//           <IconButton onClick={() => table.setEditingRow(row)}>
//             <EditIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Delete">
//           <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       </Box>
//     ),
//     // renderTopToolbarCustomActions: ({ table }) => (
//     //   <Typography level="h1" sx={{marginLeft:'40%', fontSize:'2rem'}}>All Teachers</Typography>

//     // ),
//     state: {
//       isLoading: isLoadingUsers,
//       isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
//       showAlertBanner: isLoadingUsersError,
//       showProgressBars: isFetchingUsers,
//     },
//     muiTopToolbarProps: {
//       sx: {
//         boxShadow: 'none', // Removes shadow

//       },
//     },
//     muiTablePaginationProps: {
//       sx: {
//         boxShadow: 'none', // Removes shadow
//       },
//     },
//   });
  
//   return <MaterialReactTable table={table} />;
// };

// // CREATE hook (post new user to API)
// function useCreateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/Teachers`, user); // replace with actual API endpoint
//       return response.data.data; // Adjusted to get the data from response.data.data
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

// // READ hook (get users from API)
// function useGetUsers() {
//   //useGetDepartments();

//   return useQuery({
//     queryKey: ['users'],
//     queryFn: async () => {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`); // replace with actual API endpoint
//       return response.data.data; // Adjusted to get the data from response.data.data
//     },
//     refetchOnWindowFocus: false,
//   });
// }

// // UPDATE hook (put user in API)
// function useUpdateUser() {
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

// const queryClient = new QueryClient();

// const TeacherTable = () => (
//   <QueryClientProvider client={queryClient}>
//     {/* <Box sx={{ width: '90%', marginLeft:"1.5rem"}  }>     */}
//         <Table />
//     {/* </Box> */}
//   </QueryClientProvider>
// );

// export default TeacherTable;

// const validateRequired = (value) => {
//   return !value
// };
// const validateEmail = (email) =>
//   !!email?.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/,
//     );


// // const validateUser = (user) => {
// //   return {
// //     temail: validateEmail(user.temail) ? '' : 'Invalid Email',
// //     tfname: validateRequired(user.tfname) ? '' : 'Required',
// //     tsname: validateRequired(user.tsname) ? '' : 'Required',
// //     tphone:user.tphone ? '' : "Required"
// //   };
// // };

// const validateUser = (user) => {
//   const errors = {};

//   // Check for required fields
//   if (!user.tfname) errors.tfname = 'First name is required';
//   if (!user.tsname) errors.tsname = 'Surname is required';
//   if (!user.temail) errors.temail = 'Email is required';
//   if (!user.tphone) errors.tphone = 'Phone number is required';
//   if (!user.tdob) errors.tdob = 'Date of birth is required';
//   if (!user.tjoiningDate) errors.tjoiningDate = 'Joining date is required';
//   if (!user.departmentId) errors.departmentId = 'Department is required';

//   // First name validation
//   if (user.tfname) {
//     if (user.tfname.length < 3) {
//       errors.tfname = 'First name must be at least 3 characters long';
//     }
//     if (/\d/.test(user.tfname)) {
//       errors.tfname = 'First name cannot contain numbers';
//     }
//   }

//   // Surname validation
//   if (user.tsname) {
//     if (user.tsname.length < 3) {
//       errors.tsname = 'Surname must be at least 3 characters long';
//     }
//     if (/\d/.test(user.tsname)) {
//       errors.tsname = 'Surname cannot contain numbers';
//     }
//   }
//   // Email validation
//   if (user.temail && !/\S+@\S+\.\S+/.test(user.temail)) {
//     errors.temail = 'Email is not valid';
//   }

//   // Phone number validation
//   if (user.tphone && !/^\d{10}$/.test(user.tphone)) {
//       errors.tphone = 'Phone number must be exactly 10 digits and numbers only';
//   }

//   // Date validation
//   const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
//   const dob = new Date(user.tdob);
//   const joiningDate = new Date(user.tjoiningDate);

//   if (user.tdob && joiningDate < dob) {
//     errors.tjoiningDate = 'Joining date cannot be earlier than date of birth';
//   }

//   if (user.tjoiningDate && joiningDate > new Date(today)) {
//     errors.tjoiningDate = 'Joining date cannot be later than today';
//   }

//   // Return errors
//   return errors;
// };




