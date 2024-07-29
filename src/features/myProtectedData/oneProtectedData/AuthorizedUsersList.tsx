import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { Slash, User } from 'react-feather';
import { useParams } from 'react-router-dom';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { RevokeAccessButton } from '@/features/myProtectedData/oneProtectedData/RevokeAccessButton.tsx';

export default function AuthorizedUsersList() {
  const { protectedDataAddress } = useParams();

  const {
    isLoading,
    isError,
    error,
    data: grantedAccessResponse,
  } = useQuery({
    queryKey: ['grantedAccess', protectedDataAddress],
    queryFn: async () => {
      const { dataProtector } = await getDataProtectorClient();
      return dataProtector.getGrantedAccess({
        protectedData: protectedDataAddress,
      });
      // In case of error, logs and rollbar alert handled by tanstack query config in main.tsx
    },
  });

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularLoader />
          Fetching authorized users...
        </div>
      )}

      {isError && (
        <Alert variant="error" className="mt-10">
          <AlertTitle>
            Oops, something went wrong while fetching authorized users.
          </AlertTitle>
          <AlertDescription>{error.toString()}</AlertDescription>
        </Alert>
      )}

      {!isLoading &&
        !isError &&
        grantedAccessResponse?.grantedAccess.length === 0 && (
          <div className="my-10 flex items-center justify-center gap-x-2">
            <Slash size="18" className="inline" />
            Nobody is allowed to access this protected data.
          </div>
        )}

      {!!grantedAccessResponse?.grantedAccess &&
        grantedAccessResponse.grantedAccess.length > 0 && (
          <>
            <h2>Authorized users</h2>
            <h3 className="-mt-4">
              These are the users who you allowed to access this protected data.
            </h3>
            <div className="mt-6 grid grid-cols-[min-content_1fr_min-content]">
              {grantedAccessResponse.grantedAccess.map((authorizedUser) => (
                <div
                  key={authorizedUser.requesterrestrict}
                  className={clsx(
                    'contents bg-grey-100 text-sm [&>div]:flex [&>div]:items-center [&>div]:px-3 [&>div]:py-2'
                  )}
                >
                  <div>
                    <div className="rounded-full bg-grey-300 p-2">
                      <User
                        size="20"
                        aria-label="user-icon"
                        className="text-white"
                      />
                    </div>
                  </div>
                  <div>{authorizedUser.requesterrestrict}</div>
                  <div>
                    <RevokeAccessButton grantedAccess={authorizedUser} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
    </>
  );
}
