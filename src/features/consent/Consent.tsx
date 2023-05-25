import './Consent.css';
import ToggleList from '../../components/ToggleList';
import { useParams } from 'react-router-dom';
import { Box, Chip } from '@mui/material';
import {
  useFetchGrantedAccessMutation,
  useFetchProtectedDataMutation,
} from '../../app/appSlice';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { isDataSchemaHasKey } from '../../utils/utils';
import { ProtectedData } from '@iexec/dataprotector';

export default function Consent() {
  const { ProtectedDataId } = useParams();
  const { address } = useAccount();

  //RTK : Fetch granted data
  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>([]);
  const [fetchGrantedAccess, resultGrantedAccess] =
    useFetchGrantedAccessMutation();

  useEffect(() => {
    if (resultGrantedAccess.isSuccess) {
      setAuthorizedUsers(resultGrantedAccess.data);
    }
  }, [resultGrantedAccess.data, resultGrantedAccess.isSuccess]);

  useEffect(() => {
    if (ProtectedDataId) {
      refreshAuthorizedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProtectedDataId]);

  const refreshAuthorizedUsers = () => {
    if (ProtectedDataId) {
      fetchGrantedAccess(ProtectedDataId);
    }
  };

  //RTK : Fetch protected data
  const [fetchProtectedData, resultProtectedData] =
    useFetchProtectedDataMutation();
  const [protectedDataSelected, setProtectedDataSelected] =
    useState<ProtectedData>();

  useEffect(() => {
    fetchProtectedData(address as string);
  }, [address, fetchProtectedData]);

  useEffect(() => {
    if (resultProtectedData.isSuccess) {
      const _protectedDataSelected = resultProtectedData.data?.find(
        (item) => item.address === ProtectedDataId
      );
      setProtectedDataSelected(_protectedDataSelected);
    }
  }, [resultProtectedData, ProtectedDataId]);

  return (
    <Box id="consent">
      <Box sx={{ textAlign: 'left' }}>
        <h2>{protectedDataSelected?.name}</h2>
        <Chip
          id="chipType"
          label={
            (isDataSchemaHasKey(protectedDataSelected?.schema, 'email') &&
              'Email') ||
            (isDataSchemaHasKey(protectedDataSelected?.schema, 'file') &&
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
      {authorizedUsers?.length ? (
        <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
          <h2>1 to 1 messaging</h2>
          <ToggleList
            authorizedUser={authorizedUsers}
            refreshAuthorizedUsers={refreshAuthorizedUsers}
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
