// src/app/loading.tsx
'use client';

import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      width="100%"
      bgcolor="background.default"
    >
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography variant="body1">Loading . . .</Typography>
      </Box>
    </Box>
  );
};

export default Loading;
