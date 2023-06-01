import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import './SendMail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSendMailMutation } from '../../app/appSlice';
import { useAccount } from 'wagmi';

export default function SendMail() {
  const { receiverId, protectedDataAddress } = useParams();
  const { address } = useAccount();

  //RTK Mutation hook
  const [sendMessage, result] = useSendMailMutation();

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

  const sendMail = () => {
    sendMessage({
      userAddress: address,
      mailObject: messageObject,
      mailContent: value,
      datasetAddress: protectedDataAddress,
    });
  };

  //snackbar notification
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (result.isSuccess) {
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
          onClick={sendMail}
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
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          The mail has been sent!
        </Alert>
      </Snackbar>
    </Box>
  );
}
