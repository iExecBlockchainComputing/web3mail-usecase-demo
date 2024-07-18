import { useUserStore } from '@/stores/user.store.ts';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Alert } from '@/components/Alert.tsx';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { DocLink } from '@/components/DocLink.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ITEMS_PER_PAGE } from '@/config/config.ts';
import { CREATE } from '@/config/path.ts';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { MyProtectedDataPagination } from '@/features/myProtectedData/MyProtectedDataPagination.tsx';
import ProtectedDataCard from '@/features/myProtectedData/ProtectedDataCard.tsx';
import { getLocalDateFromBlockchainTimestamp } from '@/utils/utils.ts';
import img from '../../assets/noData.png';
import './MyProtectedData.css';

export default function MyProtectedData() {
  const { address } = useUserStore();

  const {
    isLoading,
    isError,
    data: protectedData,
  } = useQuery({
    queryKey: ['myProtectedData'],
    queryFn: async () => {
      const { dataProtector } = await getDataProtectorClient();
      return dataProtector.getProtectedData({ owner: address });
    },
  });

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = protectedData?.slice(startIndex, endIndex);

  const nodeRef = useRef(null);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularLoader className="mt-10"></CircularLoader>
          Fetching your protected data...
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center">
          <Alert variant="error">
            Oops, something went wrong while fetching your protected data.
          </Alert>
        </div>
      )}

      {!isLoading && !isError && protectedData?.length === 0 && (
        <div className="-mt-8 text-center">
          <img
            src={img}
            alt="The image can't be loaded"
            id="logo"
            className="mx-auto"
          />
          <p>
            You haven't protected any data yet. Starting is as easy as pressing
            the button below.
          </p>
          <div className="mt-10">
            <NewProtectedDataButton />
          </div>
        </div>
      )}

      <CSSTransition
        appear={!isLoading && protectedData?.length > 0}
        in={!isLoading && protectedData?.length > 0}
        nodeRef={nodeRef}
        timeout={200}
        classNames="fade"
        onEntered={() => {
          // @ts-ignore
          nodeRef.current?.classList.remove('opacity-0');
        }}
      >
        <div ref={nodeRef} className="opacity-0">
          <div className="flex flex-row justify-between gap-x-12">
            <div>
              <h2 className="mt-0">My Protected Data</h2>
              <p className="-mt-3">
                Confidentially manage your protected data. Easily create,
                review, authorize, and revoke access.
              </p>
            </div>
            <NewProtectedDataButton />
          </div>

          <div className="mb-28 mt-14">
            <div
              className="mx-6 grid gap-7"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              }}
            >
              {currentData?.map(
                ({ address, name, schema, creationTimestamp }) => (
                  <div
                    key={address}
                    className="flex w-full items-center justify-center"
                  >
                    <div className="max-w-[300px] flex-1">
                      <ProtectedDataCard
                        id={address}
                        title={name || '(No name)'}
                        schema={schema}
                        date={getLocalDateFromBlockchainTimestamp(
                          creationTimestamp
                        )}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            {protectedData?.length > ITEMS_PER_PAGE && (
              <div className="mt-16 flex justify-center">
                <MyProtectedDataPagination
                  count={Math.ceil(protectedData?.length / ITEMS_PER_PAGE)}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          <DocLink>
            dataprotector-sdk / Method called in this page:{' '}
            <a
              href="https://beta.tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/getProtectedData.html"
              target="_blank"
              rel="noreferrer"
              className="text-link hover:underline"
            >
              getProtectedData()
            </a>
          </DocLink>
        </div>
      </CSSTransition>
    </>
  );
}

function NewProtectedDataButton() {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(`./${CREATE}`)} className="pl-4">
      <Plus size="19" />
      <span className="whitespace-nowrap pl-2">Add new</span>
    </Button>
  );
}
