import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MRT_EditActionButtons,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchTeachers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/Teachers`);
  return response.data.data; // Adjust according to your API response structure
};

const TeacherTableComponent = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'tid',
        header: 'ID',
        muiTableHeadCellProps: { sx: { maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
      },
      {
        accessorKey: 'tfname',
        header: 'First Name',
        muiTableHeadCellProps: { sx: { maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.tfname,
          helperText: validationErrors?.tfname,
          onFocus: () => setValidationErrors({ ...validationErrors, tfname: undefined }),
        },
      },
      {
        accessorKey: 'tsname',
        header: 'Last Name',
        muiTableHeadCellProps: { sx: { maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.tsname,
          helperText: validationErrors?.tsname,
          onFocus: () => setValidationErrors({ ...validationErrors, tsname: undefined }),
        },
      },
      {
        accessorKey: 'tdob',
        header: 'Date of Birth',
        muiTableHeadCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          type: 'date',
          required: true,
          error: !!validationErrors?.tdob,
          helperText: validationErrors?.tdob,
          onFocus: () => setValidationErrors({ ...validationErrors, tdob: undefined }),
        },
      },
      {
        accessorKey: 'tphone',
        header: 'Phone Number',
        muiTableHeadCellProps: { sx: { maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.tphone,
          helperText: validationErrors?.tphone,
          onFocus: () => setValidationErrors({ ...validationErrors, tphone: undefined }),
        },
      },
      {
        accessorKey: 'temail',
        header: 'Email',
        muiTableHeadCellProps: { sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.temail,
          helperText: validationErrors?.temail,
          onFocus: () => setValidationErrors({ ...validationErrors, temail: undefined }),
        },
      },
      {
        accessorKey: 'tjoiningDate',
        header: 'Joining Date',
        muiTableHeadCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          type: 'date',
          required: true,
          error: !!validationErrors?.tjoiningDate,
          helperText: validationErrors?.tjoiningDate,
          onFocus: () => setValidationErrors({ ...validationErrors, tjoiningDate: undefined }),
        },
      },
      {
        accessorKey: 'departmentId',
        header: 'Department ID',
        muiTableHeadCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.departmentId,
          helperText: validationErrors?.departmentId,
          onFocus: () => setValidationErrors({ ...validationErrors, departmentId: undefined }),
        },
      },
      {
        accessorKey: 'ts',
        header: 'Timestamp',
        muiTableHeadCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiTableBodyCellProps: { sx: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        muiEditTextFieldProps: {
          disabled: true,
        },
      },
    ],
    [validationErrors]
  );

  const queryClient = useQueryClient();
  const { data: fetchedTeachers = [], isError: isLoadingTeachersError, isFetching: isFetchingTeachers, isLoading: isLoadingTeachers } = useQuery(['teachers'], fetchTeachers);

  const { mutateAsync: createTeacher, isPending: isCreatingTeacher } = useCreateTeacher();
  const { mutateAsync: updateTeacher, isPending: isUpdatingTeacher } = useUpdateTeacher();
  const { mutateAsync: deleteTeacher, isPending: isDeletingTeacher } = useDeleteTeacher();

  const handleCreateTeacher = async ({ values, table }) => {
    const newValidationErrors = validateTeacher(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createTeacher(values);
    table.setCreatingRow(null);
  };

  const handleSaveTeacher = async ({ values, table }) => {
    const newValidationErrors = validateTeacher(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateTeacher(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacher(row.original.tid);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedTeachers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.tid,
    muiToolbarAlertBannerProps: isLoadingTeachersError ? { color: 'error', children: 'Error loading data' } : undefined,
    muiTableContainerProps: { sx: { overflowX: 'auto', minWidth: 600 } },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateTeacher,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveTeacher,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Teacher</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{internalEditComponents}</DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Teacher</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{internalEditComponents}</DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ table, row }) => (
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <Tooltip arrow placement="left" title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: { showProgressBars: isFetchingTeachers || isCreatingTeacher || isUpdatingTeacher || isDeletingTeacher },
  });

  return <MaterialReactTable table={table} />;
};

function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTeacher) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve({
        tid: Date.now(),
        ...newTeacher,
        ts: new Date().toISOString(),
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['teachers']),
  });
}

function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teacher) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onSuccess: () => queryClient.invalidateQueries(['teachers']),
  });
}

function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onSuccess: () => queryClient.invalidateQueries(['teachers']),
  });
}

function validateTeacher(values) {
  const errors = {};
  if (!values.tfname) errors.tfname = 'First name is required';
  if (!values.tsname) errors.tsname = 'Last name is required';
  if (!values.temail) errors.temail = 'Email is required';
  if (!values.tdob) errors.tdob = 'Date of Birth is required';
  if (!values.tphone) errors.tphone = 'Phone number is required';
  if (!values.tjoiningDate) errors.tjoiningDate = 'Joining Date is required';
  if (!values.departmentId) errors.departmentId = 'Department ID is required';
  return errors;
}

export default TeacherTableComponent;
