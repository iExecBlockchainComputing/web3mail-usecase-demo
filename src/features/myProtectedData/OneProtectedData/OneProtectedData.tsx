import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AtSign, ChevronLeft, Link, Plus, Slash, User } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Alert } from '@/components/Alert.tsx';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { DocLink } from '@/components/DocLink.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { PROTECTED_DATA } from '@/config/path.ts';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { getTypeOfProtectedData } from '@/utils/utils.ts';
import AuthorizedUsersList from './AuthorizedUsersList';
import GrantAccessModal from './GrantAccessModal';

// The list of users authorized to access the protected data is paginated
// Must be greater than or equal to 10
const AUTHORIZED_ADDRESSES_PER_PAGE = 10;

export default function OneProtectedData() {
  const { protectedDataAddress } = useParams();
  const { address } = useAccount();

  const [page, setPage] = useState(0);

  //modal state
  const [modalOpen, setModalOpen] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: { grantedAccessList, count },
  } = useQuery({
    queryKey: ['grantedAccess', protectedDataAddress],
    queryFn: async () => {
      const { dataProtector } = await getDataProtectorClient();
      return dataProtector.getGrantedAccess({
        protectedData: protectedDataAddress,
        page,
        pageSize: AUTHORIZED_ADDRESSES_PER_PAGE,
      });
    },
  });

  const { data: protectedData = [] } = useFetchProtectedDataQuery(
    address as string
  );

  //process queries to get the data we need
  const protectedDataSelected = protectedData?.find(
    (item) => item.address === protectedDataAddress
  );

  return (
    <div>
      <div className="text-left">
        <Button asChild variant="text" size="sm">
          <Link to={`/${PROTECTED_DATA}`} className="pl-2">
            <ChevronLeft size="22" />
            <span className="pl-1">Back</span>
          </Link>
        </Button>
      </div>
      <div className="mt-4 rounded-md border border-grey-800/40 py-6 pl-3 pr-5 text-left">
        <ul className="flex flex-col gap-y-4 pl-6">
          {protectedDataSelected?.name && (
            <li className="-mb-1">
              <h2 className="inline">{protectedDataSelected?.name}</h2>
            </li>
          )}
          <li>
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
          </li>
          <li className="flex items-center gap-x-1.5">
            <AtSign size="18" aria-label="user-icon" />
            Protected Data Address:{' '}
            <strong>{protectedDataSelected?.address}</strong>
          </li>
          <li className="flex items-center gap-x-1.5">
            <User size="18" aria-label="user-icon" />
            Owned by: <strong>{protectedDataSelected?.owner}</strong>
          </li>
          <li className="flex items-center gap-x-1.5">
            <Link size="18" aria-label="user-icon" />
            IPFS link:{' '}
            <i>{'Will be provided with the next version of subgraph'}</i>
            {/*<strong>*/}
            {/*  {protectedDataSelected?.multiaddr}*/}
            {/*</strong>{' '}*/}
            {/*(encrypted content)*/}
          </li>
        </ul>
      </div>
      <div className="my-10">
        {isLoading && (
          <div className="flex flex-col items-center gap-y-4">
            <CircularLoader />
            Fetching authorized users...
          </div>
        )}

        {isError && (
          <div className="mt-10 flex flex-col items-center">
            <Alert variant="error">
              <p>Oops, something went wrong while fetching authorized users.</p>
              <p className="text-orange-300">{error.toString()}</p>
            </Alert>
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
              These are the users who you allowed to access this protected data.
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
            <Plus size="19" />
            <span className="pl-2">Authorize a new user</span>
          </Button>
        </div>

        <DocLink className="mt-20">
          dataprotector-sdk / Methods called in this page:
          <br />
          <div className="mt-1 pl-10">
            -{' '}
            <a
              href="https://beta.tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/getGrantedAccess.html"
              target="_blank"
              rel="noreferrer"
              className="text-link hover:underline"
            >
              getGrantedAccess()
            </a>
          </div>
          <div className="mt-1 pl-10">
            -{' '}
            <a
              href="https://beta.tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/grantAccess.html"
              target="_blank"
              rel="noreferrer"
              className="text-link hover:underline"
            >
              grantAccess()
            </a>
          </div>
          <div className="mt-1 pl-10">
            -{' '}
            <a
              href="https://beta.tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/revokeOneAccess.html"
              target="_blank"
              rel="noreferrer"
              className="text-link hover:underline"
            >
              revokeOneAccess()
            </a>
          </div>
        </DocLink>

        {modalOpen && (
          <GrantAccessModal
            protectedData={protectedDataAddress as string}
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
