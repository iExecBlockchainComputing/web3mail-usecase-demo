import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import './SendEmail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSendEmailMutation } from '../../app/appSlice';

export default function SendEmail() {
  const { receiverAddress, protectedDataAddress } = useParams();

  //RTK Mutation hook
  const [sendEmail, result] = useSendEmailMutation();

  //for textarea
  const [message, setMessage] = useState('');
  //limited to 4096 by the SMS
  const [charactersRemainingMessage, setCharactersRemainingMessage] =
    useState(4096);

  //for name et dataType
  const [messageSubject, setMessageSubject] = useState('');
  //limited to 78 by the SMS
  const [charactersRemainingSubject, setCharactersRemainingSubject] =
    useState(78);

  //handle functions
  const handleMessageSubjectChange = (event: any) => {
    const inputValue = event.target.value;
    setMessageSubject(inputValue);
    setCharactersRemainingSubject(78 - inputValue.length);
  };

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    setMessage(inputValue);
  };

  const sendEmailHandle = () => {
    if (!protectedDataAddress) return;
    sendEmail({
      emailSubject: messageSubject,
      emailContent: message,
      protectedData: protectedDataAddress,
    });
  };

  //snackbar notification
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (result.isSuccess || result.isError) {
      setSuccess(result.isSuccess);
      setOpen(true);
    }
  }, [result]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ m: 10, mx: 20 }}>
      <h2>Send Mail to {receiverAddress}</h2>
      <Box sx={{ my: 2, display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          id="Message subject"
          label="Message subject"
          variant="outlined"
          value={messageSubject}
          onChange={handleMessageSubjectChange}
          sx={{ mt: 3 }}
        />
        <Typography sx={{ my: 2, fontStyle: 'italic', fontSize: 'smaller' }}>
          {charactersRemainingSubject} characters remaining
        </Typography>
        <TextareaAutosize
          placeholder="Enter text here"
          value={message}
          onChange={handleChange}
          style={{ width: '100%', marginTop: 30, height: 380 }}
          id="textArea"
        />
        <Typography sx={{ my: 2, fontStyle: 'italic', fontSize: 'smaller' }}>
          {charactersRemainingMessage} characters remaining
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: '50px', m: 'auto', mr: 0 }}
          onClick={sendEmailHandle}
        >
          Send
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert
          onClose={handleClose}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success ? 'The email has been sent!' : 'Failed to send the Email!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}
