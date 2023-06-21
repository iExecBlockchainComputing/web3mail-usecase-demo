import { Box, Button, Grid, Pagination, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  selectAppIsConnected,
  useFetchProtectedDataQuery,
} from '../../app/appSlice';
import { useAppSelector } from '../../app/hooks';
import img from '../../assets/noData.png';
import ProtectedDataCard from '../../components/ProtectedDataCard';
import { ITEMS_PER_PAGE } from '../../config/config';
import './ProtectedData.css';
import { CREATE } from '../../config/path';

export default function ProtectedData() {
  const { address } = useAccount();
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  //query RTK API as query hook
  const { data: protectedData = [] } = useFetchProtectedDataQuery(
    address as string,
    {
      skip: !isAccountConnected,
    }
  );

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = protectedData.slice(startIndex, endIndex);

  return (
    <Box sx={{ mx: 10 }}>
      {protectedData.length !== 0 ? (
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              my: 7,
            }}
          >
            <h2>My Protected Data</h2>
            <Box sx={{ my: 'auto' }}>
              <NewProtectedDataButton />
            </Box>
          </Box>
          <Box sx={{ mx: 4, paddingBottom: 20 }}>
            <Grid container spacing={2}>
              {currentData?.map(({ address, name, schema }) => (
                <Grid item key={address}>
                  <ProtectedDataCard
                    id={address}
                    title={name || 'Undefined'}
                    schema={schema}
                  />
                </Grid>
              ))}
            </Grid>
            <Paper id="pagination">
              <Pagination
                count={Math.ceil(protectedData.length / ITEMS_PER_PAGE)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Paper>
          </Box>
        </Box>
      ) : (
        <Box>
          <img src={img} alt="The image can't be loaded" id="logo" />
          <p>You have no protected data yet. Go create one!</p>
          <Box sx={{ mt: 7 }}>
            <NewProtectedDataButton />
          </Box>
        </Box>
      )}
    </Box>
  );
}

function NewProtectedDataButton() {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate(`./${CREATE}`)}>
      Protect new data
    </Button>
  );
}
