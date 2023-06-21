import { useNavigate } from 'react-router-dom';
import './ProtectedDataCard.css';
import { Box, Card, CardContent, Chip, Divider } from '@mui/material';
import { DataSchema } from '@iexec/dataprotector';
import { isKeyInDataSchema } from '../utils/utils';
import { CONSENT, PROTECTED_DATA } from '../config/path';

export interface ProtectedDataProps {
  id: string;
  title: string;
  schema: DataSchema;
}

export default function ProtectedDataCard(props: ProtectedDataProps) {
  const navigate = useNavigate();
  return (
    <Card
      sx={{ minWidth: 260, cursor: 'pointer' }}
      onClick={() => navigate(`/${PROTECTED_DATA}/${CONSENT}/${props.id}`)}
    >
      <CardContent id="cardContent">
        <Box
          sx={{ height: '60px', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Chip
            id="chipLabel"
            label={
              (isKeyInDataSchema(props.schema, 'email') && 'Email') ||
              (isKeyInDataSchema(props.schema, 'file') && 'File') ||
              'Unknown'
            }
            size="small"
          />
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
          <Chip id="chipDate" label={'Date'} size="small" />
        </Box>
      </CardContent>
    </Card>
  );
}
