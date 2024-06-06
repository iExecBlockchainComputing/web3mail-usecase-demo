import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, TextareaAutosize } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { ChevronLeft, Loader } from 'react-feather';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { DocLink } from '@/components/DocLink.tsx';
import { useSendTelegramMutation } from '@/app/appSlice.ts'; // A CHANGER
import { SEND_TELEGRAM } from '@/config/path.ts';
import './SendTelegram.css';

export default function SendTelegramForm() {
  const { receiverAddress, protectedDataAddress } = useParams();

  const navigate = useNavigate();
  const { toast } = useToast();

  //RTK Mutation hook
  const [sendTelegram, result] = useSendTelegramMutation();

  //for textarea
  const [message, setMessage] = useState('');
  const charactersRemainingMessage = 512000 - message.length;

  //handle functions
  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    setMessage(inputValue);
  };

  const sendTelegramHandle = () => {
    if (!protectedDataAddress) return;
    sendTelegram({
      telegramContent: message,
      protectedData: protectedDataAddress,//TODO : a changer après la umtation cf appslice
    })
      .unwrap()
      .then(() => {
        toast({
          title: 'The telegram has been sent!',
        });
        setTimeout(() => {
          navigate(`/${SEND_TELEGRAM}`);
        }, 250);
      })
      .catch((err) => {
        toast({
          variant: 'danger',
          title: err || 'Failed to send telegram.',
        });
      });
  };

  return (
    <div className="mx-auto mb-28 w-[70%]">
      <div className="text-left">
        <Button asChild variant="text" size="sm">
          <Link to={`/${SEND_TELEGRAM}`} className="pl-2">
            <ChevronLeft size="22" />
            <span className="pl-1">Back</span>
          </Link>
        </Button>
      </div>
      <h2>Send telegram message to {receiverAddress}</h2>
      <Box sx={{ my: 2, display: 'flex', flexDirection: 'column' }}>
        <FormControl sx={{ textAlign: 'left', mt: 3 }} fullWidth>
        </FormControl>
        <TextareaAutosize
          required
          minRows={8}
          maxRows={10}
          placeholder="Enter telegram message content *"
          value={message}
          onChange={handleChange}
          id="textArea"
          className="mt-4 w-full border p-3"
        />
        <p className="my-2 text-sm italic">
          {charactersRemainingMessage} characters remaining
        </p>
        <div className="text-right">
          <Button
            disabled={result.isLoading}
            onClick={sendTelegramHandle}
            data-cy="send-telegram-button"
          >
            {result.isLoading && (
              <Loader className="-ml-1 mr-2 animate-spin-slow" size="16" />
            )}
            <span>Send</span>
          </Button>
        </div>
      </Box>

      <DocLink className="mt-20">
        web3mail-sdk / Method called in this page:{' '}
        <a
          href="https://tools.docs.iex.ec/tools/web3mail/methods/sendemail"
          target="_blank"
          rel="noreferrer"
          className="text-link hover:underline"
        >
          sendEmail()
        </a>
      </DocLink>
    </div>
  );
}
