import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'SUBMITTED' | 'CONTACTED' | 'CLOSED';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colorClasses =
    status === 'SUBMITTED'
      ? 'bg-blue-100 text-blue-800 hover:bg-blue-100/80'
      : status === 'CONTACTED'
      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      : status === 'CLOSED'
      ? 'bg-green-100 text-green-800 hover:bg-green-100/80'
      : 'bg-gray-100 text-gray-800';

  return <Badge className={colorClasses}>{formatStatus(status)}</Badge>;
};
