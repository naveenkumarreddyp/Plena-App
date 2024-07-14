export const parseStringToDate = (dateString: string) => {
  const [day, month, year] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date;
};

export const sanitizeResponse = (info) => {
  const { _id, __v, ...sanitizedResponse } = info;
  return sanitizedResponse;
};
