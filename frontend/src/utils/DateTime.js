const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const stringToDate = (dateString) => {
  return new Date(dateString);
};

export { formatDate, stringToDate };
