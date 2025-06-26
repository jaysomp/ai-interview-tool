import React, { useState, useMemo, useEffect } from 'react';
import { Container, Box, Typography, Divider, Paper, AppBar, Toolbar, IconButton, Tooltip, CssBaseline, Stack, alpha } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7, History } from '@mui/icons-material';
import StartInterviewForm from './components/StartInterviewForm';
import InterviewSession from './components/InterviewSession';
import AnswerPanel from './components/AnswerPanel';
import ScoreResult from './components/ScoreResult';
import WelcomePopup from './components/WelcomePopup';
import { startInterview, generateQuestions, scoreResponse } from './api';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HistoryPage from './components/HistoryPage';
import HistoryDetail from './components/HistoryDetail';

function AppContent() {
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { [question_id]: transcript }
  const [scores, setScores] = useState({}); // { [question_id]: { score, reasoning } }
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  // Check if user is visiting for the first time
  useEffect(() => {
    const hasVisited = localStorage.getItem('stature_has_visited');
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('stature_has_visited', 'true');
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { 
        main: mode === 'dark' ? '#64748b' : '#475569',
        light: mode === 'dark' ? '#94a3b8' : '#64748b',
        dark: mode === 'dark' ? '#334155' : '#1e293b',
      },
      secondary: {
        main: mode === 'dark' ? '#06b6d4' : '#0891b2',
        light: mode === 'dark' ? '#22d3ee' : '#0ea5e9',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f8fafc' : '#1e293b',
        secondary: mode === 'dark' ? '#cbd5e1' : '#64748b',
      },
      grey: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.025em', fontSize: '3.5rem' },
      h2: { fontWeight: 800, letterSpacing: '-0.025em', fontSize: '2.5rem' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2rem' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.5rem' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.25rem' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.125rem' },
      body1: { fontSize: '1rem', lineHeight: 1.7 },
      body2: { fontSize: '0.875rem', lineHeight: 1.6 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.025em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: mode === 'dark' ? '#475569 #1e293b' : '#cbd5e1 #f8fafc',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'dark' ? '#1e293b' : '#f8fafc',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'dark' ? '#475569' : '#cbd5e1',
              borderRadius: 4,
              '&:hover': {
                backgroundColor: mode === 'dark' ? '#64748b' : '#94a3b8',
              },
            },
          },
        },
      },
      MuiPaper: { 
        styleOverrides: { 
          root: { 
            boxShadow: mode === 'dark' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backgroundImage: 'none',
          } 
        } 
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 4px 12px rgba(100, 116, 139, 0.4)' 
                : '0 4px 12px rgba(71, 85, 105, 0.3)',
            },
          },
          contained: {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)' 
              : 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
            '&:hover': {
              background: mode === 'dark' 
                ? 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)' 
                : 'linear-gradient(135deg, #334155 0%, #475569 100%)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: mode === 'dark' ? '#334155' : '#f8fafc',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#64748b' : '#475569',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#94a3b8' : '#64748b',
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: mode === 'dark' ? '#334155' : '#e2e8f0',
          },
          bar: {
            borderRadius: 8,
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, #64748b 0%, #94a3b8 100%)' 
              : 'linear-gradient(90deg, #475569 0%, #64748b 100%)',
          },
        },
      },
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
      <WelcomePopup open={showWelcome} onClose={handleWelcomeClose} />
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mb: 0
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <Typography
            variant="h5"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800, 
              letterSpacing: '-1px', 
              color: theme.palette.text.primary,
              cursor: 'pointer',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textDecoration: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            component={Link}
            to="/"
            onClick={() => {
              setInterviewId(null);
              setQuestions([]);
              setAnswers({});
              setScores({});
              setUserName('');
              navigate('/');
            }}
          >
            Stature
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton 
                onClick={handleToggleTheme} 
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Interview History">
              <IconButton 
                component={Link} 
                to="/history"
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <History />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={
          <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, minHeight: '90vh' }}>
            {!interviewId ? (
              <Box sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                mt: { xs: 2, md: 6 },
                px: { xs: 2, md: 0 }
              }}>
                <StartInterviewForm onStart={handleStartInterview} />
              </Box>
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
        } />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:interviewId" element={<HistoryDetail />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
