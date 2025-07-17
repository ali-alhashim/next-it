'use client';
import {
  Box,
  Typography,
  Avatar,
  Grid, // Make sure Grid is imported
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card
} from '@mui/material';
import { useEffect, useState } from 'react';

// ... (Card component remains the same)

export default function DashboardPage() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    badgeNumber: string;
    photo: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/users/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const assets = [
    { type: 'Laptop', model: 'Dell Latitude', receivedDate: 'May-03-2025', handoverDate: '' },
    { type: 'Monitor', model: 'HP 24"', receivedDate: 'July-06-2025', handoverDate: '' },
    { type: 'Phone', model: 'iPhone 12', receivedDate: 'June-24-2024', handoverDate: 'July-06-2025' },
  ];

  const tickets = [
    { id: '1234', subject: 'Laptop not working', status: 'OPEN' },
    { id: '1235', subject: 'Request new email', status: 'CLOSED' },
  ];

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome to Next-IT Dashboard
      </Typography>

     
      <Grid container spacing={3}>
       
        <Grid item xs={12} md={6}>
          <Card title="User Information">
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Avatar
                src={`/api/${user?.photo || 'uploads/default.png'}`}
                sx={{ width: 100, height: 100 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.name ?? 'Loading...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Badge: {user?.badgeNumber ?? 'Loading...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {user?.email ?? 'Loading...'}
                </Typography>
                {user?.role && (
                  <Typography variant="body2" color="text.secondary">
                    Role: {user.role}
                  </Typography>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card title="My IT Assets">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Received Date</TableCell>
                    <TableCell>Handover Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>{asset.model}</TableCell>
                      <TableCell>{asset.receivedDate}</TableCell>
                      <TableCell>{asset.handoverDate || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card title="My Tickets">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}