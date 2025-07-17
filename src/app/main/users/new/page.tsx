'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Avatar,
  Typography,
  Stack as MuiStack,
} from '@mui/material';

export default function AddUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    badgeNumber: '',
    email: '',
    role: '',
    password: '',
    photo: null as File | null,
    photoPreview: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('badgeNumber', form.badgeNumber);
    formData.append('email', form.email);
    formData.append('role', form.role);
    formData.append('password', form.password);
    if (form.photo) formData.append('photo', form.photo);

    const res = await fetch('/api/users/new', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (res.ok) {
      router.push('/main/users');
    } else {
      alert('Failed to add user');
    }
  };

  return (
    <MuiStack spacing={3} sx={{ maxWidth: 600, p: 4 }}>
      <Typography variant="h5">Add New User</Typography>

      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Badge Number"
        value={form.badgeNumber}
        onChange={(e) => handleInputChange('badgeNumber', e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Email"
        value={form.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        required
        fullWidth
      />

      <FormControl fullWidth required>
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          value={form.role}
          label="Role"
          onChange={(e) => handleInputChange('role', e.target.value)}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        required
        fullWidth
      />

      <Box>
        <InputLabel>Photo</InputLabel>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {form.photoPreview && (
          <Avatar
            src={form.photoPreview}
            sx={{ width: 80, height: 80, mt: 2 }}
          />
        )}
      </Box>

      <Button variant="contained" onClick={handleSubmit}>
        Add User
      </Button>
    </MuiStack>
  );
}
