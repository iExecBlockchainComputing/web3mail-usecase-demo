import { useParams } from 'react-router-dom';
import { Loader, Trash, User } from 'react-feather';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRevokeOneAccessMutation } from '@/app/appSlice.ts';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import './AuthorizedUsersList.css';

interface AuthorizedUsersListProps {
  authorizedUsers: Array<{
    id: string;
    requesterRestrict: string;
    appRestrict: string;
  }>;
  count: number;
  pageSize: number;
  page: number;
  onPageChanged: (newPage: number) => void;
}

export default function AuthorizedUsersList(props: AuthorizedUsersListProps) {
  const { authorizedUsers, count, pageSize, page, onPageChanged } = props;
  const { protectedDataAddress } = useParams();

  const { toast } = useToast();

  const paginationModel = {
    pageSize,
    page,
  };

  //query RTK API as mutation hook
  const [revokeOneAccess, result] = useRevokeOneAccessMutation();

  function handleRevoke(value: string) {
    if (!protectedDataAddress) {
      return;
    }
    revokeOneAccess({
      protectedData: protectedDataAddress,
      authorizedUser: value,
    })
      .unwrap()
      .then(() => {
        toast({
          title: 'The granted access has been successfully revoked!',
        });
      })
      .catch((err) => {
        toast({
          variant: 'danger',
          title: err || 'Failed to revoke access.',
        });
      });
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
      field: 'requesterRestrict',
      sortable: false,
      type: 'string',
      flex: 1,
    },
    {
      field: 'appRestrict',
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
        rows={authorizedUsers}
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
