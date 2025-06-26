import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Stack, 
  Box, 
  Chip,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  Person, 
  Work, 
  Business, 
  Description,
  QuestionAnswer,
  Psychology,
  TrendingUp,
  Schedule
} from '@mui/icons-material';
import { getInterviewDetail } from '../api';

function HistoryDetail() {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getInterviewDetail(interviewId);
        setInterview(data);
      } catch (error) {
        console.error('Failed to fetch interview detail:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
  }, [interviewId]);

  const getScoreColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'info';
    if (score >= 4) return 'warning';
    return 'error';
  };

  const calculateAverageScore = () => {
    const scores = interview.questions
      .map(q => q.score)
      .filter(score => score !== null && score !== undefined);
    
    if (scores.length === 0) return null;
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading interview details...
        </Typography>
      </Container>
    );
  }

  if (!interview) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Interview not found</Typography>
        <Button onClick={() => navigate('/history')} sx={{ mt: 2 }}>
          Back to History
        </Button>
      </Container>
    );
  }

  const averageScore = calculateAverageScore();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Button
        onClick={() => navigate('/history')}
        startIcon={<ArrowBack />}
        sx={{ mb: 3, borderRadius: 2 }}
        variant="outlined"
      >
        Back to History
      </Button>

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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              Interview Session Details
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Person color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {interview.name}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Work color="action" fontSize="small" />
                <Typography variant="body1" color="text.secondary">
                  {interview.job_title}
                </Typography>
              </Stack>
              
              {interview.company_name && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Business color="action" fontSize="small" />
                  <Typography variant="body1" color="text.secondary">
                    {interview.company_name}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Schedule color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {new Date(interview.created_at).toLocaleString()}
              </Typography>
            </Stack>

            {averageScore && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<TrendingUp />}
                  label={`Average Score: ${averageScore}/10`}
                  color={getScoreColor(parseFloat(averageScore))}
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`${interview.questions.length} Questions`}
                  variant="outlined"
                  color="primary"
                />
              </Stack>
            )}
          </Box>

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Description color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Job Description
              </Typography>
            </Stack>
            <Typography 
              variant="body1" 
              sx={{ 
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 2,
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}
            >
              {interview.job_description}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuestionAnswer color="primary" />
          Questions & Answers
        </Typography>

        {interview.questions.map((q, index) => (
          <Card
            key={q.question_id}
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Question {index + 1}
                    </Typography>
                    {q.score !== null && q.score !== undefined && (
                      <Chip
                        label={`${q.score}/10`}
                        color={getScoreColor(q.score)}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Stack>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '1.1rem',
                      p: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    {q.question_text}
                  </Typography>
                </Box>

                {q.answer && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Your Answer
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        p: 2,
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        borderRadius: 2,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {q.answer}
                    </Typography>
                  </Box>
                )}

                {q.reasoning && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Psychology color="primary" />
                        AI Feedback
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          p: 2,
                          backgroundColor: alpha(theme.palette.success.main, 0.04),
                          borderRadius: 2,
                          lineHeight: 1.7,
                          whiteSpace: 'pre-line',
                          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                        }}
                      >
                        {q.reasoning}
                      </Typography>
                    </Box>
                  </>
                )}

                {(!q.answer || q.score === null) && (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {!q.answer ? 'No answer provided' : 'Not scored yet'}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default HistoryDetail;
