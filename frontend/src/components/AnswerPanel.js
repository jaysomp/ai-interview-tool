import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Paper, Chip, CircularProgress, Fade, useTheme, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';

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
    <Paper sx={{ p: { xs: 2, md: 3 }, mt: 2, borderRadius: 2, background: theme.palette.background.paper, boxShadow: theme.shadows[1] }} elevation={0}>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <Tooltip title={recording ? 'Recording...' : 'Start recording'}>
          <span>
            <Button
              onClick={startRecording}
              disabled={recording || disabled || scoring}
              variant="contained"
              color="primary"
              sx={{
                minWidth: 44,
                height: 44,
                borderRadius: '50%',
                p: 0,
                boxShadow: recording ? `0 0 0 4px ${theme.palette.primary.light}` : 'none',
                animation: recording ? 'pulse 1.2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { boxShadow: `0 0 0 0 ${theme.palette.primary.light}` },
                  '70%': { boxShadow: `0 0 0 10px rgba(0,0,0,0)` },
                  '100%': { boxShadow: `0 0 0 0 ${theme.palette.primary.light}` },
                },
              }}
              disableElevation
            >
              <MicIcon sx={{ color: recording ? theme.palette.error.main : theme.palette.primary.contrastText, fontSize: 28 }} />
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Stop recording">
          <span>
            <Button
              onClick={stopRecording}
              disabled={!recording || disabled || scoring}
              variant="outlined"
              color="error"
              sx={{ minWidth: 44, height: 44, borderRadius: '50%', p: 0 }}
            >
              <StopCircleIcon sx={{ fontSize: 28 }} />
            </Button>
          </span>
        </Tooltip>
        {recording && <Chip label="LIVE" color="error" size="small" sx={{ fontWeight: 700, ml: 1, letterSpacing: 1, animation: 'blink 1s steps(2, start) infinite' }} />}
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Transcript</Typography>
        <Box sx={{
          background: theme.palette.mode === 'dark' ? '#23242b' : '#f3eaff',
          borderRadius: 2,
          p: 2,
          mb: 1,
        }}>
          <textarea
            value={transcript}
            onChange={e => onTranscript(e.target.value)}
            placeholder="Type your answer or use the mic..."
            disabled={scoring || disabled}
            style={{
              width: '100%',
              minHeight: 72,
              background: 'transparent',
              color: theme.palette.text.primary,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
