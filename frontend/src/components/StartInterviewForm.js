import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Stack, Divider, useTheme, alpha } from '@mui/material';
import { WorkOutline, PersonOutline, Business, Description } from '@mui/icons-material';

export default function StartInterviewForm({ onStart }) {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && jobTitle && jobDesc && companyName && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onStart(name, jobTitle, jobDesc, companyName);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid = name && jobTitle && jobDesc && companyName;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        },
      }}
    >
      <Stack spacing={3}>
        <Box textAlign="center" sx={{ mb: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Practice Interviews with AI
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Get personalized interview questions and AI-powered feedback to improve your skills
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOutline color="primary" fontSize="small" />
                  Your Name
                </Typography>
                <TextField
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  disabled={isSubmitting}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" fontSize="small" />
                  Company Name
                </Typography>
                <TextField
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  disabled={isSubmitting}
                />
              </Box>
            </Stack>

            <Box>
              <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkOutline color="primary" fontSize="small" />
                Job Title
              </Typography>
              <TextField
                placeholder="e.g., Software Engineer, Product Manager"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                fullWidth
                required
                variant="outlined"
                disabled={isSubmitting}
              />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description color="primary" fontSize="small" />
                Job Description
              </Typography>
              <TextField
                placeholder="Paste the job description here, or describe the role requirements and responsibilities..."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                fullWidth
                required
                multiline
                minRows={4}
                maxRows={8}
                variant="outlined"
                disabled={isSubmitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& textarea': {
                      resize: 'vertical',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!isFormValid || isSubmitting}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                  '&:disabled': {
                    background: alpha(theme.palette.primary.main, 0.3),
                    color: alpha(theme.palette.primary.contrastText, 0.7),
                  },
                }}
              >
                {isSubmitting ? 'Generating Questions...' : 'Start Interview Practice'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              We'll generate personalized questions based on your job description and provide AI-powered feedback on your responses.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
