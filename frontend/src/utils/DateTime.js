const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


function getISOStringWithoutSecsAndMillisecs(date) {
  const dateAndTime = date.toISOString().split('T')
  const time = dateAndTime[1].split(':')
  
  return dateAndTime[0]+'T'+time[0]+':'+time[1]
}

const formatTDateTime = (dateString) => {
  return getISOStringWithoutSecsAndMillisecs(new Date(dateString));
};

const formatTime = (dateString) => {
  const options = { hour: "numeric", minute: "numeric" };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

const stringToDate = (dateString) => {
  return new Date(dateString);
};

export { formatTDateTime, formatTime, formatDate, stringToDate };
