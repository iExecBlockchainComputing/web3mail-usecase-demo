import './EmailDapp.css';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Box, Button, InputBase } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useFetchMyContactsQuery } from '../../app/appSlice';
import { useEffect, useState } from 'react';
import { Contact, Address, TimeStamp } from '@iexec/web3mail';

type Row = {
  id: string;
  avatar: string;
  owner: Address;
  accessGrantTimestamp: TimeStamp;
};

export default function EmailDapp() {
  const navigate = useNavigate();

  //query RTK API as query hook
  const { data: fetchMyContacts = [] } = useFetchMyContactsQuery();
  const [rows, setRows] = useState<Row[]>([]);

  //for search bar
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Avatar alt={params.row.name} src={params.row.avatar} />
      ),
    },
    {
      field: 'owner',
      headerName: 'Eth Address',
      type: 'string',
      width: 350,
    },
    { field: 'accessGrantTimestamp', headerName: 'Subscribe on', width: 400 },
    {
      field: 'Actions',
      headerName: 'Actions',
      width: 500,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`./sendMessageTo/${params.row.owner}`)}
        >
          Send Message
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (fetchMyContacts.length > 0) {
      const rows = fetchMyContacts.map((contact: Contact, index: number) => {
        return {
          id: index.toString(),
          avatar: '/static/images/avatar/.jpg',
          owner: contact.owner.toLowerCase(),
          accessGrantTimestamp: contact.accessGrantTimestamp,
        };
      });
      setRows(rows);
    }
  }, [fetchMyContacts]);

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
      {filteredRows.length > 0 ? (
        <Box sx={{ my: 10, height: 400 }}>
          <DataGrid
            disableColumnMenu
            rows={filteredRows}
            columns={columns}
            sx={{ border: 'none' }}
          />
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <h4>You have no subscribers!</h4>
        </Box>
      )}
    </Box>
  );
}
