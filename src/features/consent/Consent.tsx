import './Consent.css';
import ToggleList from '../../components/ToggleList';
import { useParams } from 'react-router-dom';
import { Box, Chip } from '@mui/material';
import { useFetchProtectedDataQuery } from '../../app/appSlice';
import { useAccount } from 'wagmi';
import { hasKey } from '../../utils/utils';

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

  return (
    <Box id="consent">
      <Box sx={{ textAlign: 'left' }}>
        <h2>{protectedDataSelected?.name}</h2>
        <Chip
          id="chipType"
          label={
            (hasKey(protectedDataSelected?.schema, 'email') && 'Email') ||
            (hasKey(protectedDataSelected?.schema, 'file') && 'File') ||
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
        </Box>
      }
    </Box>
  );
}
