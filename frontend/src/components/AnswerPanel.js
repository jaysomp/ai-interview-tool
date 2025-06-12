import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Paper, Chip, CircularProgress, Fade, useTheme, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';

export default function AnswerPanel({ question, onScore, userName }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [scoring, setScoring] = useState(false);
  const [liveWords, setLiveWords] = useState([]);
  const recognitionRef = useRef(null);
  const theme = useTheme();

  const startRecording = () => {
    setTranscript('');
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
      // Concatenate all results for a longer transcript
      let fullTranscript = '';
      let words = [];
      for (let i = 0; i < event.results.length; ++i) {
        const t = event.results[i][0].transcript;
        fullTranscript += t + ' ';
        words = fullTranscript.trim().split(' ');
      }
      setTranscript(fullTranscript.trim());
      setLiveWords(words);
    };
    recognition.onerror = (event) => {
      alert('Speech recognition error: ' + event.error);
      setRecording(false);
    };
    recognition.onend = () => {
      // If still recording, auto-restart (prevents Chrome's auto-stop from ending session)
      if (recording) {
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



  const handleScore = async () => {
    if (recording) {
      stopRecording();
    }
    setScoring(true);
    await onScore(transcript);
    setScoring(false);
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mt: 2, borderRadius: 0, background: theme.palette.background.paper, boxShadow: theme.shadows[3] }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Answer</Typography>
      <Typography variant="subtitle1" mb={2} color="text.secondary">{question.question_text}</Typography>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <Tooltip title={recording ? 'Recording...' : 'Start recording'}>
          <span>
            <Button
              onClick={startRecording}
              disabled={recording}
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
              disabled={!recording}
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
          borderRadius: 0,
          border: `1.5px solid ${theme.palette.primary.light}`,
          fontFamily: 'monospace',
          color: theme.palette.text.primary,
          boxShadow: '0 1px 8px 0 rgba(140,60,200,0.02)',
          minHeight: 80,
          maxHeight: 180,
          overflowY: 'auto',
          px: 2,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.7,
        }}>
          {(recording || transcript) ? (
            <Fade in={!!(recording || transcript)}>
              <span>
                {(() => {
                  // Split transcript into lines (simulate line-by-line, e.g. every 10 words)
                  let lines = [];
                  const chunkSize = 10;
                  for (let i = 0; i < liveWords.length; i += chunkSize) {
                    lines.push(liveWords.slice(i, i + chunkSize).join(' '));
                  }
                  if (lines.length === 0 && transcript) lines = [transcript];
                  return lines.length > 0 ? lines.map((line, idx) => (
                    <Box key={idx} sx={{
                      background: theme.palette.mode === 'dark' ? '#181a20' : '#fff',
                      borderRadius: 0,
                      px: 1.2,
                      py: 0.7,
                      mb: 0.5,
                      fontSize: '1.06rem',
                      fontWeight: idx === lines.length - 1 && recording ? 700 : 500,
                      color: idx === lines.length - 1 && recording ? theme.palette.primary.main : undefined,
                      boxShadow: idx === lines.length - 1 && recording ? '0 0 6px 0 #b388ff44' : 'none',
                      letterSpacing: 0.2,
                      transition: 'all 0.18s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 0.5,
                    }}>
                      <span style={{ fontWeight: 700, color: theme.palette.secondary.main, marginRight: 6 }}>
                        {userName ? userName + ':' : ''}
                      </span>
                      <span>{line}</span>
                    </Box>
                  )) : <span style={{ color: theme.palette.text.disabled }}>Start speaking to see transcript...</span>;
                })()}
              </span>
            </Fade>
          ) : (
            <Typography variant="body2" color="text.disabled">Transcript will appear here</Typography>
          )}
        </Box>
      </Box>
      <Button
        onClick={handleScore}
        disabled={(!recording && !transcript) || scoring}
        variant="contained"
        color="secondary"
        sx={{
          mt: 1,
          minWidth: 130,
          fontWeight: 700,
          borderRadius: 3,
          fontSize: '1rem',
          boxShadow: 'none',
          letterSpacing: 0.5,
        }}
        endIcon={scoring && <CircularProgress size={18} color="inherit" />}
      >
        {scoring ? 'Scoring...' : 'Submit & Score'}
      </Button>
    </Paper>
  );
}
