import React from 'react';
import { Paper, Typography, List, ListItemButton, ListItemText, useTheme } from '@mui/material';

export default function QuestionsList({ questions, selectedId, onSelect }) {
  const theme = useTheme();
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 0, background: theme.palette.background.paper }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', letterSpacing: 0.5 }}>Questions</Typography>
      <List disablePadding>
        {questions.map((q) => (
          <ListItemButton
            key={q.question_id}
            selected={selectedId === q.question_id}
            onClick={() => onSelect(q)}
            sx={{
              borderRadius: 0,
              mb: 1,
              background: selectedId === q.question_id ? (theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light) : 'transparent',
              color: selectedId === q.question_id ? theme.palette.primary.contrastText : theme.palette.text.primary,
              fontWeight: selectedId === q.question_id ? 700 : 500,
              boxShadow: selectedId === q.question_id ? '0 2px 8px 0 rgba(140,60,200,0.07)' : 'none',
              '&:hover': {
                background: theme.palette.mode === 'dark' ? '#31224b' : '#f3eaff',
                color: theme.palette.primary.main,
              },
              transition: 'all 0.18s',
            }}
          >
            <ListItemText primary={q.question_text} primaryTypographyProps={{ fontSize: '1.03rem', fontWeight: selectedId === q.question_id ? 700 : 500 }} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
