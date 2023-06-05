import './EmailDapp.css';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, InputBase } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useFetchMyContactsQuery } from '../../app/appSlice';
import { useEffect, useState } from 'react';
import { Contact, Address, TimeStamp } from '@iexec/web3mail';
import { getLocalDateString } from '../../utils/utils';

type Row = {
  id: string;
  owner: Address;
  protectedDataAddress: Address;
  accessGrantTimestamp: TimeStamp;
};

export default function EmailDapp() {
  const navigate = useNavigate();

  //query RTK API as query hook
  const { data: myContacts = [], isLoading } = useFetchMyContactsQuery();
  const [rows, setRows] = useState<Row[]>([]);
  console.log('myContacts', myContacts, isLoading);
  //for search bar
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);

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
              `./sendMessageTo/${params.row.owner}/${params.row.protectedDataAddress}`
            )
          }
        >
          Send Message
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (myContacts.length > 0) {
      const rows = myContacts.map((contact: Contact, index: number) => {
        return {
          id: index.toString(),
          owner: contact.owner.toLowerCase(),
          protectedDataAddress: contact.address.toLowerCase(),
          accessGrantTimestamp: getLocalDateString(
            contact.accessGrantTimestamp
          ),
        };
      });
      setRows(rows);
    }
  }, [myContacts]);

  useEffect(() => {
    if (rows.length > 0) {
      setFilteredRows(
        rows.filter((row: { owner: string }) =>
          row.owner.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, rows]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box sx={{ m: 10, mx: 20 }}>
      <h2>List of integrations to interact with your subscribers</h2>
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
