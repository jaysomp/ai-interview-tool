import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, Chip, Divider } from '@mui/material';

export default function ScoreResult({ score, reasoning }) {
  const theme = useTheme();
  let scoreColor = 'default';
  if (score >= 8) scoreColor = 'success';
  else if (score >= 5) scoreColor = 'warning';
  else scoreColor = 'error';

  return (
    <Card elevation={3} sx={{ mt: 4, borderRadius: 0, background: theme.palette.background.paper, boxShadow: theme.shadows[4] }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography variant="h6" sx={{ fontWeight: 700, mr: 2 }}>Score:</Typography>
          <Chip label={score} color={scoreColor} size="medium" sx={{ fontSize: '1.2rem', fontWeight: 700, px: 2, py: 1, fontFamily: 'monospace', letterSpacing: 1.2 }} />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>AI Reasoning</Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.08rem' }}>{reasoning}</Typography>
      </CardContent>
    </Card>
  );
}
