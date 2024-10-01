import axios from 'axios'; // Import axios for making API requests
import { useMemo, useState } from 'react';
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

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const columns2 = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
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
        accessorKey: 'state',
        header: 'State',
        editVariant: 'select',
        editSelectOptions: usStates,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

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
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
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
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
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
      },
      // Add other columns similarly
      {
        accessorKey: 'departmentId',
        enableEditing: false,
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
      },
      
    ],
    [validationErrors]
  );
  
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null);
  };

  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
    }
  };

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
//     muiTableContainerProps: {
//       sx: {
//         minHeight: '500px',
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
//       <Box sx={{ display: 'flex', gap: '1rem', }}>
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
//     renderTopToolbarCustomActions: ({ table }) => (
//       <Button
//         variant="contained"
//         onClick={() => {
//           table.setCreatingRow(true);
//         }}
//       >
//         Create New User
//       </Button>
//     ),
//     state: {
//       isLoading: isLoadingUsers,
//       isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
//       showAlertBanner: isLoadingUsersError,
//       showProgressBars: isFetchingUsers,
//     },
//     renderTopToolbarCustomActions: null, // Remove create button
//     muiTablePaginationProps: {
//       sx: {
//         justifyContent: 'flex-start', // Align pagination to the left
//       },
//     },
//     // Align the toolbar icons (search, filter, etc.) to the right
//   muiTopToolbarProps: {
//     sx: {
//       display: 'flex',
//       justifyContent: 'flex-end', // Align to the right
//     },
//   },

//   // Align pagination controls to the right
//   muiTablePaginationProps: {
//     sx: {
//       display: 'flex',
//       justifyContent: 'flex-start', // Align to the right
//     },
//   },
//   });

const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '400px',
        width: {
            xs: '90vw',  // 90% of the viewport width for extra-small devices (like mobile)
            sm: '90vw',  // 80% of the viewport width for small devices (like tablets)
            md: '70vw',  // 70% of the viewport width for medium and up devices (like laptops and desktops)
            
        },
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
        <DialogTitle variant="h3">Create New User</DialogTitle>
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
        <DialogTitle variant="h3">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
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
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Button
    //     variant="contained"
    //     onClick={() => {
    //       table.setCreatingRow(true);
    //     }}
    //   >
    //     Create New User
    //   </Button>
    // ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
    muiTopToolbarProps: {
      sx: {
        display: 'flex',
        justifyContent: 'flex-start', // Align toolbar icons to the left
      },
    },
    muiTablePaginationProps: {
      sx: {
        display: 'flex',
        justifyContent: 'flex-start', // Align pagination to the left
      },
    },
  });
  
  return <MaterialReactTable table={table} />;
};

// CREATE hook (post new user to API)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/Teachers`, user); // replace with actual API endpoint
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
  });
}

// READ hook (get users from API)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`); // replace with actual API endpoint
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    refetchOnWindowFocus: false,
  });
}

