import React, { useState } from 'react';
import { Typography, Button, LinearProgress, Box, Paper, Stack, Chip, useTheme, alpha, Divider } from '@mui/material';
import { CheckCircleOutline, HelpOutline, AddCircleOutline, ExpandMore, ExpandLess } from '@mui/icons-material';
import AnswerPanel from './AnswerPanel';
import ScoreResult from './ScoreResult';

export default function InterviewSession({ questions, answers, scores, onAnswer, onScore, progress, userName, onGenerateMore }) {
  const theme = useTheme();
  const answeredCount = Object.keys(answers).length;
  const scoredCount = Object.keys(scores).length;
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Stack spacing={3}>
          <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Interview Practice Session
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hello {userName}! Answer the questions below and get AI-powered feedback.
            </Typography>
          </Box>

          <Box>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Chip
                label={`${questions.length} Questions`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`${answeredCount} Answered`}
                color={answeredCount === questions.length ? "success" : "default"}
                variant="outlined"
                size="small"
              />
              <Chip
                label={`${scoredCount} Scored`}
                color={scoredCount === questions.length ? "success" : "default"}
                variant="outlined"
                size="small"
              />
            </Stack>
            
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            />
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 1 }}>
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.question_id];
          const isScored = !!scores[q.question_id];
          const isExpanded = expandedQuestion === q.question_id;
          
          return (
            <Paper
              key={q.question_id}
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                background: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.primary.main, isScored ? 0.3 : 0.1)}`,
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <Stack spacing={3}>
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.question_id)}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HelpOutline color="primary" fontSize="small" />
                      Question {idx + 1}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {isAnswered && (
                        <Chip
                          label="Answered"
                          size="small"
                          color="success"
                          variant="outlined"
                          icon={<CheckCircleOutline />}
                        />
                      )}
                      {isScored && (
                        <Chip
                          label={`Score: ${scores[q.question_id]?.score || 0}/10`}
                          size="small"
                          color="primary"
                          variant="filled"
                        />
                      )}
                      {isExpanded ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                    </Stack>
                  </Stack>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.6,
                      p: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    {q.question_text}
                  </Typography>
                </Box>

                {isExpanded && (
                  <Box onClick={(e) => e.stopPropagation()}>
                    <AnswerPanel
                      question={q}
                      transcript={answers[q.question_id] || ''}
                      onTranscript={t => onAnswer(q.question_id, t)}
                      userName={userName}
                      scoring={!!scores[q.question_id]}
                      disabled={!!scores[q.question_id]}
                    />

                    {!isScored && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            onScore(q.question_id);
                          }}
                          disabled={!isAnswered}
                          sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          {isAnswered ? 'Get AI Feedback' : 'Answer Required'}
                        </Button>
                      </Box>
                    )}

                    {isScored && (
                      <>
                        <Divider sx={{ mt: 2 }} />
                        <ScoreResult 
                          score={scores[q.question_id].score} 
                          reasoning={scores[q.question_id].reasoning} 
                        />
                      </>
                    )}
                  </Box>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={typeof onGenerateMore === 'function' ? onGenerateMore : undefined}
          startIcon={<AddCircleOutline />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          Generate More Questions
        </Button>
      </Box>
    </Box>
  );
}
