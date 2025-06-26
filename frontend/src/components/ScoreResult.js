import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, Chip, Divider, Stack, LinearProgress, alpha } from '@mui/material';
import { TrendingUp, Psychology, CheckCircle, Warning, Error } from '@mui/icons-material';

export default function ScoreResult({ score, reasoning }) {
  const theme = useTheme();
  
  let scoreColor = 'default';
  let scoreIcon = <CheckCircle />;
  let scoreLabel = 'Good';
  
  if (score >= 8) {
    scoreColor = 'success';
    scoreIcon = <CheckCircle />;
    scoreLabel = 'Excellent';
  } else if (score >= 6) {
    scoreColor = 'info';
    scoreIcon = <TrendingUp />;
    scoreLabel = 'Good';
  } else if (score >= 4) {
    scoreColor = 'warning';
    scoreIcon = <Warning />;
    scoreLabel = 'Needs Improvement';
  } else {
    scoreColor = 'error';
    scoreIcon = <Error />;
    scoreLabel = 'Poor';
  }

  const scorePercentage = (score / 10) * 100;

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        background: alpha(theme.palette.success.main, 0.02),
        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Psychology color="primary" />
              AI Feedback
            </Typography>
            
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: `${scoreColor}.main` }}>
                  {score}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  / 10
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={scorePercentage}
                  color={scoreColor}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette[scoreColor].main, 0.1),
                  }}
                />
              </Box>
              
              <Chip
                icon={scoreIcon}
                label={scoreLabel}
                color={scoreColor}
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
              Detailed Analysis
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-line', 
                lineHeight: 1.7,
                color: 'text.secondary',
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              {reasoning}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
