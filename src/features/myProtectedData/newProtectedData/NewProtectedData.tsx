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
import { PROTECTED_DATA } from '@/config/path.ts';
import { useCreateProtectedDataMutation } from '@/app/appSlice.ts';
import { createArrayBufferFromFile } from '@/utils/utils.ts';
import './NewProtectedData.css';

export default function NewProtectedData() {
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
    const data: any = {};
    let bufferFile: ArrayBuffer;
    switch (dataType) {
      case 'email':
        data['email'] = email;
        break;
      case 'file':
        bufferFile = await createArrayBufferFromFile(file);
        data['file'] = bufferFile;
        break;
    }
    if (dataType && name && ((isValidEmail && email) || file)) {
      await createProtectedData({ data, name });
    }
  };

  const dataTypes = [
    { value: 'email', label: 'Email Address' },
    { value: 'file', label: 'File' },
  ];
  return (
    <div>
      <div className="text-left">
        <Button asChild variant="text">
          <Link to={`/${PROTECTED_DATA}`} className="pl-4">
            <ChevronLeftIcon />
            <span className="pl-1">Back</span>
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
          fullWidth
          id="Name of your Protected Data"
          label="Name of your Protected Data"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          sx={{ mt: 3 }}
        />
      )}
      {result.error && (
        <Alert
          sx={{
            margin: 'auto',
            mt: 3,
            mb: 2,
            justifyContent: 'center',
            maxWidth: '400px',
          }}
          severity="error"
        >
          <Typography variant="h6"> Creation failed </Typography>
          {result.error.toString()}
        </Alert>
      )}
      {result.data && !result.error && (
        <Alert
          sx={{
            margin: 'auto',
            mt: 3,
            mb: 2,
            justifyContent: 'center',
            maxWidth: '400px',
          }}
          severity="success"
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
      )}
      {result.isLoading && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularProgress className="mt-10"></CircularProgress>
          Protecting data...
        </div>
      )}
      {dataType && !result.isLoading && !result.data && !result.error && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button className="mt-6" onClick={handleSubmit}>
            Protect data
          </Button>
        </Box>
      )}
    </div>
  );
}
