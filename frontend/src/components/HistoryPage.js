import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  CardActionArea,
  Stack,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  History, 
  Person, 
  Work, 
  Business, 
  Schedule,
  ChevronRight,
  SearchOff,
  DeleteForever
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getInterviewHistory, clearHistory } from '../api';

function HistoryPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getInterviewHistory();
        setInterviews(data);
      } catch (error) {
        console.error('Failed to fetch interview history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleClearHistory = async () => {
    console.log('Clear history button clicked');
    setClearing(true);
    try {
      console.log('Calling clearHistory API...');
      const result = await clearHistory();
      console.log('Clear history result:', result);
      setInterviews([]);
      setClearDialogOpen(false);
      console.log('Successfully cleared history');
    } catch (error) {
      console.error('Failed to clear history:', error);
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading interview history...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <History color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Interview History
            </Typography>
          </Stack>
          {interviews.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForever />}
              onClick={() => setClearDialogOpen(true)}
              sx={{ 
                borderRadius: 2,
                px: 2,
                py: 1
              }}
            >
              Clear All
            </Button>
          )}
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Review your past interview sessions and track your progress over time.
        </Typography>
      </Paper>

      {interviews.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: alpha(theme.palette.primary.main, 0.02),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <SearchOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            No Interview History
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't completed any interview sessions yet. Start your first practice session to see your progress here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Start Your First Interview
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {interviews.map((interview) => (
            <Card
              key={interview.interview_id}
              elevation={0}
              sx={{
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/history/${interview.interview_id}`)}
                sx={{ p: 0 }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Person color="primary" fontSize="small" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {interview.name}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Work color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {interview.job_title}
                          </Typography>
                        </Stack>
                        
                        {interview.company_name && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Business color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {interview.company_name}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Schedule color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(interview.created_at)}
                        </Typography>
                        <Chip
                          label="View Details"
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Stack>
                    </Box>
                    
                    <ChevronRight color="action" />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Clear All Interview History?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will permanently delete all your interview sessions, questions, and scores. 
            This cannot be undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setClearDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearHistory}
            variant="contained"
            color="error"
            disabled={clearing}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {clearing ? 'Clearing...' : 'Clear All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default HistoryPage;
