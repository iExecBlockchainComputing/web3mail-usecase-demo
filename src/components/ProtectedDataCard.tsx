import { DataSchema } from '@iexec/dataprotector';
import Chip from '@iexec/react-ui-kit/components/Chip';
import { Box, Card, CardContent, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CONSENT, PROTECTED_DATA } from '../config/path';
import { isKeyInDataSchema } from '../utils/utils';
import './ProtectedDataCard.css';

export interface ProtectedDataProps {
  id: string;
  title: string;
  schema: DataSchema;
  date: string;
}

export default function ProtectedDataCard(props: ProtectedDataProps) {
  const navigate = useNavigate();
  return (
    <Card
      sx={{ minWidth: 260, cursor: 'pointer' }}
      onClick={() => navigate(`/${PROTECTED_DATA}/${CONSENT}/${props.id}`)}
    >
      <CardContent className="cardContent">
        <Box
          sx={{ height: '60px', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Chip
            className="chipLabel"
            label={
              (isKeyInDataSchema(props.schema, 'email') && 'Email') ||
              (isKeyInDataSchema(props.schema, 'file') && 'File') ||
              'Unknown'
            }
            size="small"
            children={''}
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
          data-cy={`protectedDataCard`}
        >
          <h5>{props.title}</h5>
          <Chip
            className="chipDate"
            label={props.date}
            size="small"
            children={''}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
