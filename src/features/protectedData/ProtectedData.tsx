import './ProtectedData.css';
import ProtectedDataCard from '../../components/ProtectedDataCard';
import img from '../../assets/noData.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Box, Button, Grid, Pagination, Paper } from '@mui/material';
import { ProtectedData as ProtectedDataType } from '@iexec/dataprotector';
import {
  useFetchProtectedDataQuery,
  selectAppIsConnected,
} from '../../app/appSlice';
import { useAppSelector } from '../../app/hooks';

const ITEMS_PER_PAGE = 8;

export default function ProtectedData() {
  const { address } = useAccount();
  const isAccountConnected = useAppSelector(selectAppIsConnected);
  const { data: protectedData = [] } = useFetchProtectedDataQuery(
    address as string,
    {
      skip: !isAccountConnected,
    }
  );

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
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
              {currentData?.map((e: ProtectedDataType) => (
                <Grid item key={e.address}>
                  <ProtectedDataCard
                    id={e.address}
                    title={e.name || 'Undifined'}
                    schema={e.schema}
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
          <img src={img} alt="The immage can't be loaded" id="logo" />
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
    <Button variant="contained" onClick={() => navigate('/NewProtectedData')}>
      Protect a new data
    </Button>
  );
}
