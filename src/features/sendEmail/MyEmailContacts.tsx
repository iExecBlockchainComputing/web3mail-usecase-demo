import { Address, Contact, TimeStamp } from '@iexec/web3mail';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, Send, Slash } from 'react-feather';
import { Link } from 'react-router-dom';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { DocLink } from '@/components/DocLink.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { getWeb3mailClient } from '@/externals/web3mailClient.ts';
import { getLocalDateFromTimeStamp } from '@/utils/utils.ts';

type OneEmailContact = {
  id: string;
  owner: Address;
  protectedDataAddress: Address;
  accessGrantTimestamp: TimeStamp;
  // isUserStrict: boolean;
};

export default function MyEmailContacts() {
  const [searchTerm, setSearchTerm] = useState('');
  // const [showZeroAddressGrants, setShowZeroAddressGrants] = useState(false);

  const {
    isLoading,
    isSuccess,
    isError,
    error,
    data: myContacts,
  } = useQuery({
    queryKey: ['myWeb3mailContacts'],
    // queryKey: ['myWeb3mailContacts', showZeroAddressGrants],
    queryFn: async () => {
      const { web3mail } = await getWeb3mailClient();
      const myEmailContacts = await web3mail.fetchMyContacts({
        isUserStrict: true,
        // isUserStrict: !showZeroAddressGrants,
      });
      return myEmailContacts;
    },
    select: (contacts) => {
      return contacts
        .sort(
          (a: Contact, b: Contact) =>
            Date.parse(b.accessGrantTimestamp) -
            Date.parse(a.accessGrantTimestamp)
        )
        .map((contact: Contact, index: number) => {
          return {
            id: index.toString(),
            owner: contact.owner.toLowerCase(),
            protectedDataAddress: contact.address.toLowerCase(),
            accessGrantTimestamp: getLocalDateFromTimeStamp(
              contact.accessGrantTimestamp
            ),
            // isUserStrict: contact.isUserStrict,
          };
        });
    },
  });

  const filteredRows: OneEmailContact[] | undefined = myContacts?.filter(
    (contact: { owner: string }) =>
      contact.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <>
      <h2>Contacts List</h2>
      <p className="-mt-3">
        These are contacts that have protected their email address and have
        allowed you to use it.
        <br />
        You can send them a message, without knowing their email address.
      </p>

      <div className="relative mt-10">
        <Search size="20" className="absolute top-3 ml-4" />
        <Input
          placeholder="Search owner address"
          className="pl-12"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/*<div className="mt-6 flex items-center space-x-2">*/}
      {/*  <Switch*/}
      {/*    id="show-all-grants"*/}
      {/*    onCheckedChange={(isChecked) => {*/}
      {/*      setShowZeroAddressGrants(isChecked);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <Label htmlFor="show-all-grants" className="cursor-pointer">*/}
      {/*    Show grants to Zero address*/}
      {/*  </Label>*/}
      {/*</div>*/}

      {isLoading && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularLoader className="mt-10" />
          Fetching your contacts...
        </div>
      )}

      {isError && (
        <Alert variant="error" className="mt-10">
          <AlertTitle>
            Oops, something went wrong while fetching protected data shared with
            you.
          </AlertTitle>
          <AlertDescription>{error.toString()}</AlertDescription>
        </Alert>
      )}

      {isSuccess && filteredRows!.length === 0 && (
        <div className="my-10 flex items-center justify-center gap-x-2">
          <Slash size="18" className="inline" />
          So far, nobody shared their protected data with you.
        </div>
      )}

      {isSuccess && filteredRows!.length > 0 && (
        <div
          className="mt-10 grid w-full gap-x-3 px-2"
          style={{
            gridTemplateColumns: '2fr 2fr 1fr 175px',
          }}
        >
          <div className="text-sm font-normal">Owner address</div>
          <div className="text-sm font-normal">Protected data address</div>
          <div className="text-sm font-normal">Access granted on</div>
          <div className="text-sm font-normal"></div>
          <div className="border-background-4 col-span-4 -mx-2 mt-2 border-t"></div>

          {filteredRows!.map(
            ({
              id,
              owner,
              protectedDataAddress,
              accessGrantTimestamp,
              // isUserStrict,
            }) => (
              <div
                key={id}
                className="contents [&>div]:flex [&>div]:items-center [&>div]:py-2 [&>div]:text-sm"
              >
                <div className="relative min-w-0">
                  {/*{showZeroAddressGrants && !isUserStrict && (*/}
                  {/*  <TooltipProvider delayDuration={0}>*/}
                  {/*    <Tooltip>*/}
                  {/*      <TooltipTrigger className="absolute -left-7 top-4 cursor-default">*/}
                  {/*        <Users size="18" />*/}
                  {/*      </TooltipTrigger>*/}
                  {/*      <TooltipContent>*/}
                  {/*        <p>Email address shared with anyone.</p>*/}
                  {/*      </TooltipContent>*/}
                  {/*    </Tooltip>*/}
                  {/*  </TooltipProvider>*/}
                  {/*)}*/}
                  <span className="truncate">{owner}</span>
                </div>
                <div className="min-w-0">
                  <span className="truncate">{protectedDataAddress}</span>
                </div>
                <div>{accessGrantTimestamp}</div>
                <div>
                  <Button asChild size="sm" className="pl-3.5">
                    <Link to={`/sendEmail/${owner}/${protectedDataAddress}`}>
                      <Send size="15" />
                      <span className="pl-2">Send web3 email</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <DocLink className="mt-20">
        web3mail-sdk / Method called in this page:{' '}
        <a
          href="https://beta.tools.docs.iex.ec/tools/web3mail/methods/fetchMyContacts.html"
          target="_blank"
          rel="noreferrer"
          className="text-link hover:underline"
        >
          fetchMyContacts()
        </a>
      </DocLink>
    </>
  );
}
