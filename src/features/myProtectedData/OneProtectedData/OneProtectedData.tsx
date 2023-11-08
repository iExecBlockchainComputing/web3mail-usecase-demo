import { useState } from 'react';
import Chip from '@iexec/react-ui-kit/components/Chip';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button.tsx';
import {
  useFetchGrantedAccessQuery,
  useFetchProtectedDataQuery,
} from '@/app/appSlice.ts';
import { isKeyInDataSchema } from '@/utils/utils.ts';
import GrantAccessModal from './GrantAccessModal';
import AuthorizedUsersList from './AuthorizedUsersList';
import { PROTECTED_DATA } from '@/config/path.ts';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import './OneProtectedData.css';

// The list of users authorized to access the protected data is paginated
// Must be greater than or equal to 10
const AUTHORIZED_ADDRESSES_PER_PAGE = 10;

export default function OneProtectedData() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();

  const [page, setPage] = useState(0);

  //query RTK API as query hook
  const { data: { grantedAccessList = [], count = 0 } = {} } =
    useFetchGrantedAccessQuery(
      {
        protectedData: ProtectedDataId!,
        page,
        pageSize: AUTHORIZED_ADDRESSES_PER_PAGE,
      },
      {
        skip: !ProtectedDataId,
      }
    );

  const { data: protectedData = [] } = useFetchProtectedDataQuery(
    address as string
  );

  //process queries to get the data we need
  const protectedDataSelected = protectedData?.find(
    (item) => item.address === ProtectedDataId
  );

  //modal state
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="text-left">
        <Button asChild variant="text">
          <Link to={`/${PROTECTED_DATA}`} className="pl-4">
            <ChevronLeftIcon />
            <span className="pl-1">Back</span>
          </Link>
        </Button>
      </div>
      <Box sx={{ textAlign: 'left' }}>
        <h2>{protectedDataSelected?.name}</h2>
        <Chip
          className="chipType"
          label={
            (isKeyInDataSchema(protectedDataSelected?.schema || {}, 'email') &&
              'Email') ||
            (isKeyInDataSchema(protectedDataSelected?.schema || {}, 'file') &&
              'File') ||
            'Unknown'
          }
          size="small"
          children={''}
        />
      </Box>
      <div className="mt-8 rounded-sm border border-grey-800/40 px-5 py-6 text-left">
        <ul className="flex list-disc flex-col gap-y-4 pl-6">
          <li>Owned by {protectedDataSelected?.owner}</li>
          <li>Data Protected Address: {protectedDataSelected?.address}</li>
          <li>
            IPFS link: {'Set in future with the next version of subgraph'}
          </li>
        </ul>
      </div>
      <Box sx={{ my: 5, mb: 20 }}>
        {grantedAccessList?.length > 0 ? (
          <>
            <h2>Authorized users</h2>
            <AuthorizedUsersList
              authorizedUsers={grantedAccessList}
              count={count}
              pageSize={AUTHORIZED_ADDRESSES_PER_PAGE}
              page={page}
              onPageChanged={(newPage: number) => setPage(newPage)}
            />
          </>
        ) : (
          <div className="mb-6 text-center">
            <h4>No authorized user for web3Mail dApp</h4>
          </div>
        )}

        <div className="text-center">
          <Button onClick={() => setModalOpen(true)} className="pl-4">
            <AddIcon fontSize="small" />
            <span className="pl-2">Authorize a new user</span>
          </Button>
        </div>

        <GrantAccessModal
          protectedData={ProtectedDataId as string}
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      </Box>
    </div>
  );
}