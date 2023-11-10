import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Verified } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  // Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import ErrorAlert from '@/components/ErrorAlert.tsx';
import { PROTECTED_DATA } from '@/config/path.ts';
import { useCreateProtectedDataMutation } from '@/app/appSlice.ts';
import { cn } from '@/lib/utils.ts';
import { createArrayBufferFromFile } from '@/utils/utils.ts';
import './NewProtectedData.css';

export default function NewProtectedData() {
  const { toast } = useToast();

  const fileInput = useRef<HTMLInputElement>(null);

  //query RTK API as mutation hook
  const [createProtectedData, result] = useCreateProtectedDataMutation();

  //for name et dataType
  const [name, setName] = useState('');
  const [dataType, setDataType] = useState('');

  //for email
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  //for file
  const [filePath, setFilePath] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const [showBackToListLink, setShowBackToListLink] = useState(false);

  //handle functions
  const handleDataTypeChange = (event: any) => {
    setDataType(event.target.value);
  };
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
  };

  const handleFileChange = (event: any) => {
    setFilePath(event.target.value);
    setFile(event.target.files?.[0]);
  };
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  //ask for confirmation before leaving the page
  const handleSubmit = async () => {
    const data: {
      email?: string;
      file?: Uint8Array;
    } = {};
    let bufferFile: Uint8Array;
    switch (dataType) {
      case 'email':
        data.email = email;
        break;
      case 'file':
        bufferFile = await createArrayBufferFromFile(file);
        data.file = bufferFile;
        break;
    }
    if (dataType && name && ((isValidEmail && email) || file)) {
      await createProtectedData({ data, name });
      setTimeout(() => {
        setShowBackToListLink(true);
      }, 1500);
    } else {
      toast({
        variant: 'danger',
        title: 'Please fill in all required fields.',
      });
    }
  };

  const dataTypes = [
    { value: 'email', label: 'Email Address' },
    { value: 'file', label: 'File' },
  ];
  return (
    <div className="mx-auto mb-28 w-[70%]">
      <div className="text-left">
        <Button asChild variant="text" size="sm">
          <Link to={`/${PROTECTED_DATA}`} className="pl-2">
            <ChevronLeftIcon />
            <span className="pl-0.5">Back</span>
          </Link>
        </Button>
      </div>
      <Box sx={{ textAlign: 'left' }}>
        <h2>Protect New Data</h2>
      </Box>
      <FormControl fullWidth sx={{ mt: '24px' }}>
        <InputLabel>Select your data type</InputLabel>
        <Select
          fullWidth
          value={dataType}
          onChange={handleDataTypeChange}
          label="Select your data type"
          sx={{ textAlign: 'left' }}
        >
          {dataTypes.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {dataType === 'email' && (
        <TextField
          required
          fullWidth
          id="email"
          label="Email"
          variant="outlined"
          sx={{ mt: 3 }}
          value={email}
          onChange={handleEmailChange}
          type="email"
          error={!isValidEmail}
          helperText={!isValidEmail && 'Please enter a valid email address'}
        />
      )}
      {dataType === 'file' && (
        <Button
          className="uploadFileButton"
          variant="secondary"
          onClick={() => fileInput.current?.click()}
        >
          {!filePath ? 'Upload' : 'Updated File'}
          <input
            ref={fileInput}
            hidden
            multiple
            type="file"
            onChange={(e) => handleFileChange(e)}
          />
        </Button>
      )}
      {filePath && dataType === 'file' && (
        <Grid container columnSpacing={1} sx={{ mt: 1 }}>
          <Grid item>
            <Typography>{filePath.split('\\').slice(-1)}</Typography>
          </Grid>
          <Grid item>
            <Verified color="success" />
          </Grid>
        </Grid>
      )}

      {dataType && (
        <TextField
          required
          fullWidth
          id="Name of your Protected Data"
          label="Name of your Protected Data"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          sx={{ mt: 3 }}
        />
      )}

      {result.isLoading && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularProgress className="mt-10"></CircularProgress>
          Your protected data is currently being created. Please wait a few
          moments.
        </div>
      )}

      {result.error && (
        <div className="mb-3 mt-6 flex flex-col items-center">
          <ErrorAlert fullWidth={true}>
            <div className="flex flex-col">
              <p>
                Oops, something went wrong while creating your protected data.
              </p>
              <p className="text-orange-300">{result.error.toString()}</p>
            </div>
          </ErrorAlert>
        </div>
      )}

      {result.data && !result.error && (
        <>
          <Alert
            sx={{
              margin: 'auto',
              mt: 3,
              mb: 2,
              justifyContent: 'center',
            }}
            severity="success"
            className="rounded-md"
          >
            <Typography variant="h6"> Your data has been protected!</Typography>
            <a
              href={`https://explorer.iex.ec/bellecour/dataset/${result.data}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              See Details
            </a>
            <p>Your protected data address: {result.data}</p>
          </Alert>
          <div
            className={cn(
              'text-center transition-opacity',
              showBackToListLink ? 'opacity-1' : 'opacity-0'
            )}
          >
            <Link to={`/${PROTECTED_DATA}`} className="p-2 underline">
              See my protected data
            </Link>
          </div>
        </>
      )}

      {dataType && !result.isLoading && !result.data && (
        <div className="text-center">
          <Button className="mt-6" onClick={handleSubmit}>
            Create Protected Data
          </Button>
        </div>
      )}
    </div>
  );
}
