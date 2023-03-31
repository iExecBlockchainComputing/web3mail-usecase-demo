import { Box, Button, Grid } from '@mui/material'
import './ProtectedData.css'
import ProtectedDataCard from '../../components/ProtectedDataCard'
import { useNavigate } from 'react-router-dom'

export default function ProtectedData() {
  const data = [
    { title: 'Professional Email', date: '28/06/2022', dataType: 'email', id: '0x0d76535ac299360a1e14c6cd21662440945ed717' },
    { title: 'Professional Email', date: '28/06/2022', dataType: 'email', id: '0x5ab61938db5c96b6fbc8c2fc666c42a6c93569fa' },
    { title: 'Age', date: '17/04/2022', dataType: 'Profile', id: '0x126561e41f561c872f033a80d6eaecd964b6f0d6' },
    { title: 'ID Card', date: '18/01/2022', dataType: 'Document', id: '0x8ece0c27c52237329aa61f521f77632454754e3c' },
  ]

  return (
    <Box sx={{ mx: 10 }}>
      {data.length !== 0 ? (
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
                <Grid item>
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
          <img
            src={require('../../assets/noData.png')}
            alt="The immage can't be loaded"
            id="logo"
          />
          <p>You have no protected data yet. Go create one!</p>
          <Box sx={{ mt: 7 }}>
            <NewProtectedDataButton />
          </Box>
        </Box>
      )}
    </Box>
  )
}

function NewProtectedDataButton() {
  const navigate = useNavigate()
  return (
    <Button variant="contained" onClick={() => navigate('/NewProtectedData')}>
      Protect a new data
    </Button>
  )
}
