import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const startInterview = async (name, jobTitle, jobDescription, companyName) => {
  const res = await axios.post(`${API_BASE}/interview`, {
    name,
    job_title: jobTitle,
    job_description: jobDescription,
    company_name: companyName,
  });
  return res.data.interview_id;
};

export const generateQuestions = async (interviewId, numQuestions = 5) => {
  const res = await axios.post(`${API_BASE}/generate_questions_for_interview`, {
    interview_id: interviewId,
    num_questions: numQuestions,
  });
  return res.data.questions;
};

export const scoreResponse = async (questionId, response) => {
  const res = await axios.post(`${API_BASE}/score_response`, {
    question_id: questionId,
    response,
  });
  return res.data;
};

export const getInterviewHistory = async () => {
  const res = await axios.get(`${API_BASE}/interview_history`);
  return res.data.interviews;
};

export const getInterviewDetail = async (interviewId) => {
  const res = await axios.get(`${API_BASE}/interview_history/${interviewId}`);
  return res.data.interview;
};

export const clearHistory = async () => {
  const res = await axios.delete(`${API_BASE}/clear_history`);
  return res.data;
};
