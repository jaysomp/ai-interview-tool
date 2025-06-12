import React, { useState, useMemo } from 'react';
import { Container, Box, Typography, Divider, Paper, AppBar, Toolbar, IconButton, Tooltip, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import StartInterviewForm from './components/StartInterviewForm';
import QuestionsList from './components/QuestionsList';
import AnswerPanel from './components/AnswerPanel';
import ScoreResult from './components/ScoreResult';
import { startInterview, generateQuestions, scoreResponse } from './api';

function App() {
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [score, setScore] = useState(null);
  const [reasoning, setReasoning] = useState('');
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

  const handleStartInterview = async (name, jobTitle, jobDesc) => {
    setUserName(name);
    const id = await startInterview(name, jobTitle, jobDesc);
    setInterviewId(id);
    const qs = await generateQuestions(id);
    setQuestions(qs);
    setSelectedQuestion(null);
    setScore(null);
    setReasoning('');
  };

  const handleSelectQuestion = (q) => {
    setSelectedQuestion(q);
    setScore(null);
    setReasoning('');
  };

  const handleScore = async (transcript) => {
    if (!selectedQuestion) return;
    const res = await scoreResponse(selectedQuestion.question_id, transcript);
    setScore(res.score);
    setReasoning(res.reasoning);
  };

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
        <Paper sx={{ p: 3, mb: 4, maxWidth: 900, mx: 'auto', borderRadius: 0 }}>
          <StartInterviewForm onStart={handleStartInterview} />
        </Paper>
        {interviewId && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="stretch" sx={{ width: '100%', minHeight: 500 }}>
              <Box flex={1} minWidth={270} maxWidth={340} sx={{ alignSelf: 'stretch', display: 'flex' }}>
                <QuestionsList questions={questions} selectedId={selectedQuestion?.question_id} onSelect={handleSelectQuestion} />
              </Box>
              <Box flex={3} minWidth={320} sx={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {selectedQuestion && (
                  <AnswerPanel question={selectedQuestion} onScore={handleScore} userName={userName} />
                )}
                {score !== null && (
                  <ScoreResult score={score} reasoning={reasoning} />
                )}
              </Box>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
