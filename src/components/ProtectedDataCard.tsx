import { useNavigate } from 'react-router-dom'
import './ProtectedDataCard.css'
import { Box, Card, CardContent, Chip, Divider } from '@mui/material'

export interface ProtectedDataProps {
  title: string
  date: string
  dataType: string
  id: string
}

export default function ProtectedDataCard(props: ProtectedDataProps) {
  const naviguate = useNavigate()
  return (
    <Card
      sx={{ minWidth: 260 }}
      onClick={() => naviguate(`/consent/${props.id}`)}
    >
      <CardContent id="cardContent">
        <Box
          sx={{ height: '60px', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Chip id="chipLabel" label={props.dataType} size="small" />
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
          <h5>{props.title}</h5>
          <Chip id="chipDate" label={props.date} size="small" />
        </Box>
      </CardContent>
    </Card>
  )
}
