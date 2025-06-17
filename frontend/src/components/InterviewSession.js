import React from 'react';
import { Typography, Button, LinearProgress, Box, Paper } from '@mui/material';
import AnswerPanel from './AnswerPanel';
import ScoreResult from './ScoreResult';

export default function InterviewSession({ questions, answers, scores, onAnswer, onScore, progress, userName, onGenerateMore }) {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, fontFamily: 'Inter, sans-serif' }}>
      <Paper sx={{
        background: 'rgba(24,26,32,0.85)',
        borderRadius: 5,
        p: { xs: 2, md: 4 },
        mb: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
        border: '1.5px solid rgba(142,36,170,0.12)',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Inter, sans-serif',
      }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, mb: 3, letterSpacing: '-0.04em' }}>
          Practice Interviews with AI
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{
          height: 10,
          borderRadius: 5,
          mb: 5,
          background: 'rgba(60,40,80,0.25)',
          boxShadow: '0 2px 16px 0 rgba(142,36,170,0.12)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #8e24aa 0%, #3a1c71 100%)',
            boxShadow: '0 1px 8px 0 rgba(142,36,170,0.18)',
          },
        }} />
        {questions.map((q, idx) => (
          <Box key={q.question_id} sx={{
            mb: 6,
            background: 'rgba(35,36,43,0.85)',
            borderRadius: 4,
            p: { xs: 2, md: 3 },
            boxShadow: '0 4px 24px 0 rgba(142,36,170,0.09)',
            border: '1.5px solid rgba(142,36,170,0.15)',
            backdropFilter: 'blur(6px)',
            fontFamily: 'Inter, sans-serif',
          }}>
            <Typography variant="h6" sx={{ color: '#c5d0e6', fontWeight: 700, mb: 1, letterSpacing: '-0.01em' }}>
              Question {idx + 1}
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.15rem', mb: 2 }}>{q.question_text}</Typography>
            <AnswerPanel
              question={q}
              transcript={answers[q.question_id] || ''}
              onTranscript={t => onAnswer(q.question_id, t)}
              userName={userName}
              scoring={!!scores[q.question_id]}
              disabled={!!scores[q.question_id]}
            />
            <Button
              variant="contained"
              sx={{
                minWidth: 120,
                height: 44,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #6d1b7b 0%, #8e24aa 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px 0 rgba(140,60,200,0.13)',
                textTransform: 'none',
                letterSpacing: 0.5,
                mt: 2,
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #8e24aa 0%, #6d1b7b 100%)',
                  boxShadow: '0 2px 12px 0 rgba(140,60,200,0.18)',
                },
              }}
              onClick={() => onScore(q.question_id)}
              disabled={!answers[q.question_id] || !!scores[q.question_id]}
            >
              Submit for Scoring
            </Button>
            {scores[q.question_id] && (
              <ScoreResult score={scores[q.question_id].score} reasoning={scores[q.question_id].reasoning} />
            )}
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={typeof onGenerateMore === 'function' ? onGenerateMore : undefined}
            sx={{
              minWidth: 220,
              fontWeight: 800,
              fontSize: '1.1rem',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, #6d1b7b 0%, #8e24aa 100%)',
              color: '#fff',
              boxShadow: '0 2px 8px 0 rgba(140,60,200,0.13)',
              textTransform: 'none',
              letterSpacing: 0.5,
              py: 1.3,
              px: 5,
              mt: 2,
              transition: 'background 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #8e24aa 0%, #6d1b7b 100%)',
                boxShadow: '0 2px 12px 0 rgba(140,60,200,0.18)',
              },
            }}
          >
            Generate More Questions
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
