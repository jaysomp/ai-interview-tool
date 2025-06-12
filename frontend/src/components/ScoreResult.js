import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function ScoreResult({ score, reasoning }) {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Score</Typography>
      <Typography variant="h4" color="primary">{score}</Typography>
      <Typography variant="body1" mt={2}>{reasoning}</Typography>
    </Paper>
  );
}
