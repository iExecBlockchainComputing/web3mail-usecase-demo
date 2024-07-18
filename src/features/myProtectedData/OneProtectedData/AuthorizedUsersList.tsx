import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash, User } from 'react-feather';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';

interface AuthorizedUsersListProps {
  authorizedUsers: string[];
  count: number;
  pageSize: number;
  page: number;
  onPageChanged: (newPage: number) => void;
}

export default function AuthorizedUsersList(props: AuthorizedUsersListProps) {
  const { authorizedUsers, count, pageSize, page, onPageChanged } = props;

  const { protectedDataAddress } = useParams();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const paginationModel = {
    pageSize,
    page,
  };

  const users = authorizedUsers.map((user) => ({ id: user }));

  const revokeOneAccessMutation = useMutation({
    mutationFn: async ({ granteeAddress }: { granteeAddress: string }) => {
      const { dataProtector } = await getDataProtectorClient();
      return dataProtector.revokeOneAccess({
        protectedData: protectedDataAddress,
        authorizedUser: granteeAddress,
      });
    },
    onSuccess: () => {
      toast({
        title: 'The granted access has been successfully revoked!',
      });
      queryClient.invalidateQueries({ queryKey: ['myProtectedData'] });
    },
    onError: (err) => {
      toast({
        variant: 'danger',
        title: err || 'Failed to revoke access.',
      });
    },
  });

  function handleRevoke(value: string) {
    if (!protectedDataAddress) {
      return;
    }

    revokeOneAccessMutation.mutate({ granteeAddress: value });
  }

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      sortable: false,
      width: 56,
      renderHeader: () => null,
      renderCell: () => (
        <div className="rounded-full bg-grey-300 p-2">
          <User size="20" aria-label="user-icon" className="text-white" />
        </div>
      ),
    },
    {
      field: 'id',
      sortable: false,
      type: 'string',
      flex: 1,
    },
    {
      field: 'Actions',
      sortable: false,
      width: 170,
      renderCell: (params) => (
        <Button
          size="sm"
          variant="secondary"
          className="pl-4"
          disabled={result.isLoading}
          onClick={() => handleRevoke(params.value)}
        >
          {result.isLoading ? (
            <Loader size="16" className="animate-spin-slow" />
          ) : (
            <Trash size="16" aria-label="delete" />
          )}
          <span className="pl-2">Revoke access</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-6">
      <DataGrid
        disableColumnMenu
        autoHeight
        rows={users}
        columns={columns}
        paginationMode="server"
        paginationModel={paginationModel}
        pageSizeOptions={[pageSize]}
        rowCount={count}
        onPaginationModelChange={({ page: newPage }) => onPageChanged(newPage)}
        sx={{ border: 'none' }}
        disableRowSelectionOnClick={true}
        className="authorized-users-list"
      />
    </div>
  );
}