// UPDATE hook (put user in API)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
        console.log(user);
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/Teachers`, user); // replace with actual API endpoint
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
  });
}

// DELETE hook (delete user in API)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`/api/users/${userId}`); // replace with actual API endpoint
    },
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    {/* <Box sx={{ width: '90%', marginLeft:"1.5rem"}  }>     */}
        <Example />
    {/* </Box> */}
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email?.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/,
    );


const validateUser = (user) => {
  return {
    temail: validateEmail(user.temail) ? '' : 'Invalid Email',
    tfname: validateRequired(user.tfname) ? '' : 'Required',
    tsname: validateRequired(user.tsname) ? '' : 'Required',
    tphone:user.tphone ? '' : "Required"
  };
};

// You can find this array on Google
const usStates = [
  { value: 'Alabama', label: 'Alabama' },
  { value: 'Alaska', label: 'Alaska' },
  { value: 'American Samoa', label: 'American Samoa' },
  { value: 'Arizona', label: 'Arizona' },
  { value: 'Arkansas', label: 'Arkansas' },
  { value: 'California', label: 'California' },
  { value: 'Colorado', label: 'Colorado' },
  { value: 'Connecticut', label: 'Connecticut' },
  { value: 'Delaware', label: 'Delaware' },
  { value: 'District of Columbia', label: 'District of Columbia' },
  { value: 'Florida', label: 'Florida' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Guam', label: 'Guam' },
  { value: 'Hawaii', label: 'Hawaii' },
  { value: 'Idaho', label: 'Idaho' },
  { value: 'Illinois', label: 'Illinois' },
  { value: 'Indiana', label: 'Indiana' },
  { value: 'Iowa', label: 'Iowa' },
  { value: 'Kansas', label: 'Kansas' },
  { value: 'Kentucky', label: 'Kentucky' },
  { value: 'Louisiana', label: 'Louisiana' },
  { value: 'Maine', label: 'Maine' },
  { value: 'Maryland', label: 'Maryland' },
  { value: 'Massachusetts', label: 'Massachusetts' },
  { value: 'Michigan', label: 'Michigan' },
  { value: 'Minnesota', label: 'Minnesota' },
  { value: 'Mississippi', label: 'Mississippi' },
  { value: 'Missouri', label: 'Missouri' },
  { value: 'Montana', label: 'Montana' },
  { value: 'Nebraska', label: 'Nebraska' },
  { value: 'Nevada', label: 'Nevada' },
  { value: 'New Hampshire', label: 'New Hampshire' },
  { value: 'New Jersey', label: 'New Jersey' },
  { value: 'New Mexico', label: 'New Mexico' },
  { value: 'New York', label: 'New York' },
  { value: 'North Carolina', label: 'North Carolina' },
  { value: 'North Dakota', label: 'North Dakota' },
  { value: 'Northern Marianas Islands', label: 'Northern Marianas Islands' },
  { value: 'Ohio', label: 'Ohio' },
  { value: 'Oklahoma', label: 'Oklahoma' },
  { value: 'Oregon', label: 'Oregon' },
  { value: 'Pennsylvania', label: 'Pennsylvania' },
  { value: 'Puerto Rico', label: 'Puerto Rico' },
  { value: 'Rhode Island', label: 'Rhode Island' },
  { value: 'South Carolina', label: 'South Carolina' },
  { value: 'South Dakota', label: 'South Dakota' },
  { value: 'Tennessee', label: 'Tennessee' },
  { value: 'Texas', label: 'Texas' },
  { value: 'Utah', label: 'Utah' },
  { value: 'Vermont', label: 'Vermont' },
  { value: 'Virginia', label: 'Virginia' },
  { value: 'Virgin Islands', label: 'Virgin Islands' },
  { value: 'Washington', label: 'Washington' },
  { value: 'West Virginia', label: 'West Virginia' },
  { value: 'Wisconsin', label: 'Wisconsin' },
  { value: 'Wyoming', label: 'Wyoming' },
];





import axios from 'axios'; // Import axios for making API requests
import { useMemo, useState } from 'react';
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
  Typography
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

const Table = () => {
  const [validationErrors, setValidationErrors] = useState({});


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
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
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
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
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
      },
      // Add other columns similarly
      {
        accessorKey: 'departmentId',
        enableEditing: false,
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
      },
      
    ],
    [validationErrors]
  );
  
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null);
  };

  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
    }
  };

  
const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,

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
        <DialogTitle variant="h3">Create New User</DialogTitle>
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
        <DialogTitle variant="h3">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
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
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Typography level="h1" sx={{marginLeft:'40%', fontSize:'2rem'}}>All Teachers</Typography>

    // ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
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
  
  return <MaterialReactTable table={table} />;
};

// CREATE hook (post new user to API)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/Teachers`, user); // replace with actual API endpoint
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
  });
}

// READ hook (get users from API)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`); // replace with actual API endpoint
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    refetchOnWindowFocus: false,
  });
}

// UPDATE hook (put user in API)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
        console.log(user);
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/Teachers`, user); // replace with actual API endpoint
      return response.data.data; // Adjusted to get the data from response.data.data
    },
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
  });
}

// DELETE hook (delete user in API)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`/api/users/${userId}`); // replace with actual API endpoint
    },
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
  });
}

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


const validateUser = (user) => {
  return {
    temail: validateEmail(user.temail) ? '' : 'Invalid Email',
    tfname: validateRequired(user.tfname) ? '' : 'Required',
    tsname: validateRequired(user.tsname) ? '' : 'Required',
    tphone:user.tphone ? '' : "Required"
  };
};




