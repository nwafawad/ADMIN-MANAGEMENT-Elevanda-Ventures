import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateValue, showTime = false) => {
  if (!dateValue) return 'N/A';

  const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
  if (!isValid(date)) return 'N/A';

  return format(date, showTime ? 'MMM d, yyyy, h:mm a' : 'MMM d, yyyy');
};

export const formatDateTime = (dateValue) => formatDate(dateValue, true);
