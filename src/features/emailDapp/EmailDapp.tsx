import { Address, Contact, TimeStamp } from '@iexec/web3mail';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, InputBase } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  selectAppIsConnected,
  useFetchMyContactsQuery,
} from '../../app/appSlice';
import { useAppSelector } from '../../app/hooks';
import { getLocalDateString } from '../../utils/utils';
import './EmailDapp.css';

type Row = {
  id: string;
  owner: Address;
  protectedDataAddress: Address;
  accessGrantTimestamp: TimeStamp;
};

export default function EmailDapp() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  //query RTK API as query hook
  const { data: myContacts = [], isLoading } = useFetchMyContactsQuery(
    address as string,
    {
      skip: !isAccountConnected,
    }
  );

  //for search bar
  const [searchTerm, setSearchTerm] = useState('');

  const columns: GridColDef[] = [
    {
      field: 'owner',
      headerName: 'Eth Address',
      type: 'string',
      width: 370,
    },
    {
      field: 'protectedDataAddress',
      headerName: 'Protected Data',
      type: 'string',
      width: 370,
    },
    { field: 'accessGrantTimestamp', headerName: 'Subscribe on', width: 150 },
    {
      field: 'Actions',
      headerName: 'Actions',
      width: 350,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            navigate(
              `./${params.row.owner}/${params.row.protectedDataAddress}`
            )
          }
        >
          Send Email
        </Button>
      ),
    },
  ];

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
        accessGrantTimestamp: getLocalDateString(contact.accessGrantTimestamp),
      };
    });

  const filteredRows: Row[] = rows.filter((row: { owner: string }) =>
    row.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box sx={{ m: 10, mx: 20 }}>
      <h2>List of integrations to interact with your subscribers</h2>
      <p>A list of contacts who have subscribed using their Ethereum address. You can send them an email, without having access to their email address (protected data).</p>
      <Box id="search" sx={{ mt: 5 }}>
        <div id="iconWrapper">
          <SearchIcon sx={{ color: '#788896' }} />
        </div>
        <InputBase
          placeholder="Search address"
          inputProps={{ 'aria-label': 'search' }}
          id="inputSearch"
          sx={{ width: '100%' }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      {filteredRows.length > 0 && !isLoading && (
        <Box sx={{ my: 10, height: 400 }}>
          <DataGrid
            disableColumnMenu
            rows={filteredRows}
            columns={columns}
            autoPageSize={true}
            sx={{ border: 'none' }}
          />
        </Box>
      )}
      {filteredRows.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <h4>You have no subscribers!</h4>
        </Box>
      )}
      {isLoading && (
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <h4>Fetching your contacts...</h4>
        </Box>
      )}
    </Box>
  );
}
