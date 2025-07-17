'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import KeyIcon from '@mui/icons-material/VpnKey';

interface User {
  id: string;
  name: string;
  email: string;
  badgeNumber: string;
  role: string;
  photo: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const fetchUsers = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: search,
      sortField: sortField || '',
      sortOrder: sortAsc ? 'asc' : 'desc',
    });

    const res = await fetch(`/api/users?${params.toString()}`, { credentials: 'include' });
    if (!res.ok) return;

    const data = await res.json();
    setUsers(data.users);
    setTotalUsers(data.total);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleResetPassword = (badgeNumber: string) => {
    const newPassword = window.prompt(`Enter a new password for user ${badgeNumber}:`);
    if (!newPassword) return;

    fetch(`/api/users/reset-password/${badgeNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: newPassword }),
    }).then((res) => {
      alert(res.ok ? 'Password reset successfully.' : 'Failed to reset password.');
    }).catch(() => {
      alert('An error occurred while resetting the password.');
    });
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/users?page=0&pageSize=10000`, { credentials: 'include' });
      if (!res.ok) return alert('Failed to fetch users for export');

      const data = await res.json();
      const users = data.users;

      const headers = ['Name', 'Badge Number', 'Email', 'Role'];
      const rows = users.map((user: any) => [
        user.name,
        user.badgeNumber,
        user.email,
        user.role,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row: any[]) =>
        row.map((field: any) => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(',')
      )].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed');
    }
  };

  const handleImport = () => {
    const csvFile = document.getElementById('csvFileId') as HTMLInputElement;
    csvFile?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csv', file);

    fetch('/api/users/import', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then((res) => {
      if (res.ok) {
        alert('Users imported successfully');
        fetchUsers();
      } else {
        alert('Import failed');
      }
    });
  };

  return (
    <Box p={4}>
      <input type="file" id="csvFileId" accept=".csv" hidden onChange={handleFileChange} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
        <Typography variant="h4">Users</Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleImport}
          >
            Import Users
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export Users
          </Button>
          <Button variant="contained" onClick={() => router.push('/main/users/new')}>
            Add New User
          </Button>
        </Stack>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search by name, email or badge number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        margin="normal"
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</TableCell>
              <TableCell onClick={() => handleSort('badgeNumber')} style={{ cursor: 'pointer' }}>Badge Number</TableCell>
              <TableCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email</TableCell>
              <TableCell onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>Role</TableCell>
              <TableCell>Reset Password</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar
                    src={`/api/${user.photo || 'uploads/default.png'}`}
                    alt={user.name}
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Typography
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/main/users/${user.badgeNumber}`)}
                  >
                    {user.badgeNumber}
                  </Typography>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleResetPassword(user.badgeNumber)}>
                    <KeyIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={2} alignItems="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </Box>
  );
}
