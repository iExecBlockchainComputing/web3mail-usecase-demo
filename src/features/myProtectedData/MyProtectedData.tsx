import { useState } from 'react';
import { Box, Grid, Pagination, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@/components/ui/button';
import {
  selectAppIsConnected,
  useFetchProtectedDataQuery,
} from '@/app/appSlice';
import { useAppSelector } from '@/app/hooks';
import img from '../../assets/noData.png';
import ProtectedDataCard from '@/components/ProtectedDataCard';
import { ITEMS_PER_PAGE } from '@/config/config';
import { CREATE } from '@/config/path';
import { getLocalDateFromBlockchainTimestamp } from '@/utils/utils';
import './MyProtectedData.css';

export default function MyProtectedData() {
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
    <div>
      {protectedData.length !== 0 ? (
        <div>
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
              {currentData?.map(
                ({ address, name, schema, creationTimestamp }) => (
                  <Grid item key={address}>
                    <ProtectedDataCard
                      id={address}
                      title={name || 'Undefined'}
                      schema={schema}
                      date={getLocalDateFromBlockchainTimestamp(
                        creationTimestamp
                      )}
                    />
                  </Grid>
                )
              )}
            </Grid>
            <Paper id="pagination">
              <Pagination
                count={Math.ceil(protectedData.length / ITEMS_PER_PAGE)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Paper>
          </Box>
        </div>
      ) : (
        <Box>
          <img src={img} alt="The image can't be loaded" id="logo" />
          <p>
            You haven't protected any data yet. Starting is as easy as pressing
            the button below.
          </p>
          <Box sx={{ mt: 7 }}>
            <NewProtectedDataButton />
          </Box>
        </Box>
      )}
    </div>
  );
}

function NewProtectedDataButton() {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(`./${CREATE}`)} className="pl-4">
      <AddIcon fontSize="small" />
      <span className="pl-2">Add new</span>
    </Button>
  );
}
