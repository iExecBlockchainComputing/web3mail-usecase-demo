import { useParams } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { Loader } from 'react-feather';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRevokeOneAccessMutation } from '@/app/appSlice.ts';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import './AuthorizedUsersList.css';

interface AuthorizedUsersListProps {
  authorizedUsers: string[];
  count: number;
  pageSize: number;
  page: number;
  onPageChanged: (newPage: number) => void;
}

export default function AuthorizedUsersList(props: AuthorizedUsersListProps) {
  const { authorizedUsers, count, pageSize, page, onPageChanged } = props;
  const { ProtectedDataId } = useParams();

  const { toast } = useToast();

  const paginationModel = {
    pageSize,
    page,
  };

  const users = authorizedUsers.map((user) => ({ id: user }));

  //query RTK API as mutation hook
  const [revokeOneAccess, result] = useRevokeOneAccessMutation();

  function handleRevoke(value: string) {
    revokeOneAccess({
      protectedData: ProtectedDataId,
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
      width: 60,
      renderHeader: () => null,
      renderCell: () => <Avatar alt={`Avatar`} />,
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
          onClick={() => handleRevoke(params.value)}
        >
          {result.isLoading ? (
            <Loader className="animate-spin-slow" size="16" />
          ) : (
            <DeleteIcon fontSize="small" aria-label="delete" />
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
