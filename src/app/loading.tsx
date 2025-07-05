// src/app/loading.tsx 
'use client';

import { Spinner, makeStyles, tokens } from '@fluentui/react-components';
import React from 'react';

const useStyles = makeStyles({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column', // or 'row' if you prefer horizontal centering only
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center',     // Centers vertically
    minHeight: '80vh',        // Takes up most of the viewport height
    width: '100%',            // Takes full width
    // Optional: Match your global background color for a smoother transition
    backgroundColor: tokens.colorNeutralBackground1,
  },
  // You can add styles directly to the spinner if needed
  // spinner: {
  //   // e.g., marginTop: tokens.spacingVerticalM,
  // }
});

const Loading = () => { // Renamed component to 'Loading' for convention
  const styles = useStyles();
  return (
    <div className={styles.loadingContainer}>
      <Spinner labelPosition="after" label="Loading . . ." />
    </div>
  );
};

export default Loading;