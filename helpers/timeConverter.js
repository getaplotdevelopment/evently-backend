import moment from 'moment';

export const timeConverter = UNIX_timestamp => {
  const newDate = new Date(UNIX_timestamp * 1000);

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const year = newDate.getFullYear();
  const date = newDate.getDate();
  const hour = newDate.getHours();
  const min = newDate.getMinutes();
  const sec = newDate.getSeconds();
  const milliseconds = newDate.getMilliseconds();
  let month;
  for (let i = 1; i <= 12; i++) {
    month = months[newDate.getMonth()];
  }
  const time =
    year +
    '-' +
    month +
    '-' +
    date +
    ' ' +
    hour +
    ':' +
    min +
    ':' +
    sec +
    '.' +
    milliseconds;
  return time;
};

export const dayTimeStampConverter = date => {
  return moment().unix() + date * 86400;
};

export const unixDateConverter = date => {
  return new Date(date).getTime() / 1000;
};

export const onlyDateHelper = date => {
  return date
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .toISOString();
};
