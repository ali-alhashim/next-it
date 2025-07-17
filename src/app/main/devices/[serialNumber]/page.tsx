'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface DeviceUser {
  badgeNumber: string;
  receivedDate: string;
  handoverDate: string;
  note: string;
  createdAt: { $date: string };
}

interface Device {
  serialNumber: string;
  category: string;
  model: string;
  description: string;
  manufacture: string;
  status: string;
  createdAt: { $date: string };
  users: DeviceUser[];
}

interface User {
  badgeNumber: string;
  name: string;
}

export default function DeviceDetail() {
  const { serialNumber } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [receivedDate, setReceivedDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdAtString, setCreatedAtString] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await fetch(`/api/devices/${serialNumber}`);
        if (!res.ok) throw new Error('Device not found');
        const data = await res.json();
        setDevice(data);

        if (data?.createdAt?.$date) {
          const formatted = new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'UTC',
          }).format(new Date(data.createdAt.$date));
          setCreatedAtString(formatted);
        }
      } catch (error) {
        console.error('Error fetching device:', error);
        setDevice(null);
      } finally {
        setLoading(false);
      }
    };

    if (serialNumber) fetchDevice();
  }, [serialNumber]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!selectedUser || !receivedDate) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/devices/${serialNumber}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badgeNumber: selectedUser.badgeNumber,
          receivedDate,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDevice(updated);
        setSelectedUser(null);
        setReceivedDate('');
      } else {
        console.error('Error submitting data');
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const userColumns: GridColDef[] = [
    { field: 'badgeNumber', headerName: 'Badge Number', width: 130 },
    { field: 'receivedDate', headerName: 'Received Date', width: 150 },
    { field: 'handoverDate', headerName: 'Handover Date', width: 150 },
    { field: 'note', headerName: 'Note', width: 200 },
    
  ];

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (!device)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Device not found
      </Alert>
    );

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Device Details
          </Typography>
          <Stack spacing={1}>
            <Typography><strong>Serial Number:</strong> {device.serialNumber}</Typography>
            <Typography><strong>Category:</strong> {device.category}</Typography>
            <Typography><strong>Model:</strong> {device.model}</Typography>
            <Typography><strong>Description:</strong> {device.description}</Typography>
            <Typography><strong>Manufacture:</strong> {device.manufacture}</Typography>
            <Typography><strong>Status:</strong> {device.status}</Typography>
            <Typography><strong>Created At:</strong> {createdAtString}</Typography>
          </Stack>
        </CardContent>
        <CardActions>
          <Typography variant="body1" sx={{ ml: 2 }}>
            Total Users: {device.users.length}
          </Typography>
        </CardActions>
      </Card>

      <Box>
        <Button variant="outlined" onClick={() => setOpenDialog(true)}>
          Open Dialog
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => alert('Do Something')} variant="contained">
              Do Something
            </Button>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Users History
          </Typography>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={device.users.map((u, index) => ({ id: index, ...u }))}
              columns={userColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
