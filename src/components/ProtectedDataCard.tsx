import { useNavigate } from 'react-router-dom';
import './ProtectedDataCard.css';
import { Box, Card, CardContent, Chip, Divider } from '@mui/material';
import { DataSchema } from '@iexec/dataprotector';

export interface ProtectedDataProps {
  id: string;
  title: string;
  schema: DataSchema;
}

function hasKey(dataSchema: DataSchema, key: string): boolean {
  if (!dataSchema) {
    return false;
  }

  if (key in dataSchema) {
    return true;
  }

  for (const value of Object.values(dataSchema)) {
    if (
      typeof value === 'object' &&
      value !== null &&
      hasKey(value as DataSchema, key)
    ) {
      return true;
    }
  }

  return false;
}

export default function ProtectedDataCard(props: ProtectedDataProps) {
  const naviguate = useNavigate();
  return (
    <Card
      sx={{ minWidth: 260, cursor: 'pointer' }}
      onClick={() => naviguate(`/protectedData/consent/${props.id}`)}
    >
      <CardContent id="cardContent">
        <Box
          sx={{ height: '60px', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Chip
            id="chipLabel"
            label={
              (hasKey(props.schame, 'email') && 'Email') ||
              (hasKey(props.schame, 'file') && 'File') ||
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
