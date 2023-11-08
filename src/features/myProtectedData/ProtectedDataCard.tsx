import { DataSchema } from '@iexec/dataprotector';
import Chip from '@iexec/react-ui-kit/components/Chip';
import { Box, Card, CardContent, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CONSENT, PROTECTED_DATA } from '@/config/path.ts';
import { isKeyInDataSchema } from '@/utils/utils.ts';
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
        <div className="p-3 text-right">
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
        </div>
        <Divider />
        <Box
          sx={{
            mx: 2,
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
          }}
          data-cy="protected-data-card"
        >
          <h5 className="my-6 font-bold">{props.title}</h5>
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
