import { Link } from 'react-router-dom';
import { DataSchema } from '@iexec/dataprotector';
import { Box, Card, Divider } from '@mui/material';
import { Badge } from '@/components/ui/badge.tsx';
import { CONSENT, PROTECTED_DATA } from '@/config/path.ts';
import { getTypeOfProtectedData } from '@/utils/utils.ts';

export interface ProtectedDataProps {
  id: string;
  title: string;
  schema: DataSchema;
  date: string;
}

export default function ProtectedDataCard(props: ProtectedDataProps) {
  return (
    <Link to={`/${PROTECTED_DATA}/${CONSENT}/${props.id}`}>
      <Card className="transition-colors hover:bg-gray-50">
        <div className="pb-6">
          <div className="p-3 text-right">
            <Badge
              variant={
                getTypeOfProtectedData(props.schema) === 'Unknown type'
                  ? 'secondary'
                  : 'default'
              }
            >
              {getTypeOfProtectedData(props.schema)}
            </Badge>
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
            <h5 className="my-6 text-[15px] font-semibold">{props.title}</h5>
            <div className="text-right">
              <Badge variant="outline">{props.date}</Badge>
            </div>
          </Box>
        </div>
      </Card>
    </Link>
  );
}
