import { useState } from 'react';
import './GrantAccessModal.css';
import { TextField, Modal, Box, Typography } from '@mui/material';
import { Loader } from 'react-feather';
import { Button } from '@/components/ui/button.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { useGrantNewAccessMutation } from '@/app/appSlice.ts';
import { SMART_CONTRACT_WEB3MAIL_WHITELIST } from '@/config/config.ts';

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
    if (!ethAddress.trim()) {
      toast({
        variant: 'danger',
        title: 'Please fill in all required fields.',
      });
      return;
    }
    const protectedData = props.protectedData;
    grantNewAccess({
      protectedData,
      authorizedApp: SMART_CONTRACT_WEB3MAIL_WHITELIST,
      authorizedUser: ethAddress,
      numberOfAccess: NbOfAccess,
    })
      .unwrap()
      .then(() => {
        toast({
          title: 'New access granted!',
        });
        setEthAddress('');
        setNbOfAccess(1);
        props.handleClose();
      })
      .catch((err) => {
        toast({
          variant: 'danger',
          title: err || 'Failed to grant access!',
        });
      });
  };

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box id="modalBox">
        <Typography
          component="h1"
          variant="h5"
          sx={{ alignSelf: 'flex-start' }}
        >
          New user
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
          {result.isLoading && (
            <Loader className="animate-spin-slow -ml-1 mr-2" size="16" />
          )}
          <span>Validate</span>
        </Button>
      </Box>
    </Modal>
  );
}
