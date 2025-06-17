import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

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
    <form onSubmit={handleSubmit} style={{
      background: 'rgba(24,26,32,0.92)',
      color: '#ececec',
      borderRadius: 24,
      maxWidth: 480,
      margin: '48px auto',
      padding: '36px 28px',
      boxShadow: '0 8px 32px 0 rgba(142,36,170,0.20)',
      border: '1.5px solid rgba(142,36,170,0.10)',
      backdropFilter: 'blur(10px)',
      fontFamily: 'Inter, Noto Sans, sans-serif',
    }}>
      <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 3, color: '#fff', fontFamily: 'Inter, Noto Sans, sans-serif' }}>
        Practice Interviews with AI
      </Typography>
      <div style={{ marginBottom: 24 }}>
        <Typography sx={{ color: '#c5d0e6', fontWeight: 600, mb: 1 }}>Your Name</Typography>
        <TextField
          placeholder="First and last name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={{
            input: { color: '#fff', background: '#23242b', borderRadius: 2 },
            fieldset: { borderColor: '#3d4d5c' },
            mb: 2,
          }}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Typography sx={{ color: '#c5d0e6', fontWeight: 600, mb: 1 }}>Company Name</Typography>
        <TextField
          placeholder="The company name"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={{
            input: { color: '#fff', background: '#23242b', borderRadius: 2 },
            fieldset: { borderColor: '#3d4d5c' },
            mb: 2,
          }}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Typography sx={{ color: '#c5d0e6', fontWeight: 600, mb: 1 }}>Job Title</Typography>
        <TextField
          placeholder="What's the role called?"
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={{
            input: { color: '#fff', background: '#23242b', borderRadius: 2 },
            fieldset: { borderColor: '#3d4d5c' },
            mb: 2,
          }}
        />
      </div>
      <div style={{ marginBottom: 32 }}>
        <Typography sx={{ color: '#c5d0e6', fontWeight: 600, mb: 1 }}>Job Description</Typography>
        <TextField
          placeholder="Tell us about the role"
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
          fullWidth
          required
          multiline
          minRows={4}
          variant="outlined"
          sx={{
            textarea: { color: '#fff', background: '#23242b', borderRadius: 2 },
            fieldset: { borderColor: '#3d4d5c' },
          }}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        sx={{
          minWidth: 140,
          height: 48,
          fontWeight: 700,
          fontSize: '1.1rem',
          borderRadius: '14px',
          background: 'linear-gradient(90deg, #6d1b7b 0%, #8e24aa 100%)',
          color: '#fff',
          boxShadow: '0 2px 8px 0 rgba(140,60,200,0.10)',
          textTransform: 'none',
          letterSpacing: 0.5,
          transition: 'background 0.2s',
          '&:hover': {
            background: 'linear-gradient(90deg, #8e24aa 0%, #6d1b7b 100%)',
            boxShadow: '0 2px 12px 0 rgba(140,60,200,0.18)',
          },
        }}
      >
        Generate Questions
      </Button>
    </form>
  );
}
