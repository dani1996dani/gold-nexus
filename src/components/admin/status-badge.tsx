import { Badge } from '@/components/ui/badge';
import { formatStatus } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let colorClasses = 'bg-gray-100 text-gray-800'; // Default gray

  switch (status) {
    // Lead Statuses
    case 'SUBMITTED':
    case 'UNPAID': // For orders
      colorClasses = 'bg-slate-100 text-slate-800 hover:bg-slate-100/80';
      break;
    case 'PAID': // For orders
      colorClasses = 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
      break;
    case 'CONTACTED':
    case 'PROCESSING': // For orders
      colorClasses = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
      break;
    case 'CLOSED':
    case 'COMPLETED': // For orders
      colorClasses = 'bg-green-100 text-green-800 hover:bg-green-100/80';
      break;
    case 'SHIPPED': // For orders
      colorClasses = 'bg-purple-100 text-purple-800 hover:bg-purple-100/80';
      break;
    case 'FAILED': // For orders
      colorClasses = 'bg-red-100 text-red-800 hover:bg-red-100/80';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
      break;
  }

  return <Badge className={colorClasses}>{formatStatus(status)}</Badge>;
};
