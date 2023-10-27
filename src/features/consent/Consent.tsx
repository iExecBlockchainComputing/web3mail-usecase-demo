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
import GrantAccessModal from './GrantAccessModal';
import AuthorizedUsersList from './AuthorizedUsersList';

// The list of users authorized to access the protected data is paginated
// Must be greater than or equal to 10
const AUTHORIZED_ADDRESSES_PER_PAGE = 10;

export default function Consent() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();

  const [page, setPage] = useState(0);

  //query RTK API as query hook
  const { data: { grantedAccessList = [], count } = {} } =
    useFetchGrantedAccessQuery(
      {
        protectedData: ProtectedDataId!,
        page,
        pageSize: AUTHORIZED_ADDRESSES_PER_PAGE,
      },
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
        <ul
          style={{ display: 'flex', flexDirection: 'column', rowGap: '24px' }}
        >
          <li>Owned by {protectedDataSelected?.owner}</li>
          <li>Data Protected Address: {protectedDataSelected?.address}</li>
          <li>
            IPFS link: {'Set in future with the next version of subgraph'}
          </li>
        </ul>
      </Box>

      <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
        {grantedAccessList?.length ? (
          <Box>
            <h2>1 to 1 messaging</h2>
            <AuthorizedUsersList
              authorizedUsers={grantedAccessList}
              count={count}
              pageSize={AUTHORIZED_ADDRESSES_PER_PAGE}
              page={page}
              onPageChanged={(newPage: number) => setPage(newPage)}
            />
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

        <GrantAccessModal
          protectedData={ProtectedDataId as string}
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      </Box>
    </Box>
  );
}
