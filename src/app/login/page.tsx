'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/seed'); // triggers only on load
  }, []);

  const handleLogin = async () => {
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      badgeNumber,
      password,
    });

    console.log('signIn response:', res);

    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      router.push('/main');
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f3f2f1"
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Login to Next-IT
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Badge Number"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button variant="contained" fullWidth onClick={handleLogin}>
              Login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
