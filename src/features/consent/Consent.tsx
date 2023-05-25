import './Consent.css';
import ToggleList from '../../components/ToggleList';
import { useParams } from 'react-router-dom';
import { Box, Chip, Fab } from '@mui/material';
import { useFetchProtectedDataQuery } from '../../app/appSlice';
import { useAccount } from 'wagmi';
import { isDataschemaHasKey } from '../../utils/utils';
import AddIcon from '@mui/icons-material/Add';
import GrantAcessModal from './GrantAcessModal';
import { useState } from 'react';

export default function Consent() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();

  //query RTK API as query hook
  const { data: protectedData = [] } = useFetchProtectedDataQuery(
    address as string
  );
  const protectedDataSelected = protectedData?.find(
    (item) => item.address === ProtectedDataId
  );

  //modal state
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box id="consent">
      <Box sx={{ textAlign: 'left' }}>
        <h2>{protectedDataSelected?.name}</h2>
        <Chip
          id="chipType"
          label={
            (isDataschemaHasKey(protectedDataSelected?.schema, 'email') &&
              'Email') ||
            (isDataschemaHasKey(protectedDataSelected?.schema, 'file') &&
              'File') ||
            'Unknown'
          }
          size="small"
        />
      </Box>
      <Box id="summary">
        <ul>
          <li>
            <h6>Owned by {protectedDataSelected?.owner}</h6>
          </li>
          <li>
            <h6>Data Protected Address: {protectedDataSelected?.address}</h6>
          </li>
          <li>
            <h6>
              IPFS link: {'Set in furture with the next version of subgraph'}
            </h6>
          </li>
        </ul>
      </Box>
      {
        <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
          <h2>1 to 1 messaging</h2>
          <ToggleList />
          <Fab
            color="primary"
            sx={{ mx: 1.9, width: 42, height: 42, mt: 1 }}
            onClick={() => setModalOpen(true)}
          >
            <AddIcon />
          </Fab>
          <GrantAcessModal
            protectedData={ProtectedDataId as string}
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
          />
        </Box>
      }
    </Box>
  );
}
