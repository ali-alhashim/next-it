'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const categoryOptions = [
  'Laptop',
  'Desktop PC',
  'Monitor',
  'Printer',
  'Other',
];

const statusOptions = [
  'New',
  'Used',
  'Old',
  'Damaged',
  'Lost',
  'Stolen',
];

export default function AddDevicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    serialNumber: '',
    category: '',
    model: '',
    description: '',
    manufacture: '',
    invoiceNumber: '',
    supplier: '',
    status: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    const res = await fetch('/api/devices/new', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (res.ok) {
      router.push('/main/devices');
    } else {
      alert('Failed to add device');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Add New Device
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Serial Number"
          value={form.serialNumber}
          onChange={(e) => handleInputChange('serialNumber', e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Category"
          select
          value={form.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          required
          fullWidth
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Model"
          value={form.model}
          onChange={(e) => handleInputChange('model', e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Manufacture"
          value={form.manufacture}
          onChange={(e) => handleInputChange('manufacture', e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Invoice Number"
          value={form.invoiceNumber}
          onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Supplier"
          value={form.supplier}
          onChange={(e) => handleInputChange('supplier', e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Status"
          select
          value={form.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          required
          fullWidth
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Device
        </Button>
      </Stack>
    </Box>
  );
}
