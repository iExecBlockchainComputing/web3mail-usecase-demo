import './Consent.css';
import ToggleList from '../../components/ToggleList';
import { useParams } from 'react-router-dom';
import { Box, Chip } from '@mui/material';
import {
  useFetchGrantedAccessQuery,
  useFetchProtectedDataQuery,
} from '../../app/appSlice';
import { useAccount } from 'wagmi';
import { hasKey } from '../../utils/utils';
import { DAPP_WEB3_MAIL_ADDRESS } from '../../config/config';
import { GrantedAccess } from '@iexec/dataprotector';

export default function Consent() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();
  //query RTK API as query hook
  const { data: grantedAccess } = useFetchGrantedAccessQuery(ProtectedDataId!);
  const { data: protectedData = [] } = useFetchProtectedDataQuery(
    address as string
  );

  //process queries to get the data we need
  const autorizedUser = grantedAccess
    ?.find((item) => item.apprestrict === DAPP_WEB3_MAIL_ADDRESS)
    .map((item: GrantedAccess) => item.requesterrestrict);

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
      {autorizedUser.length && (
        <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
          <h2>1 to 1 messaging</h2>
          <ToggleList authorizedUser={authorizedUser} />
        </Box>
      )}
    </Box>
  );
}
