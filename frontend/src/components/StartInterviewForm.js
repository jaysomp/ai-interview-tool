import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function StartInterviewForm({ onStart }) {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && jobTitle && jobDesc && companyName) {
      await onStart(name, jobTitle, jobDesc, companyName);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" mb={2}>Start Interview</Typography>
      <TextField
        label="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Company Name"
        value={companyName}
        onChange={e => setCompanyName(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField label="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} fullWidth margin="normal" required />
      <TextField label="Job Description" value={jobDesc} onChange={e => setJobDesc(e.target.value)} fullWidth margin="normal" required multiline rows={4} />
      <Button
        type="submit"
        variant="contained"
        sx={{
          mt: 2,
          minWidth: 90,
          height: 34,
          fontWeight: 600,
          fontSize: '0.95rem',
          borderRadius: '20px',
          paddingY: 0.7,
          paddingX: 2,
          background: '#8e24aa',
          color: '#fff',
          boxShadow: 'none',
          transition: 'background 0.2s',
          '&:hover': {
            background: '#6d1b7b',
            boxShadow: 'none',
          },
          '&:disabled': {
            background: '#8e24aa',
            color: '#ececec',
            opacity: 0.5,
          },
        }}
      >
        Start Interview
      </Button>
    </Box>
  );
}
