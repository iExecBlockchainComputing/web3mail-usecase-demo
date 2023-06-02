import './GrantAccessModal.css';
import {
  Button,
  TextField,
  Modal,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useGrantNewAccessMutation } from '../../app/appSlice';
import { DAPP_WEB3_MAIL_ADDRESS } from '../../config/config';

type GrantAccessModalParams = {
  protectedData: string;
  open: boolean;
  handleClose: () => void;
};

export default function GrantAcessModal(props: GrantAccessModalParams) {
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
      authorizedApp: DAPP_WEB3_MAIL_ADDRESS,
      authorizedUser: ethAddress,
      numberOfAccess: NbOfAccess,
    });
  };

  //snackbar notification
  const [open, setOpen] = useState(false);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (result.isSuccess || result.isError) {
      setOpen(true);
      result.reset();
      setEthAddress('');
      setNbOfAccess(1);
      props.handleClose();
    }
    console.log(result);
  }, [result, props]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert
          onClose={handleClose}
          severity={result.isSuccess ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {result.isSuccess ? 'New access granted!' : 'Failed to grant access!'}
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
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2 }}
            onClick={handleGrantAccess}
          >
            Validate
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
