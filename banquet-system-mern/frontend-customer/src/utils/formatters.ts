import { format } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date, formatStr = 'PPP'): string => {
  return format(new Date(date), formatStr);
};

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'p');
};

// Convert slot index (0-47) to human-readable time
export const slotIndexToTime = (index: number): string => {
  const hours = Math.floor(index / 2);
  const minutes = (index % 2) * 30;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Convert slot index to time range string
export const slotIndexToRange = (index: number): string => {
  const startTime = slotIndexToTime(index);
  const endTime = slotIndexToTime(index + 1);
  return `${startTime} - ${endTime}`;
};

// Get status badge color
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    PENDING_ADMIN1: 'bg-yellow-100 text-yellow-800',
    PENDING_ADMIN2: 'bg-blue-100 text-blue-800',
    PENDING_ADMIN3: 'bg-purple-100 text-purple-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Get status display text
export const getStatusText = (status: string): string => {
  const statusTexts: Record<string, string> = {
    PENDING_ADMIN1: 'Pending Document Review',
    PENDING_ADMIN2: 'Pending Payment Verification',
    PENDING_ADMIN3: 'Pending Final Approval',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  return statusTexts[status] || status;
};
