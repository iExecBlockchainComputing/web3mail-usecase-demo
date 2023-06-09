import Chip from '@iexec/react-ui-kit/components/Chip';
import AddIcon from '@mui/icons-material/Add';
import { Box, Fab } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  useFetchGrantedAccessQuery,
  useFetchProtectedDataQuery,
} from '../../app/appSlice';
import { isKeyInDataSchema } from '../../utils/utils';
import './Consent.css';
import GrantAcessModal from './GrantAcessModal';
import ToggleList from './ToggleList';

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
          className="chipType"
          label={
            (isKeyInDataSchema(protectedDataSelected?.schema || {}, 'email') &&
              'Email') ||
            (isKeyInDataSchema(protectedDataSelected?.schema || {}, 'file') &&
              'File') ||
            'Unknown'
          }
          size="small"
          children={''}
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
      <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
        {grantedAccessList?.length ? (
          <Box>
            <h2>1 to 1 messaging</h2>
            <ToggleList authorizedUser={grantedAccessList} />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <h4>No authorized user for web3Mail dApp</h4>
          </Box>
        )}
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
    </Box>
  );
}
