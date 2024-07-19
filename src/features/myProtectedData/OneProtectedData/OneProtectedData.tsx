import { ProtectedData } from '@iexec/dataprotector';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AtSign, ChevronLeft, Link, Plus, User } from 'react-feather';
import { useParams } from 'react-router-dom';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { DocLink } from '@/components/DocLink.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { getTypeOfProtectedData } from '@/utils/utils.ts';
import AuthorizedUsersList from './AuthorizedUsersList';
import GrantAccessModal from './GrantAccessModal';

export default function OneProtectedData() {
  const { protectedDataAddress } = useParams();

  const [protectedData, setProtectedData] = useState<ProtectedData>();

  //modal state
  const [modalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const allProtectedData = queryClient.getQueryData<ProtectedData[]>([
      'myProtectedData',
    ]);
    const cachedProtectedData = allProtectedData?.find(
      (oneProtectedData) => oneProtectedData.address === protectedDataAddress
    );
    setProtectedData(cachedProtectedData);
  }, []);

  const {
    isLoading: isFetchingProtectedData,
    isError: isFetchProtectedDataError,
  } = useQuery({
    queryKey: ['oneProtectedData', protectedDataAddress],
    queryFn: async () => {
      const { dataProtector } = await getDataProtectorClient();
      const oneProtectedData = await dataProtector.getProtectedData({
        protectedDataAddress,
      });
      setProtectedData(oneProtectedData?.[0]);
      return oneProtectedData;
    },
    enabled: !protectedData,
  });

  return (
    <div>
      <div className="text-left">
        <Button asChild variant="text" size="sm">
          <Link to={`/protected-data`} className="pl-2">
            <ChevronLeft size="22" />
            <span className="pl-1">Back</span>
          </Link>
        </Button>
      </div>

      {!protectedData && isFetchingProtectedData && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularLoader className="mt-10"></CircularLoader>
          Fetching your protected data...
        </div>
      )}

      {protectedData && (
        <div className="mt-4 rounded-md border border-grey-800/40 py-6 pl-3 pr-5 text-left">
          <ul className="flex flex-col gap-y-4 pl-6">
            {protectedData?.name && (
              <li className="-mb-1">
                <h2 className="inline">{protectedData?.name}</h2>
              </li>
            )}
            <li>
              <Badge
                variant={
                  getTypeOfProtectedData(protectedData?.schema) ===
                  'Unknown type'
                    ? 'secondary'
                    : 'default'
                }
              >
                {getTypeOfProtectedData(protectedData?.schema)}
              </Badge>
            </li>
            <li className="flex items-center gap-x-1.5">
              <AtSign size="18" aria-label="user-icon" />
              Protected Data Address: <strong>{protectedData?.address}</strong>
            </li>
            <li className="flex items-center gap-x-1.5">
              <User size="18" aria-label="user-icon" />
              Owned by: <strong>{protectedData?.owner}</strong>
            </li>
            <li className="flex items-center gap-x-1.5">
              <Link size="18" aria-label="user-icon" />
              IPFS link:{' '}
              <i>{'Will be provided with the next version of subgraph'}</i>
              {/*<strong>*/}
              {/*  {protectedData?.multiaddr}*/}
              {/*</strong>{' '}*/}
              {/*(encrypted content)*/}
            </li>
          </ul>
        </div>
      )}

      <div className="my-10">
        <AuthorizedUsersList />

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
