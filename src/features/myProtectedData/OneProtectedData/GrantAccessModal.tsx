import { useEffect, useState } from 'react';
import './GrantAccessModal.css';
import {
  TextField,
  Modal,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { useGrantNewAccessMutation } from '@/app/appSlice';
import { SMART_CONTRACT_WEB3MAIL_WHITELIST } from '@/config/config';

type GrantAccessModalParams = {
  protectedData: string;
  open: boolean;
  handleClose: () => void;
};

export default function GrantAccessModal(props: GrantAccessModalParams) {
  //rtk mutation
  const [grantNewAccess, result] = useGrantNewAccessMutation();

  //for ethAddress
  const [ethAddress, setEthAddress] = useState('');
  const [isValidEthAddress, setIsValidEthAddress] = useState(true);
  const handleEthAddressChange = (event: any) => {
    setEthAddress(event.target.value);
    setIsValidEthAddress(event.target.validity.valid);
  };

  //for NbOfAccess
  const [NbOfAccess, setNbOfAccess] = useState(1);
  const handleNbOfAccessChange = (event: any) => {
    setNbOfAccess(event.target.value);
  };

  const handleGrantAccess = () => {
    const protectedData = props.protectedData;
    grantNewAccess({
      protectedData,
      authorizedApp: SMART_CONTRACT_WEB3MAIL_WHITELIST,
      authorizedUser: ethAddress,
      numberOfAccess: NbOfAccess,
    });
  };

  // Snackbar success / error notification
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarVisible(false);
  };

  useEffect(() => {
    if (result.isError) {
      setSuccess(false);
      setErrorMessage(result.error as string);
      setSnackbarVisible(true);
      return;
    }
    if (result.isSuccess) {
      setSuccess(result.isSuccess);
      setSnackbarVisible(true);
      result.reset();
      setEthAddress('');
      setNbOfAccess(1);
      props.handleClose();
    }
  }, [result, props]);

  return (
    <div>
      <Snackbar
        open={isSnackbarVisible}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert
          onClose={handleClose}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success
            ? 'New access granted!'
            : errorMessage || 'Failed to grant access!'}
        </Alert>
      </Snackbar>

      <Modal open={props.open} onClose={props.handleClose}>
        <Box id="modalBox">
          <Typography
            component="h1"
            variant="h5"
            sx={{ alignSelf: 'flex-start' }}
          >
            Add a new contact
          </Typography>
          <TextField
            required
            fullWidth
            id="ethAddress"
            label="Ethereum Address"
            variant="outlined"
            sx={{ mt: 3 }}
            value={ethAddress}
            onChange={handleEthAddressChange}
            type="ethAddress"
            error={!isValidEthAddress}
            helperText={
              !isValidEthAddress && 'Please enter a valid ethereum Address'
            }
          />
          <TextField
            fullWidth
            type="NbOfAccess"
            id="age"
            label="Number of Access"
            variant="outlined"
            value={NbOfAccess}
            InputProps={{ inputProps: { min: 1 } }}
            onChange={handleNbOfAccessChange}
            sx={{ mt: 3 }}
          />
          {/* TODO: Have a proper form and submit button */}
          {/*<button type="submit">Validate</button>*/}
          <Button disabled={result.isLoading} onClick={handleGrantAccess}>
            {result.isLoading ? 'Loading...' : 'Validate'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
