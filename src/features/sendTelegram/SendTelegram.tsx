import './SendTelegram.css';
import { Search, Send, Slash } from 'react-feather';
import { Input } from '@/components/ui/input.tsx';
import { CircularLoader } from '@/components/CircularLoader.tsx';
import { Alert } from '@/components/Alert.tsx';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DocLink } from '@/components/DocLink.tsx';
import { useState } from 'react';
import {
  selectAppIsConnected,
  useFetchMyTelegramContactsQuery,
} from '@/app/appSlice.ts';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAppSelector } from '@/app/hooks.ts';
import { Address, Contact, TimeStamp } from '@iexec/web3mail';
import { getLocalDateFromTimeStamp } from '@/utils/utils.ts';
import { Button } from '@/components/ui/button.tsx';

type Row = {
  id: string;
  owner: Address;
  protectedDataAddress: Address;
  accessGrantTimestamp: TimeStamp;
};

export default function SendTelegram() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const navigate = useNavigate();
  const { address } = useAccount();
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  //query RTK API as query hook
  const {
    data: myContacts = [],
    isLoading,
    isError,
  } = useFetchMyTelegramContactsQuery(address as string, {
    skip: !isAccountConnected,
  });

  //modified the return of fetchMyContact in the web3Mail SDK to order them by timestamp
  const rows: Row[] = [...myContacts]
    .sort(
      (a: Contact, b: Contact) =>
        Date.parse(b.accessGrantTimestamp) - Date.parse(a.accessGrantTimestamp)
    )
    .map((contact: Contact, index: number) => {
      return {
        id: index.toString(),
        owner: contact.owner.toLowerCase(),
        protectedDataAddress: contact.address.toLowerCase(),
        accessGrantTimestamp: getLocalDateFromTimeStamp(
          contact.accessGrantTimestamp
        ),
      };
    });

  const filteredRows: Row[] = rows.filter((row: { owner: string }) =>
    row.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // A CHANGER?
  const columns: GridColDef[] = [
    {
      field: 'owner',
      headerName: 'Owner address',
      type: 'string',
      flex: 2,
    },
    {
      field: 'protectedDataAddress',
      headerName: 'Protected data address',
      type: 'string',
      flex: 2,
    },
    { field: 'accessGrantTimestamp', headerName: 'Access granted on', flex: 1 },
    {
      field: 'Actions',
      headerName: 'Actions',
      sortable: false,
      width: 175,
      renderCell: (params) => (
        <Button
          size="sm"
          className="pl-3.5"
          onClick={() =>
            navigate(`./${params.row.owner}/${params.row.protectedDataAddress}`)
          }
        >
          <Send size="15" />
          <span className="pl-2">Send telegram</span>
        </Button>
      ),
    },
  ];

  return (
    <>
      <h2>Contacts List</h2>
      <p className="-mt-3">
        These are contacts that have protected their email address and have
        allowed you to use it.
        <br />
        You can send them a message, without knowing their telegram username.
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

      {isLoading && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularLoader className="mt-10" />
          Fetching your contacts...
        </div>
      )}

      {isError && (
        <div className="mt-10 flex flex-col items-center">
          <Alert variant="error">
            Oops, something went wrong while fetching protected data shared with
            you.
          </Alert>
        </div>
      )}

      {!isLoading && !isError && filteredRows.length === 0 && (
        <div className="my-10 flex items-center justify-center gap-x-2">
          <Slash size="18" className="inline" />
          So far, nobody shared their protected data with you.
        </div>
      )}

      {filteredRows.length > 0 && !isLoading && (
        <div className="mt-8 w-full">
          <DataGrid
            disableColumnMenu
            rows={filteredRows}
            columns={columns}
            sx={{ border: 'none' }}
          />
        </div>
      )}

      <DocLink className="mt-20">
        web3telegram-sdk / Method called in this page (not yet) :{' '}
        <a
          href="https://tools.docs.iex.ec/tools/web3mail/methods/fetchmycontacts"
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
