import { Box, Button, Grid } from '@mui/material';
import './ProtectedData.css';
import ProtectedDataCard from '../../components/ProtectedDataCard';
import { useNavigate } from 'react-router-dom';
import { IExecDataProtector } from '@iexec/dataprotector';
import { useEffect, useState } from 'react';
import img from '../../assets/noData.png';

export default function ProtectedData() {
  const [protectedData, setProtectedData] = useState([]);
  const data = [
    {
      title: 'Professional Email',
      date: '28/06/2022',
      dataType: 'email',
      id: '0x0d76535ac299360a1e14c6cd21662440945ed717',
    },
  ];

  const fetchData = async () => {
    const dataProtector = new IExecDataProtector(window.ethereum);
    const protectedData = await dataProtector.fetchProtectedData();
    setProtectedData(protectedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ mx: 10 }}>
      {protectedData.length !== 0 ? (
        <Box>
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
          <Box sx={{ mx: 4 }}>
            <Grid container spacing={2}>
              {data.map((e) => (
                <Grid item key={e.id}>
                  <ProtectedDataCard
                    id={e.id}
                    title={e.title}
                    date={e.date}
                    dataType={e.dataType}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box>
          <img src={img} alt="The immage can't be loaded" id="logo" />
          <p>You have no protected data yet. Go create one!</p>
          <Box sx={{ mt: 7 }}>
            <NewProtectedDataButton />
          </Box>
        </Box>
      )}
    </Box>
  );
}

function NewProtectedDataButton() {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate('/NewProtectedData')}>
      Protect a new data
    </Button>
  );
}
