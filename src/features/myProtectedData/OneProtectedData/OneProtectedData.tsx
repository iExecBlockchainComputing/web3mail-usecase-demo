import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { Box, CircularProgress } from '@mui/material';
import { useAccount } from 'wagmi';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Slash } from 'react-feather';
import { Button } from '@/components/ui/button.tsx';
import {
  useFetchGrantedAccessQuery,
  useFetchProtectedDataQuery,
} from '@/app/appSlice.ts';
import { getTypeOfProtectedData } from '@/utils/utils.ts';
import { PROTECTED_DATA } from '@/config/path.ts';
import { Badge } from '@/components/ui/badge.tsx';
import ErrorAlert from '@/components/ErrorAlert.tsx';
import GrantAccessModal from './GrantAccessModal';
import AuthorizedUsersList from './AuthorizedUsersList';

// The list of users authorized to access the protected data is paginated
// Must be greater than or equal to 10
const AUTHORIZED_ADDRESSES_PER_PAGE = 10;

export default function OneProtectedData() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();

  const [page, setPage] = useState(0);

  //query RTK API as query hook
  const {
    data: { grantedAccessList = [], count = 0 } = {},
    isLoading,
    isError,
    error,
  } = useFetchGrantedAccessQuery(
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
        <Button asChild variant="text" size="sm">
          <Link to={`/${PROTECTED_DATA}`} className="pl-2">
            <ChevronLeftIcon />
            <span className="pl-0.5">Back</span>
          </Link>
        </Button>
      </div>
      <Box sx={{ textAlign: 'left' }}>
        <h2 className="h-8">{protectedDataSelected?.name}</h2>
        <Badge
          variant={
            getTypeOfProtectedData(protectedDataSelected?.schema) ===
            'Unknown type'
              ? 'secondary'
              : 'default'
          }
        >
          {getTypeOfProtectedData(protectedDataSelected?.schema)}
        </Badge>
      </Box>
      <div className="mt-8 rounded-md border border-grey-800/40 px-5 py-6 text-left">
        <ul className="flex list-disc flex-col gap-y-4 pl-6">
          <li>
            Owned by: <strong>{protectedDataSelected?.owner}</strong>
          </li>
          <li>
            Data Protected Address:{' '}
            <strong>{protectedDataSelected?.address}</strong>
          </li>
          <li>
            IPFS link:{' '}
            <i>{'Will be provided with the next version of subgraph'}</i>
          </li>
        </ul>
      </div>
      <div className="my-10">
        {isLoading && (
          <div className="flex flex-col items-center gap-y-4">
            <CircularProgress />
            Fetching authorized users...
          </div>
        )}

        {isError && (
          <div className="mt-10 flex flex-col items-center">
            <ErrorAlert>
              <div className="flex flex-col">
                <p>
                  Oops, something went wrong while fetching authorized users.
                </p>
                <p className="text-orange-300">{error.toString()}</p>
              </div>
            </ErrorAlert>
          </div>
        )}

        {!isLoading && !isError && grantedAccessList?.length === 0 && (
          <div className="my-10 flex items-center justify-center gap-x-2">
            <Slash size="18" className="inline" />
            Nobody is allowed to access this protected data.
          </div>
        )}

        {grantedAccessList?.length > 0 && (
          <>
            <h2>Authorized users</h2>
            <h3 className="-mt-4">
              These are the users who are allowed to access this protected data.
            </h3>
            <AuthorizedUsersList
              authorizedUsers={grantedAccessList}
              count={count}
              pageSize={AUTHORIZED_ADDRESSES_PER_PAGE}
              page={page}
              onPageChanged={(newPage: number) => setPage(newPage)}
            />
          </>
        )}

        <div className="mt-10 text-center">
          <Button onClick={() => setModalOpen(true)} className="pl-4">
            <AddIcon fontSize="small" />
            <span className="pl-2">Authorize a new user</span>
          </Button>
        </div>

        {modalOpen && (
          <GrantAccessModal
            protectedData={ProtectedDataId as string}
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
