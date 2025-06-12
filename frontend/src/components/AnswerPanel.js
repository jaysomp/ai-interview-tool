import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';

export default function AnswerPanel({ question, onScore }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [scoring, setScoring] = useState(false);
  const recognitionRef = useRef(null);

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
      for (let i = 0; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }
      setTranscript(fullTranscript.trim());
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
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Answer</Typography>
      <Typography variant="subtitle1" mb={2}>{question.question_text}</Typography>
      <Box display="flex" gap={2} alignItems="center">
        <Button
          onClick={startRecording}
          disabled={recording}
          variant="contained"
          sx={{
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
          Start
        </Button>
        <Typography variant="body2">{recording ? 'Recording...' : transcript ? `Transcript: ${transcript}` : ''}</Typography>
      </Box>
      <Button
        onClick={handleScore}
        disabled={(!recording && !transcript) || scoring}
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
        {scoring ? 'Scoring...' : 'Submit & Score'}
      </Button>
    </Paper>
  );
}
