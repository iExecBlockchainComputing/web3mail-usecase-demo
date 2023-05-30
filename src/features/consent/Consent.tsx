import './Consent.css';
import ToggleList from '../../components/ToggleList';
import { useParams } from 'react-router-dom';
import { Box, Chip, Fab } from '@mui/material';
import {
  useFetchGrantedAccessQuery,
  useFetchProtectedDataQuery,
} from '../../app/appSlice';
import { useAccount } from 'wagmi';
import { isKeyInDataSchema } from '../../utils/utils';
import { useState } from 'react';
import GrantAcessModal from './GrantAcessModal';
import AddIcon from '@mui/icons-material/Add';

export default function Consent() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();

  //query RTK API as query hook
  const { data: grantedAccessList = [] } = useFetchGrantedAccessQuery(
    ProtectedDataId!,
    {
      skip: !ProtectedDataId,
    }
  );
  const { data: protectedData = [] } = useFetchProtectedDataQuery(
    address as string
  );

  //process queries to get the data we need
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
            (isKeyInDataSchema(protectedDataSelected?.schema, 'email') &&
              'Email') ||
            (isKeyInDataSchema(protectedDataSelected?.schema, 'file') &&
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
              IPFS link: {'Set in future with the next version of subgraph'}
            </h6>
          </li>
        </ul>
      </Box>
      {grantedAccessList?.length ? (
        <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
          <h2>1 to 1 messaging</h2>
          <ToggleList authorizedUser={grantedAccessList} />
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
      ) : (
        <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
          <h4>No authorized user for web3Mail DAPP</h4>
        </Box>
      )}
    </Box>
  );
}
