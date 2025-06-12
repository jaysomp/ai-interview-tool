import React, { useState } from 'react';
import { Container, Box, Typography, Divider, Paper } from '@mui/material';
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

  const handleStartInterview = async (name, jobTitle, jobDesc) => {
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" mb={4} fontWeight={700}>
        AI Interview Practice
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <StartInterviewForm onStart={handleStartInterview} />
      </Paper>
      {interviewId && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box display="flex" gap={4}>
            <Box flex={1}>
              <QuestionsList questions={questions} selectedId={selectedQuestion?.question_id} onSelect={handleSelectQuestion} />
            </Box>
            <Box flex={2}>
              {selectedQuestion && (
                <AnswerPanel question={selectedQuestion} onScore={handleScore} />
              )}
              {score !== null && (
                <ScoreResult score={score} reasoning={reasoning} />
              )}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}

export default App;
