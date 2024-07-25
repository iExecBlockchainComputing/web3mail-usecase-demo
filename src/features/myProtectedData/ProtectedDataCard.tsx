import { DataSchema } from '@iexec/dataprotector';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge.tsx';
import { getTypeOfProtectedData } from '@/utils/utils.ts';

export interface ProtectedDataProps {
  id: string;
  title: string;
  schema: DataSchema;
  date: string;
}

export default function ProtectedDataCard(props: ProtectedDataProps) {
  return (
    <Link to={`/protectedData/consent/${props.id}`}>
      <div className="min-h-[190px] rounded shadow-md transition-colors hover:bg-gray-50">
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

        <hr />

        <div className="px-4 pb-6" data-cy="protected-data-card">
          <h5 className="my-6 text-[15px] font-semibold">{props.title}</h5>
          <div className="text-right">
            <Badge variant="outline">{props.date}</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
