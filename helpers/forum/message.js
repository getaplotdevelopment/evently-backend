import moment from 'moment';

const formatMessage = (username, message) => {
  return {
    username,
    message,
    time: moment().format('h:m:a')
  };
};

export { formatMessage };
