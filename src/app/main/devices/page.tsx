'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // New import for history info

interface DeviceUserHistory {
  id: string;
  badgeNumber: string;
  receivedDate: string;
  handoverDate: string | null;
  note?: string;
  userName?: string;
}

interface Device {
  model: string;
  serialNumber: string;
  category: string;
  status: string;
  manufacture: string;
  description: string;
  supplier: string;
  invoiceNumber: string;
  users: DeviceUserHistory[];
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr || dateStr === 'NULL') return 'Still Assigned';

  const isoStr = dateStr.replace(' ', 'T');
  const parsedDate = new Date(isoStr);

  if (isNaN(parsedDate.getTime())) return 'Invalid Date';

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function DevicesPage() {
  const router = useRouter();

  const [devices, setDevices] = useState<Device[]>([]);
  const [totalDevices, setTotalDevices] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDeviceSerial, setSelectedDeviceSerial] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [handoverNote, setHandoverNote] = useState('');
  const [handoverDate, setHandoverDate] = useState<Date | null>(null);
  const [currentImportURL, setCurrentImportURL] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalDevices / pageSize));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search,
      sortField: sortField || '',
      sortOrder: sortAsc ? 'asc' : 'desc',
    });

    try {
      const res = await fetch(`/api/devices?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        setDevices([]);
        setTotalDevices(0);
        return;
      }

      const data = await res.json();
      setDevices(data.devices);
      setTotalDevices(data.total);
    } catch {
      setDevices([]);
      setTotalDevices(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortField, sortAsc]);

  useEffect(() => {
    if (!isClient) return;
    fetchDevices();
  }, [page, search, sortField, sortAsc, isClient, fetchDevices]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const openDialog = (serial: string, badge: string) => {
    setSelectedDeviceSerial(serial);
    setSelectedBadge(badge);
    setHandoverNote('');
    setHandoverDate(null);
    setDialogVisible(true);
  };

  const handleSendHandoverRequest = async () => {
    if (!handoverDate) {
      alert('Please pick a handover date.');
      return;
    }

    try {
      const res = await fetch('/api/devices/send-handover-request', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: selectedDeviceSerial,
          badgeNumber: selectedBadge,
          handoverDate: handoverDate.toISOString(),
          note: handoverNote,
        }),
      });

      if (res.ok) {
        alert('Request sent successfully');
        setDialogVisible(false);
        fetchDevices();
      } else {
        const errorText = await res.text();
        alert(`Failed to send request: ${errorText}`);
      }
    } catch {
      alert('An unexpected error occurred while sending the request.');
    }
  };

  async function handleExport() {
    try {
      const res = await fetch(
        `/api/devices?page=0&pageSize=${totalDevices > 0 ? totalDevices : 10000}`,
        {
          credentials: 'include',
        }
      );

      if (!res.ok) {
        alert('Failed to fetch devices for export');
        return;
      }

      const data = await res.json();
      const allDevices = data.devices;

      if (!allDevices.length) {
        alert('No devices to export');
        return;
      }

      const headers = [
        'serialNumber',
        'category',
        'model',
        'description',
        'manufacture',
        'status',
      ];

      const rows = allDevices.map((device: any) => [
        device.serialNumber,
        device.category,
        device.model,
        device.description,
        device.manufacture,
        device.status,
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: string[]) =>
          row.map((field) => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devices.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed');
    }
  }

  function handleImport(importType: string) {
    let urlToSet = '';
    if (importType === 'DevicesList') {
      urlToSet = '/api/devices/import';
    } else if (importType === 'DevicesUserList') {
      urlToSet = '/api/devices/import-users';
    }
    setCurrentImportURL(urlToSet);

    const csvFile = document.getElementById('csvFileId') as HTMLInputElement;
    if (csvFile) {
      csvFile.value = '';
      csvFile.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentImportURL) return;

    const formData = new FormData();
    formData.append('csv', file);

    fetch(currentImportURL, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          alert('Data imported successfully');
          fetchDevices();
        } else {
          res.text().then((errorText) => {
            alert(`Import failed: ${errorText}`);
          });
        }
      })
      .catch(() => {
        alert('Import failed due to network error or server not reachable.');
      });
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Devices
      </Typography>

      <input
        type="file"
        id="csvFileId"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {!isClient ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Button
              startIcon={<UploadFileIcon />}
              onClick={() => handleImport('DevicesList')}
              variant="outlined"
            >
              Import Devices
            </Button>

            <Tooltip title="[serialNumber, badgeNumber, receivedDate, handoverDate, note]">
              <Button
                startIcon={<UploadFileIcon />}
                onClick={() => handleImport('DevicesUserList')}
                variant="outlined"
              >
                Import Device Users
              </Button>
            </Tooltip>

            <Button
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              variant="outlined"
            >
              Export Devices
            </Button>

            <Button
              variant="contained"
              onClick={() => router.push('/main/devices/new')}
            >
              Add New Device
            </Button>
          </Stack>

          <TextField
            placeholder="Search by serialNumber, model or badge number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ maxWidth: 400, mb: 2 }}
          />

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <CircularProgress size={60} />
            </Box>
          ) : devices.length === 0 && search === '' ? (
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              mt={6}
            >
              No devices found. Add a new device or import data.
            </Typography>
          ) : devices.length === 0 && search !== '' ? (
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              mt={6}
            >
              No devices found matching your search criteria.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    {[
                      { id: 'serialNumber', label: 'Serial Number', width: 120 },
                      { id: 'category', label: 'Category', width: 80 },
                      { id: 'model', label: 'Model', width: 100 },
                      { id: 'manufacture', label: 'Manufacture', width: 120 },
                      { id: 'description', label: 'Description', width: 150 },
                      { id: 'status', label: 'Status', width: 80 },
                      { id: 'users', label: 'Current User', width: 250 }, // Renamed column header
                    ].map(({ id, label, width }) => (
                      <TableCell
                        key={id}
                        sx={{ minWidth: width, cursor: id !== 'users' ? 'pointer' : 'default' }}
                        sortDirection={sortField === id ? (sortAsc ? 'asc' : 'desc') : false}
                        onClick={id !== 'users' ? () => handleSort(id) : undefined}
                      >
                        {id !== 'users' ? (
                          <TableSortLabel
                            active={sortField === id}
                            direction={sortAsc ? 'asc' : 'desc'}
                          >
                            {label}
                          </TableSortLabel>
                        ) : (
                          label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((device) => {
                    // Find the most recent (current) assignment
                    // Sort by receivedDate to ensure the latest assignment without a handover date is picked
                    const currentUserAssignment = device.users
                      .sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())
                      .find(user => !user.handoverDate || user.handoverDate === 'NULL');

                    // Check if there are any past users (those with a handover date)
                    const hasPastUsers = device.users.some(user => user.handoverDate && user.handoverDate !== 'NULL');

                    return (
                      <TableRow key={device.serialNumber} hover>
                        <TableCell>
                          <Link href={`/main/devices/${device.serialNumber}`} passHref >
                            <Typography
                              component="a"
                              sx={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'none' }}
                            >
                              {device.serialNumber}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>{device.category}</TableCell>
                        <TableCell>{device.model}</TableCell>
                        <TableCell>{device.manufacture}</TableCell>
                        <TableCell>{device.description}</TableCell>
                        <TableCell>{device.status}</TableCell>
                        <TableCell>
                          {currentUserAssignment ? (
                            <Box display="flex" flexDirection="column" gap={0.5}>
                              <Link href={`/main/users/${currentUserAssignment.badgeNumber}`} passHref >
                                <Typography
                                  component="a"
                                  variant="body2"
                                  sx={{ fontWeight: 'bold', textDecoration: 'none', color: '#1976d2', cursor: 'pointer' }}
                                >
                                  {currentUserAssignment.userName || 'Unknown User'} ({currentUserAssignment.badgeNumber})
                                </Typography>
                              </Link>
                              <Typography variant="caption" color="text.secondary">
                                Since: {formatDate(currentUserAssignment.receivedDate)}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    openDialog(device.serialNumber, currentUserAssignment.badgeNumber)
                                  }
                                >
                                  Send Handover Request
                                </Button>
                                {currentUserAssignment.note && (
                                  <Tooltip title={currentUserAssignment.note}>
                                    <InfoOutlinedIcon color="action" sx={{ fontSize: 16, cursor: 'help' }} />
                                  </Tooltip>
                                )}
                              </Stack>
                            </Box>
                          ) : (
                            <Typography color="text.secondary" variant="body2">
                              No Current Assignment
                            </Typography>
                          )}

                          {hasPastUsers && (
                            <Box mt={0.5}>
                                <Link href={`/main/devices/${device.serialNumber}`} passHref >
                                    <Typography
                                        component="a"
                                        variant="caption"
                                        sx={{ textDecoration: 'none', color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        View full history
                                    </Typography>
                                </Link>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              startIcon={<ChevronLeftIcon />}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
            >
              Previous
            </Button>

            <Typography variant="body1">
              Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
            </Typography>

            <Button
              variant="outlined"
              endIcon={<ChevronRightIcon />}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page + 1 >= totalPages || isLoading}
            >
              Next
            </Button>
          </Stack>
          <Dialog open={dialogVisible} onClose={() => setDialogVisible(false)}>
            <DialogTitle>
              Send Handover Request
              <Typography variant="subtitle2" mt={1}>
                To: {selectedBadge} | Device: {selectedDeviceSerial}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <DatePicker
                value={handoverDate}
                onChange={(newDate: React.SetStateAction<Date | null>) => setHandoverDate(newDate)}
                slotProps={{
                  textField: { fullWidth: true, label: 'Handover Date', required: true },
                }}
              />
              <TextField
                label="Note"
                multiline
                rows={3}
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSendHandoverRequest} variant="contained">
                Send
              </Button>
              <Button onClick={() => setDialogVisible(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}