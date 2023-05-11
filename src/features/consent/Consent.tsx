import { useParams } from 'react-router-dom';
import './Consent.css';
import { Box, Chip } from '@mui/material';
import ToggleList from '../../components/ToggleList';
import { useAppSelector } from '../../app/hooks';
import { selectProtectedDataArray } from '../../app/appSlice';

export default function Consent() {
  const { ProtectedDataId } = useParams();
  const protectedDataSelected = useAppSelector(selectProtectedDataArray).find(
    (item) => item.address === ProtectedDataId
  );

  return (
    <Box id="consent">
      <Box sx={{ textAlign: 'left' }}>
        <h2>{protectedDataSelected.name}</h2>
        <Chip id="chipType" label="I don't know" size="small" />
      </Box>
      <Box id="summary">
        <ul>
          <li>
            <h6>Owned by {protectedDataSelected.owner}</h6>
          </li>
          <li>
            <h6>Data Protected Address: {protectedDataSelected.address}</h6>
          </li>
          <li>
            <h6>IPFS link: {'No IPFS link'}</h6>
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
