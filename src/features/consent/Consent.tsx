import { useParams } from 'react-router-dom'
import './Consent.css'
import { Box, Chip } from '@mui/material'
import ToggleList from '../../components/ToggleList'

export default function Consent() {
  const { ProtectedDataId } = useParams()
  console.log(ProtectedDataId)
  const data = {
    title: 'Professional Email',
    date: '28/06/2022',
    dataType: 'email',
    id: '0x0d76535ac299360a1e14c6cd21662440945ed717',
  }
  return (
    <Box id="consent">
      <Box sx={{ textAlign: 'left' }}>
        <h2>{data.title}</h2>
        <Chip id="chipType" label={data.dataType} size="small" />
      </Box>
      <Box id="summary">
        <ul>
          <li>
            <h6>Created on {data.date}</h6>
          </li>
          <li>
            <h6>Data Protected Address: {data.id}</h6>
          </li>
          <li>
            <h6>
              IPFS link: /p2p/QmRCfnJVsxyNcCLMLNkBKLat8StxQUgKiQzpRz1MN7MDo3
            </h6>
          </li>
        </ul>
      </Box>
      {
        <Box sx={{ textAlign: 'left', my: 5, mb: 20 }}>
          <h2>{data.title}</h2>
          <ToggleList />
        </Box>
      }
    </Box>
  )
}
