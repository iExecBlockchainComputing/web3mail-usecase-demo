import './Consent.css';
import ToggleList from '../../components/ToggleList';
import { useParams } from 'react-router-dom';
import { Box, Chip } from '@mui/material';
import { useFetchProtectedDataMutation } from '../../app/appSlice';
import { useAccount } from 'wagmi';
import { isDataschemaHasKey } from '../../utils/utils';
import { useEffect, useState } from 'react';
import { ProtectedData } from '@iexec/dataprotector';

export default function Consent() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();
  const [protectedDataSelected, setProtectedDataSelected] =
    useState<ProtectedData>();
  const [fetchProtectedData, result] = useFetchProtectedDataMutation();

  //query RTK API as mutation hook
  useEffect(() => {
    fetchProtectedData(address as string);
  }, [address, fetchProtectedData]);

  useEffect(() => {
    if (result.isSuccess) {
      const _protectedDataSelected = result.data?.find(
        (item) => item.address === ProtectedDataId
      );
      setProtectedDataSelected(_protectedDataSelected);
    }
  }, [result, ProtectedDataId]);

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
        </Box>
      }
    </Box>
  );
}
