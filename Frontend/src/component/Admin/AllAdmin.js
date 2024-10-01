import axios from 'axios'; // Import axios for making API requests
import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { handleError, handleClose, showAlertMessage, showSuccess } from '../Helper/GetError';

const AdminTable = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [fetchedAdmins, setFetchedAdmins] = useState([]);
  const [error, setError] = useState({
    open: false,
    statusCode: null,
    errorDetails: {},
  });

  const URL = `${process.env.REACT_APP_API_URL}/SuperAdmin`; // Replace with actual admin API URL

  const getAdmins = async () => {
    try {
      const response = await axios.get(`${URL}`); // Fetch admin data from API
      setFetchedAdmins(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
    
      setError({ open: true, statusCode, errorDetails });
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []); // Fetches data once when the component is mounted

  const adminColumns = useMemo(
    () => [
      {
        accessorKey: 'sid',
        enableEditing: false,
        header: 'ID',
        muiTableHeadCellProps: {
          sx: { maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
        muiTableBodyCellProps: {
          sx: { maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableHeadCellProps: {
          sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
        muiTableBodyCellProps: {
          sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () => setValidationErrors({ ...validationErrors, email: undefined }),
        },
      },
      {
        accessorKey: 'password',
        header: 'Password',
        muiTableHeadCellProps: {
          sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
        muiTableBodyCellProps: {
          sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
        muiEditTextFieldProps: {
          type: 'password',
          required: true,
          error: !!validationErrors?.password,
          helperText: validationErrors?.password,
          onFocus: () => setValidationErrors({ ...validationErrors, password: undefined }),
        },
      },
      {
        accessorKey: 'ts',
        header: 'Timestamp',
        muiTableHeadCellProps: {
          sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
        muiTableBodyCellProps: {
          sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        },
        muiEditTextFieldProps: (row) => ({
          type: 'datetime-local',
          value: new Date(row.row.original.ts).toISOString().slice(0, 16), // Format timestamp for input field
          onChange: (event) => {
            const newDate = event.target.value;
            row.row.original.ts = newDate;
          },
          required: true,
          error: !!validationErrors?.ts,
          helperText: validationErrors?.ts,
          onFocus: () => setValidationErrors({ ...validationErrors, ts: undefined }),
        }),
      },
    ],
    [validationErrors]
  );

  const handleCreateAdmin = async ({ values, table }) => {
    const newValidationErrors = validateAdmin(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    values.password = "string"; // Dummy password for simplicity
    values.sid = "0"; // Set default ID

    try {
      const response = await axios.post(`${URL}`, values, {
        withCredentials: true,
      });
      getAdmins();
      table.setCreatingRow(null);
      return showSuccess(response?.data, response?.status);
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  const handleSaveAdmin = async ({ values, table }) => {
    const newValidationErrors = validateAdmin(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    try {
      const response = await axios.patch(`${URL}/${values.sid}`, values, {
        withCredentials: true,
      });
      table.setEditingRow(null);
      return showSuccess(response?.data, response?.status);
    } catch (error) {
      const { statusCode, errorDetails } = handleError(error);
      setError({ open: true, statusCode, errorDetails });
      return showAlertMessage(statusCode, errorDetails);
    }
  };

  const table = useMaterialReactTable({
    columns: adminColumns,
    data: fetchedAdmins,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.sid,
    muiToolbarAlertBannerProps: error.statusCode
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: { minHeight: '400px', width: '100%', marginTop: '2rem' },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateAdmin,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveAdmin,
  });

  return (
    <>
       {fetchedAdmins && 
       <MaterialReactTable {...table} />
       } 
    </>
  );
};

const validateAdmin = (values) => {
    const errors = {};
    
    // Validate email
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email format is invalid";
    }
    
    // Validate password
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    return errors;
  };
  
export default AdminTable;


