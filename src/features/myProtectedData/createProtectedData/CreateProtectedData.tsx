import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useRef, useState } from 'react';
import { CheckCircle, ChevronLeft } from 'react-feather';
import { Link } from 'react-router-dom';
import { Alert } from '@/components/Alert.tsx';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { DocLink } from '@/components/DocLink.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { cn } from '@/utils/style.utils.ts';
import { createArrayBufferFromFile } from '@/utils/utils.ts';

export default function CreateProtectedData() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const fileInput = useRef<HTMLInputElement>(null);

  //for name et dataType
  const [name, setName] = useState('');
  const [dataType, setDataType] = useState<'email' | 'file'>();

  //for email
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  //for file
  const [filePath, setFilePath] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const [showBackToListLink, setShowBackToListLink] = useState(false);

  //handle functions
  const onChangeDataType = (chosenDataType: 'email' | 'file') => {
    setDataType(chosenDataType);
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

  const createProtectedDataMutation = useMutation({
    mutationFn: async ({
      name,
      data,
    }: {
      name: string;
      data: {
        email?: string;
        file?: Uint8Array;
      };
    }) => {
      const { dataProtector } = await getDataProtectorClient();
      return dataProtector.protectData({ name, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProtectedData'] });
    },
  });

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
      createProtectedDataMutation.mutate({ data, name });
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

  return (
    <div className="mx-auto mb-28 w-[70%]">
      <div className="text-left">
        <Button asChild variant="text" size="sm">
          <Link to={`/protected-data`} className="pl-2">
            <ChevronLeft size="22" />
            <span className="pl-1">Back</span>
          </Link>
        </Button>
      </div>

      <h2>Protect New Data</h2>
      <p className="-mt-3 mb-4">
        Protect new email or file: encrypt, monetize and control access.
      </p>

      {(!createProtectedDataMutation.data ||
        createProtectedDataMutation.error) && (
        <>
          <form noValidate className="mt-6 w-full" onSubmit={handleSubmit}>
            <Label htmlFor="dataType">Select your data type *</Label>
            <Select onValueChange={onChangeDataType}>
              <SelectTrigger id="dataType" className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Address</SelectItem>
                <SelectItem value="file">File</SelectItem>
              </SelectContent>
            </Select>

            {dataType === 'email' && (
              <div className="mt-6">
                <Label htmlFor="emailAddress">Email *</Label>
                <Input
                  id="emailAddress"
                  value={email}
                  aria-label="Email Address"
                  className="mt-1"
                  onChange={handleEmailChange}
                />
              </div>
            )}
            {dataType === 'file' && (
              <Button
                variant="secondary"
                className="mt-5 w-full"
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
              <div className="mt-6">
                <Label htmlFor="protectedDataName">
                  Name of your Protected Data *
                </Label>
                <Input
                  id="protectedDataName"
                  value={name}
                  aria-label="Name of your Protected Data"
                  className="mt-1"
                  onChange={handleNameChange}
                />
              </div>
            )}

            {dataType && !createProtectedDataMutation.isPending && (
              <div className="text-center">
                <Button type="submit" className="mt-6">
                  Create Protected Data
                </Button>
              </div>
            )}
          </form>

          {createProtectedDataMutation.isPending && (
            <div className="flex flex-col items-center gap-y-4">
              <CircularLoader className="mt-10" />
              Your protected data is currently being created. Please wait a few
              moments.
            </div>
          )}

          {createProtectedDataMutation.error && (
            <div className="mb-3 mt-6 flex flex-col items-center">
              <Alert variant="error" fullWidth={true}>
                <p>
                  Oops, something went wrong while creating your protected data.
                </p>
                <p className="text-orange-300">
                  {createProtectedDataMutation.error.toString()}
                </p>
              </Alert>
            </div>
          )}

          <DocLink className="mt-20">
            dataprotector-sdk / Method called in this page:{' '}
            <a
              href="https://beta.tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/protectData.html"
              target="_blank"
              rel="noreferrer"
              className="text-link hover:underline"
            >
              protectData()
            </a>
          </DocLink>
        </>
      )}

      {createProtectedDataMutation.data &&
        !createProtectedDataMutation.error && (
          <>
            <div className="my-6 flex flex-col items-center">
              <Alert variant="success" fullWidth={true}>
                <p>Your data has been protected!</p>
                <a
                  href={`https://explorer.iex.ec/bellecour/dataset/${createProtectedDataMutation.data.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline"
                >
                  See Details
                </a>
                <p className="text-sm">
                  Your protected data address:{' '}
                  {createProtectedDataMutation.data.address}
                </p>
              </Alert>
            </div>

            <div
              className={cn(
                'text-center transition-opacity',
                showBackToListLink ? 'opacity-1' : 'opacity-0'
              )}
            >
              <Link to={`/protected-data`} className="p-2 underline">
                See my protected data
              </Link>
            </div>
          </>
        )}
    </div>
  );
}
