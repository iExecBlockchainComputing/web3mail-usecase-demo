import {
  Box,
  Button,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import './SendMail.css';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function SendMail() {
  const { receiverId } = useParams();

  //for textarea
  const [value, setValue] = useState('');
  const [charactersRemaining, setCharactersRemaining] = useState(500);

  //for name et dataType
  const [messageObject, setMessageObject] = useState('');

  //handle functions
  const handleMessageObjectChange = (event: any) => {
    setMessageObject(event.target.value);
  };

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setCharactersRemaining(500 - inputValue.length);
  };

  return (
    <Box sx={{ m: 10, mx: 20 }}>
      <h2>Send Mail to {receiverId}</h2>
      <Box sx={{ my: 2, display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          id="Message object"
          label="Message object"
          variant="outlined"
          value={messageObject}
          onChange={handleMessageObjectChange}
          sx={{ mt: 3 }}
        />
        <TextareaAutosize
          placeholder="Enter text here"
          value={value}
          onChange={handleChange}
          style={{ width: '100%', marginTop: 30, height: 380 }}
          id="textArea"
        />
        <Typography sx={{ my: 2, fontStyle: 'italic', fontSize: 'smaller' }}>
          {charactersRemaining} characters remaining
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: '50px', m: 'auto', mr: 0 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
