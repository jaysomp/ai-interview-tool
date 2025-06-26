import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import {
  Close,
  Mic,
  Quiz,
  Analytics,
  History,
  GitHub,
  Star
} from '@mui/icons-material';

export default function WelcomePopup({ open, onClose }) {
  const theme = useTheme();

  const features = [
    {
      icon: <Quiz color="primary" />,
      title: "AI-Generated Questions",
      description: "Get personalized interview questions based on your job description"
    },
    {
      icon: <Mic color="primary" />,
      title: "Voice Recording",
      description: "Practice with voice recording or type your responses"
    },
    {
      icon: <Analytics color="primary" />,
      title: "Instant Feedback",
      description: "Receive AI-powered feedback and scoring on your answers"
    },
    {
      icon: <History color="primary" />,
      title: "Session History",
      description: "Track your progress and review past interview sessions"
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.background.paper, 0.95)})`,
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Welcome to{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Stature
              </span>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your local AI-powered interview practice tool
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="large">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              🚀 Key Features
            </Typography>
            <Stack spacing={2}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ mt: 0.5 }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>


          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Stature is open source and always will be
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                size="small"
                startIcon={<GitHub />}
                onClick={() => window.open('https://github.com/jaysomp/ai-interview-tool', '_blank')}
                sx={{ textTransform: 'none' }}
              >
                View on GitHub
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Star />}
                onClick={() => window.open('https://github.com/jaysomp/ai-interview-tool', '_blank')}
                sx={{ textTransform: 'none' }}
              >
                Star the Repo
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
          }}
        >
          Get Started
        </Button>
      </DialogActions>
    </Dialog>
  );
}