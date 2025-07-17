'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Stack as MuiStack,
} from '@mui/material';

type User = {
  name: string;
  email: string;
  badgeNumber: string;
  role: string;
  photo?: string;
};

const UserDetails = () => {
  const { badgeNumber } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${badgeNumber}`, { credentials: 'include' });
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (badgeNumber) {
      fetchUser();
    }
  }, [badgeNumber]);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">User not found.</Typography>
      </Box>
    );
  }

  return (
    <MuiStack spacing={2} sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h4">User Details</Typography>

      {user.photo && (
        <Avatar
          src={`/api/${user.photo}`}
          sx={{ width: 100, height: 100 }}
        />
      )}

      <Typography variant="body1">
        <strong>Name:</strong> {user.name}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {user.email}
      </Typography>
      <Typography variant="body1">
        <strong>Badge Number:</strong> {user.badgeNumber}
      </Typography>
      <Typography variant="body1">
        <strong>Role:</strong> {user.role}
      </Typography>
    </MuiStack>
  );
};

export default UserDetails;
