import { useUserStore } from '@/stores/user.store.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ZeroAddress } from 'ethers';
import { type FormEvent, useState } from 'react';
import { AlertCircle, Loader } from 'react-feather';
// import { Alert } from '@/components/ui/alert.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { WEB3MAIL_IDAPPS_WHITELIST_SC } from '@/config/config.ts';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';

type GrantAccessModalParams = {
  protectedData: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GrantAccessModal(props: GrantAccessModalParams) {
  const { address } = useUserStore();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [error, setError] = useState('');
  const [subError, setSubError] = useState('');

  //for ethAddress
  const [ethAddress, setEthAddress] = useState('');
  const handleEthAddressChange = (event: any) => {
    setEthAddress(event.target.value);
  };

  //for NbOfAccess
  const [nbOfAccess, setNbOfAccess] = useState(1);
  const handleNbOfAccessChange = (event: any) => {
    setNbOfAccess(event.target.value);
  };

  const grantNewAccessMutation = useMutation({
    mutationFn: async () => {
      const { dataProtector } = await getDataProtectorClient();
      return dataProtector.grantAccess({
        protectedData: props.protectedData,
        authorizedApp: WEB3MAIL_IDAPPS_WHITELIST_SC,
        authorizedUser: ethAddress,
        numberOfAccess: nbOfAccess,
      });
    },
    onSuccess: () => {
      toast({
        title: 'New access granted!',
      });
      setEthAddress('');
      setNbOfAccess(1);
      props.onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['myProtectedData'] });
    },
    onError: (err) => {
      console.error('[grantAccess] ERROR', err);
      if (err.cause) {
        console.error(err.cause);
      }
      toast({
        variant: 'danger',
        title: err?.message || 'Failed to grant access!',
      });
      if (err?.message === 'Failed to sign data access') {
        setError((err.cause as Error).message);
        // setSubError(
        //   'Are you sure your protected data was created in the same environment?'
        // );
      }
    },
  });

  const handleGrantAccess = (event: FormEvent) => {
    event.preventDefault();

    if (!ethAddress.trim()) {
      toast({
        variant: 'danger',
        title: 'Please fill in all required fields.',
      });
      return;
    }

    grantNewAccessMutation.mutate();
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="w-[520px] rounded-md bg-white p-8">
        <DialogTitle>New user</DialogTitle>

        <form
          noValidate
          className="mt-6 flex w-full flex-col"
          onSubmit={handleGrantAccess}
        >
          <div>
            <Label htmlFor="userEthereumAddress">User Ethereum Address *</Label>
            <Input
              id="userEthereumAddress"
              value={ethAddress}
              aria-label="User Ethereum Address"
              className="mt-1"
              onChange={handleEthAddressChange}
            />
            <div className="ml-0.5 mt-1">
              <span className="text-xs">Authorize any user: </span>
              <button
                type="button"
                className="bg-transparent text-xs underline"
                onClick={() => {
                  setEthAddress(ZeroAddress);
                }}
              >
                {ZeroAddress}
              </button>
            </div>
            {address && (
              <div className="ml-0.5">
                <span className="text-xs">Authorize myself: </span>
                <button
                  type="button"
                  className="bg-transparent text-xs underline"
                  onClick={() => {
                    setEthAddress(address);
                  }}
                >
                  {address}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="numberOfAccess">Number of Access *</Label>
            <Input
              id="numberOfAccess"
              value={nbOfAccess}
              aria-label="Number of Access"
              className="mt-1"
              onChange={handleNbOfAccessChange}
            />
          </div>

          {!!error && !!subError && (
            <Alert variant="error" className="mt-6">
              <AlertCircle className="size-4" />
              <AlertTitle>{error}</AlertTitle>
              <AlertDescription>{subError}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 flex justify-center">
            <Button type="submit" disabled={grantNewAccessMutation.isPending}>
              {grantNewAccessMutation.isPending && (
                <Loader className="-ml-1 mr-2 animate-spin-slow" size="16" />
              )}
              <span>Validate</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
