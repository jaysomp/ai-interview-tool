import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Paper, Chip, CircularProgress, Fade, useTheme, Tooltip, Stack, alpha, InputAdornment, TextField } from '@mui/material';
import { Mic, MicOff, KeyboardVoice, Edit } from '@mui/icons-material';

export default function AnswerPanel({ question, transcript, onTranscript, scoring, disabled, userName }) {
  const [recording, setRecording] = React.useState(false);
  const recognitionRef = React.useRef(null);
  const theme = useTheme();

  // Stop recording when scoring starts
  React.useEffect(() => {
    if (scoring && recording) {
      setRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
    // eslint-disable-next-line
  }, [scoring]);

  // Start recording and update transcript via onTranscript
  const startRecording = () => {
    if (disabled || scoring) return;
    onTranscript('');
    setRecording(true);
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        const t = event.results[i][0].transcript;
        fullTranscript += t + ' ';
      }
      onTranscript(fullTranscript.trim());
    };
    recognition.onerror = (event) => {
      alert('Speech recognition error: ' + event.error);
      setRecording(false);
    };
    recognition.onend = () => {
      if (recording && !disabled && !scoring) {
        recognition.start();
      }
    };
    recognition.start();
  };

  const stopRecording = () => {
    setRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        background: alpha(theme.palette.primary.main, 0.02),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Answer
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Tooltip title={recording ? 'Recording in progress...' : 'Start voice recording'}>
              <span>
                <Button
                  onClick={startRecording}
                  disabled={recording || disabled || scoring}
                  variant={recording ? "contained" : "outlined"}
                  color="primary"
                  sx={{
                    minWidth: 48,
                    height: 48,
                    borderRadius: 2,
                    p: 0,
                    boxShadow: recording ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}` : 'none',
                    animation: recording ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { 
                        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'scale(1)',
                      },
                      '50%': { 
                        boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                        transform: 'scale(1.05)',
                      },
                      '100%': { 
                        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
                        transform: 'scale(1)',
                      },
                    },
                  }}
                >
                  {recording ? <KeyboardVoice sx={{ fontSize: 24 }} /> : <Mic sx={{ fontSize: 24 }} />}
                </Button>
              </span>
            </Tooltip>
            
            {recording && (
              <Tooltip title="Stop recording">
                <Button
                  onClick={stopRecording}
                  variant="outlined"
                  color="error"
                  sx={{ minWidth: 48, height: 48, borderRadius: 2, p: 0 }}
                >
                  <MicOff sx={{ fontSize: 24 }} />
                </Button>
              </Tooltip>
            )}
            
            {recording && (
              <Chip 
                label="Recording..." 
                color="error" 
                size="small" 
                sx={{ 
                  fontWeight: 600,
                  animation: 'blink 1.5s ease-in-out infinite',
                  '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0.5 },
                  },
                }} 
              />
            )}
          </Stack>
          
          {!recording && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click the microphone to record your answer, or type it manually below.
            </Typography>
          )}
        </Box>

        <Box>
          <TextField
            value={transcript}
            onChange={e => onTranscript(e.target.value)}
            placeholder="Type your answer here, or use voice recording above..."
            disabled={scoring || disabled}
            multiline
            minRows={4}
            maxRows={12}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <Edit color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                '& textarea': {
                  resize: 'vertical',
                },
              },
            }}
          />
          
          {transcript && (
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {transcript.split(' ').length} words
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {transcript.length} characters
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
