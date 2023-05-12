import './NewProtectedData.css';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Verified } from '@mui/icons-material';
import { useState } from 'react';
import { DataSchema } from '@iexec/dataprotector';
import { useCreatePotectedDataMutation } from '../../app/appSlice';

export default function NewProtectedData() {
  //query RTK API as mutation hook
  const [createPotectedData, result] = useCreatePotectedDataMutation();

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

  async function create_ArrayBuffer(file?: File): Promise<ArrayBuffer> {
    const fileReader = new FileReader();
    if (file) {
      return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
          fileReader.abort();
          reject(new DOMException('Error parsing input file.'));
        };
        fileReader.onload = () => {
          resolve(fileReader.result as ArrayBuffer);
        };
        fileReader.readAsArrayBuffer(file);
      });
    } else {
      return Promise.reject(new Error('No file selected'));
    }
  }

  const handleSubmit = async (event: any) => {
    let data: string | DataSchema;
    let bufferFile: ArrayBuffer;
    switch (dataType) {
      case 'email':
        data = { email: email };
        break;
      case 'file':
        bufferFile = await create_ArrayBuffer(file);
        data = { file: bufferFile };
        break;
    }
    if (dataType && name && ((isValidEmail && email) || file)) {
      await createPotectedData({ data, name });
    }
  };

  const dataTypes = [
    { value: 'email', label: 'Email' },
    { value: 'file', label: 'File' },
  ];
  return (
    <Box id="newProtectedData">
      <Box sx={{ textAlign: 'left' }}>
        <h2>Protect a Data</h2>
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
          variant="contained"
          component="label"
          id="file"
          fullWidth
          onChange={handleFileChange}
          sx={{ mt: 3 }}
        >
          {!filePath ? 'Upload' : 'Updated File'}
          <input hidden multiple type="file" />
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
          <Link
            href={`https://explorer.iex.ec/bellecour/dataset/${result.data.dataAddress}`}
            target="_blank"
            sx={{ color: 'green', textDecorationColor: 'green' }}
          >
            You can reach it here
          </Link>
          <p>Your protected data address: {result.data.dataAddress}</p>
        </Alert>
      )}
      {result.isLoading && (
        <CircularProgress sx={{ margin: '20px auto' }}></CircularProgress>
      )}
      {dataType && !result.isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={{ mt: 9 }} onClick={handleSubmit} variant="contained">
            Protect the data
          </Button>
        </Box>
      )}
    </Box>
  );
}
