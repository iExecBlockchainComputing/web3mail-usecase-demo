import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, TextareaAutosize } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Loader } from 'react-feather';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useSendEmailMutation } from '@/app/appSlice.ts';
import { SEND_EMAIL } from '@/config/path.ts';
import './SendEmailForm.css';

const MAX_CHARACTERS_SENDER_NAME = 20;
const MAX_CHARACTERS_MESSAGE_SUBJECT = 78;

export default function SendEmailForm() {
  const { receiverAddress, protectedDataAddress } = useParams();

  const navigate = useNavigate();
  const { toast } = useToast();

  //RTK Mutation hook
  const [sendEmail, result] = useSendEmailMutation();

  //for textarea
  const [message, setMessage] = useState('');
  const charactersRemainingMessage = 512000 - message.length;

  //for name et dataType
  const [messageSubject, setMessageSubject] = useState('');
  const charactersRemainingSubject =
    MAX_CHARACTERS_MESSAGE_SUBJECT - messageSubject.length;

  const [contentType, setContentType] = useState('text/plain');

  const [senderName, setSenderName] = useState('');
  const charactersRemainingSenderName =
    MAX_CHARACTERS_SENDER_NAME - senderName.length;

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
    })
      .unwrap()
      .then(() => {
        toast({
          title: 'The email has been sent!',
        });
        setTimeout(() => {
          navigate(`./${SEND_EMAIL}`);
        }, 250);
      })
      .catch((err) => {
        toast({
          variant: 'danger',
          title: err || 'Failed to send email.',
        });
      });
  };

  const handleSelectContentType = (event: SelectChangeEvent) => {
    setContentType(event.target.value as string);
  };

  const handleSenderNameChange = (event: any) => {
    const inputValue = event.target.value;
    setSenderName(inputValue);
  };

  return (
    <div className="mx-auto mb-28 w-[70%]">
      <div className="text-left">
        <Button asChild variant="text" size="sm">
          <Link to={`/${SEND_EMAIL}`} className="pl-2">
            <ChevronLeftIcon />
            <span className="pl-0.5">Back</span>
          </Link>
        </Button>
      </div>
      <h2>Send email to {receiverAddress}</h2>
      <Box sx={{ my: 2, display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          id="sender-name"
          label="Sender name"
          variant="outlined"
          required
          value={senderName}
          onChange={handleSenderNameChange}
          className="mt-6"
          inputProps={{ maxLength: MAX_CHARACTERS_SENDER_NAME }}
        />
        <p className="my-2 text-sm italic">
          {charactersRemainingSenderName >= 0
            ? charactersRemainingSenderName
            : 0}{' '}
          {charactersRemainingSenderName > 1 ? 'characters' : 'character'}{' '}
          remaining
        </p>
        <TextField
          fullWidth
          id="Message subject"
          label="Message subject"
          variant="outlined"
          required
          value={messageSubject}
          onChange={handleMessageSubjectChange}
          inputProps={{ maxLength: MAX_CHARACTERS_MESSAGE_SUBJECT }}
          className="mt-6"
        />
        <p className="my-2 text-sm italic">
          {charactersRemainingSubject >= 0 ? charactersRemainingSubject : 0}{' '}
          {charactersRemainingSubject > 1 ? 'characters' : 'character'}{' '}
          remaining
        </p>
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
        <TextareaAutosize
          required
          placeholder="Enter email content *"
          value={message}
          onChange={handleChange}
          id="textArea"
          className="mt-4 !h-[200px] w-full border p-3"
        />
        <p className="my-2 text-sm italic">
          {charactersRemainingMessage} characters remaining
        </p>
        <div className="text-right">
          <Button
            disabled={result.isLoading}
            onClick={sendEmailHandle}
            data-cy="send-email-button"
          >
            {result.isLoading && (
              <Loader className="-ml-1 mr-2 animate-spin-slow" size="16" />
            )}
            <span>Send</span>
          </Button>
        </div>
      </Box>
    </div>
  );
}
