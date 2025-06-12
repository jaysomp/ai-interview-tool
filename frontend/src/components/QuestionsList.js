import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

export default function QuestionsList({ questions, selectedId, onSelect }) {
  return (
    <div>
      <Typography variant="h6" mb={1}>Questions</Typography>
      <List>
        {questions.map(q => (
          <ListItem key={q.question_id} disablePadding>
            <ListItemButton selected={selectedId === q.question_id} onClick={() => onSelect(q)}>
              <ListItemText primary={q.question_text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
