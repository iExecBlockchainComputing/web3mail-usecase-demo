import { Box, Grid } from '@mui/material'
import './Integration.css'
import IntegrationCard from '../../components/IntegrationCard'

export default function Integration() {
  return (
    <Box sx={{ m: 10, mx: 20 }}>
      <h2>List of integrations to interact with your subscribers</h2>
      <Box sx={{ my: 10 }}>
        <Grid container spacing={8}>
          <Grid item>
            <IntegrationCard id={'0x168T27T1TZV7267G2V'} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
