export const formatDate = (dateString, showTime = false) => {
  if (!dateString) return 'N/A';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (showTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};
