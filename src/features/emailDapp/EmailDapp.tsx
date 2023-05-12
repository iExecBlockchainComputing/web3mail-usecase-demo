import './EmailDapp.css';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Box, Button, InputBase } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

export default function EmailDapp() {
  const naviguate = useNavigate();

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
      field: 'Eth_Address',
      headerName: 'Eth Address',
      type: 'string',
      width: 350,
    },
    { field: 'Subscribe_on', headerName: 'Subscribe on', width: 400 },
    {
      field: 'Actions',
      headerName: 'Actions',
      width: 500,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => naviguate(`./sendMessageTo/${params.row.Eth_Address}`)}
        >
          Send Message
        </Button>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      avatar: 'https://material-ui.com/static/images/avatar/1.jpg',
      Eth_Address: '0x873a....883',
      Subscribe_on: '6/14/2021',
    },
    {
      id: 2,
      avatar: 'https://material-ui.com/static/images/avatar/2.jpg',
      Eth_Address: '0x793a....az3',
      Subscribe_on: '6/14/2021',
    },
    {
      id: 3,
      avatar: 'https://material-ui.com/static/images/avatar/2.jpg',
      Eth_Address: '0x563a....7jh',
      Subscribe_on: '6/14/2021',
    },
    {
      id: 4,
      avatar: 'https://material-ui.com/static/images/avatar/2.jpg',
      Eth_Address: '0x12l7....373',
      Subscribe_on: '6/14/2021',
    },
  ];

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
        />
      </Box>
      <Box sx={{ my: 10, height: 400 }}>
        <DataGrid
          disableColumnMenu
          rows={rows}
          columns={columns}
          sx={{ border: 'none' }}
        />
      </Box>
    </Box>
  );
}
