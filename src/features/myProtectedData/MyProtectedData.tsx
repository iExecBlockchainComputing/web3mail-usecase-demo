import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Box, CircularProgress, Grid, Pagination, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CSSTransition } from 'react-transition-group';
import { Button } from '@/components/ui/button.tsx';
import ErrorAlert from '@/components/ErrorAlert.tsx';
import {
  selectAppIsConnected,
  useFetchProtectedDataQuery,
} from '@/app/appSlice.ts';
import { useAppSelector } from '@/app/hooks.ts';
import img from '../../assets/noData.png';
import ProtectedDataCard from '@/features/myProtectedData/ProtectedDataCard.tsx';
import { ITEMS_PER_PAGE } from '@/config/config.ts';
import { CREATE } from '@/config/path.ts';
import { getLocalDateFromBlockchainTimestamp } from '@/utils/utils.ts';
import './MyProtectedData.css';

export default function MyProtectedData() {
  const { address } = useAccount();
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  //query RTK API as query hook
  const {
    data: protectedData = [],
    isLoading,
    isError,
  } = useFetchProtectedDataQuery(address as string, {
    skip: !isAccountConnected,
  });

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = protectedData.slice(startIndex, endIndex);

  const nodeRef = useRef(null);

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col items-center gap-y-4">
          <CircularProgress className="mt-10"></CircularProgress>
          Fetching your protected data...
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center">
          <ErrorAlert>
            Oops, something went wrong while fetching your protected data.
          </ErrorAlert>
        </div>
      )}

      {!isLoading && !isError && protectedData.length === 0 && (
        <div className="text-center">
          <img
            src={img}
            alt="The image can't be loaded"
            id="logo"
            className="mx-auto"
          />
          <p>
            You haven't protected any data yet. Starting is as easy as pressing
            the button below.
          </p>
          <Box sx={{ mt: 7 }}>
            <NewProtectedDataButton />
          </Box>
        </div>
      )}

      <CSSTransition
        appear={!isLoading && protectedData.length > 0}
        in={!isLoading && protectedData.length > 0}
        nodeRef={nodeRef}
        timeout={200}
        classNames="fade"
        onEntered={() => {
          // @ts-ignore
          nodeRef.current?.classList.remove('opacity-0');
        }}
      >
        <div ref={nodeRef} className="opacity-0">
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
            <Grid container spacing={3}>
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
      </CSSTransition>
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
