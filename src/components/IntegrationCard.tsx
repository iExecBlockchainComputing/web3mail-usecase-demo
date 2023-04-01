import { Box, Card, CardContent, Divider } from '@mui/material'
import './IntegrationCard.css'
import { useNavigate } from 'react-router-dom'

export default function IntegrationCard({ id }: { id: string }) {
  const naviguate = useNavigate()

  return (
    <Card
      sx={{ width: 300, cursor: 'pointer' }}
      onClick={() => naviguate(`/integration/app/${id}`)}
    >
      <CardContent id="cardContent">
        <Box id="cardTop">
          <h3>Communication</h3>
        </Box>
        <Divider />
        <Box
          sx={{
            mx: 2,
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
          }}
        >
          <p>
            As a user, you can communicate with other users by sending them an
            email without knowing their email address.
          </p>
        </Box>
      </CardContent>
    </Card>
  )
}
