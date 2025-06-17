import React, { useState, useMemo } from 'react';
import { Container, Box, Typography, Divider, Paper, AppBar, Toolbar, IconButton, Tooltip, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import StartInterviewForm from './components/StartInterviewForm';
import InterviewSession from './components/InterviewSession';
import AnswerPanel from './components/AnswerPanel';
import ScoreResult from './components/ScoreResult';
import { startInterview, generateQuestions, scoreResponse } from './api';

function App() {
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { [question_id]: transcript }
  const [scores, setScores] = useState({}); // { [question_id]: { score, reasoning } }
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const [userName, setUserName] = useState('');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#90caf9' : '#8e24aa' },
      background: {
        default: mode === 'dark' ? '#181a20' : '#f7f6fa',
        paper: mode === 'dark' ? '#23242b' : '#fff',
      },
    },
    shape: { borderRadius: 0 },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h3: { fontWeight: 800, letterSpacing: '-1px' },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)' } } },
    },
  }), [mode]);

  const handleToggleTheme = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const handleStartInterview = async (name, jobTitle, jobDesc, companyName) => {
    setUserName(name);
    const id = await startInterview(name, jobTitle, jobDesc, companyName);
    setInterviewId(id);
    const qs = await generateQuestions(id);
    setQuestions(qs);
    setAnswers({});
    setScores({});
  };

  // Called when the user submits an answer for a question
  const handleAnswer = (question_id, transcript) => {
    setAnswers(prev => ({ ...prev, [question_id]: transcript }));
  };

  const handleScore = async (question_id) => {
    const transcript = answers[question_id];
    if (!transcript) return;
    const res = await scoreResponse(question_id, transcript);
    setScores(prev => ({ ...prev, [question_id]: { score: res.score, reasoning: res.reasoning } }));
  };

  // Calculate progress as % answered
  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-1px', color: 'primary.main' }}>
            AI Interview Practice
          </Typography>
          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={handleToggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4, minHeight: '90vh' }}>
        {!interviewId ? (
          <Paper sx={{ p: 3, mb: 4, maxWidth: 900, mx: 'auto', borderRadius: 0 }}>
            <StartInterviewForm onStart={handleStartInterview} />
          </Paper>
        ) : (
          <InterviewSession
            questions={questions}
            answers={answers}
            scores={scores}
            onAnswer={handleAnswer}
            onScore={handleScore}
            progress={progress}
            userName={userName}
            onGenerateMore={async () => {
              if (!interviewId) return;
              const more = await generateQuestions(interviewId, 3);
              setQuestions(prev => {
                const existingIds = new Set(prev.map(q => q.question_id));
                const existingTexts = new Set(prev.map(q => q.question_text.trim().toLowerCase()));
                const filtered = more.filter(q => !existingIds.has(q.question_id) && !existingTexts.has(q.question_text.trim().toLowerCase()));
                return [...prev, ...filtered];
              });
            }}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
