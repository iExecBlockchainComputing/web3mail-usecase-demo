import { GrantedAccess } from '@iexec/dataprotector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash } from 'react-feather';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';

export function RevokeAccessButton({
  grantedAccess,
}: {
  grantedAccess: GrantedAccess;
}) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const revokeOneAccessMutation = useMutation({
    mutationKey: ['revokeOneAccess'],
    mutationFn: async () => {
      const { dataProtector } = await getDataProtectorClient();
      return dataProtector.revokeOneAccess(grantedAccess);
    },
    onSuccess: () => {
      toast({
        title: 'The granted access has been successfully revoked!',
      });
      queryClient.invalidateQueries({
        queryKey: ['grantedAccess', grantedAccess.dataset],
      });
    },
    onError: (err) => {
      // logs and rollbar alert handled by tanstack query config in initQueryClient()
      toast({
        variant: 'danger',
        title: err?.message || 'Failed to revoke access.',
      });
    },
  });

  return (
    <Button
      size="sm"
      variant="secondary"
      className="pl-4"
      disabled={revokeOneAccessMutation.isPending}
      onClick={() => revokeOneAccessMutation.mutate()}
    >
      {revokeOneAccessMutation.isPending ? (
        <Loader size="16" className="animate-spin-slow" />
      ) : (
        <Trash size="16" aria-label="delete" />
      )}
      <span className="whitespace-nowrap pl-2">Revoke access</span>
    </Button>
  );
}
