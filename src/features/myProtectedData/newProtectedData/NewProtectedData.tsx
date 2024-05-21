import { type FormEvent, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { CheckCircle, ChevronLeft } from 'react-feather';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { Alert } from '@/components/Alert.tsx';
import { DocLink } from '@/components/DocLink.tsx';
import { PROTECTED_DATA } from '@/config/path.ts';
import { useCreateProtectedDataMutation } from '@/app/appSlice.ts';
import { cn } from '@/utils/style.utils.ts';
import { createArrayBufferFromFile } from '@/utils/utils.ts';
import { CircularLoader } from '@/components/CircularLoader.tsx';

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
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
        if (!file) {
          toast({
            variant: 'danger',
            title: 'Please upload a file.',
          });
          return;
        }
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
            <ChevronLeft size="22" />
            <span className="pl-1">Back</span>
          </Link>
        </Button>
      </div>

      <h2>Protect New Data</h2>
      <p className="-mt-3 mb-4">
        Protect new email or file: encrypt, monetize and control access.
      </p>

      {(!result.data || result.error) && (
        <>
          <form noValidate onSubmit={handleSubmit}>
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
                helperText={
                  !isValidEmail && 'Please enter a valid email address'
                }
              />
            )}
            {dataType === 'file' && (
              <Button
                className="mt-5 w-full"
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
              <div className="mt-2 flex items-center gap-x-2">
                {filePath.split('\\').slice(-1)}
                <CheckCircle size="20" className="text-success-foreground" />
              </div>
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

            {dataType && !result.isLoading && (
              <div className="text-center">
                <Button type="submit" className="mt-6">
                  Create Protected Data
                </Button>
              </div>
            )}
          </form>

          {result.isLoading && (
            <div className="flex flex-col items-center gap-y-4">
              <CircularLoader className="mt-10" />
              Your protected data is currently being created. Please wait a few
              moments.
            </div>
          )}

          {result.error && (
            <div className="mb-3 mt-6 flex flex-col items-center">
              <Alert variant="error" fullWidth={true}>
                <p>
                  Oops, something went wrong while creating your protected data.
                </p>
                <p className="text-orange-300">{result.error.toString()}</p>
              </Alert>
            </div>
          )}

          {dataType && (
            <DocLink className="mt-20">
              dataprotector-sdk / Method called in this page:{' '}
              <a
                href="https://tools.docs.iex.ec/tools/dataprotector/methods/protectdata"
                target="_blank"
                rel="noreferrer"
                className="text-link hover:underline"
              >
                protectData()
              </a>
            </DocLink>
          )}
        </>
      )}

      {result.data && !result.error && (
        <>
          <div className="my-6 flex flex-col items-center">
            <Alert variant="success" fullWidth={true}>
              <p>Your data has been protected!</p>
              <a
                href={`https://explorer.iex.ec/bellecour/dataset/${result.data}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline"
              >
                See Details
              </a>
              <p className="text-sm">
                Your protected data address: {result.data}
              </p>
            </Alert>
          </div>

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
    </div>
  );
}
