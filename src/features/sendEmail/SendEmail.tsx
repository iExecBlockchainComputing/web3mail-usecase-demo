import {
  Alert,
  Box,
  Snackbar,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { Typography, Button } from '@iexec/react-ui-kit';
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
  const charactersRemainingMessage = 4096 - message.length;

  //for name et dataType
  const [messageSubject, setMessageSubject] = useState('');

  const [contentType, setContentType] = useState('text/plain');
  const [senderName, setSenderName] = useState('');

  //limited to 78 by the SMS
  const charactersRemainingSubject = 78 - messageSubject.length;

  //handle functions
  const handleMessageSubjectChange = (event: any) => {
    const inputValue = event.target.value;
    setMessageSubject(inputValue);
  };

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    setMessage(inputValue);
  };

  const sendEmailHandle = () => {
    if (!protectedDataAddress) return;
    sendEmail({
      senderName,
      contentType,
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

  const handleSelectContentType = (event: SelectChangeEvent) => {
    setContentType(event.target.value as string);
  };

  const handleSenderNameChange = (event: any) => {
    const inputValue = event.target.value;
    setSenderName(inputValue);
  };
  return (
    <Box sx={{ m: 6, mx: 20 }}>
      <h2>Send Mail to {receiverAddress}</h2>
      <Box sx={{ my: 2, display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          id="sender-name"
          label="Sender name"
          variant="outlined"
          value={senderName}
          onChange={handleSenderNameChange}
          sx={{ mt: 3 }}
        />
        <FormControl sx={{ textAlign: 'left', mt: 3 }} fullWidth>
          <InputLabel id="content-type-label">Content Type</InputLabel>
          <Select
            labelId="content-type-label"
            id="content-type-select"
            value={contentType}
            label="Content type"
            onChange={handleSelectContentType}
          >
            <MenuItem value="text/plain">text/plain</MenuItem>
            <MenuItem value="text/html">text/html</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          id="Message subject"
          label="Message subject"
          variant="outlined"
          required
          value={messageSubject}
          onChange={handleMessageSubjectChange}
          sx={{ mt: 3 }}
        />
        <Typography sx={{ my: 2, fontStyle: 'italic', fontSize: 'smaller' }}>
          {charactersRemainingSubject} characters remaining
        </Typography>
        <TextareaAutosize
          required
          placeholder="Enter email content"
          value={message}
          onChange={handleChange}
          style={{ width: '100%', marginTop: 10, height: 380 }}
          id="textArea"
        />
        <Typography sx={{ mt: 2, fontStyle: 'italic', fontSize: 'smaller' }}>
          {charactersRemainingMessage} characters remaining
        </Typography>
        <Button className="sendEmailButton" onClick={sendEmailHandle}>
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
