import moment from 'moment';

const formatMessage = (username, text) => {
  return {
    username,
    text,
    time: moment().format('h:m:a')
  };
};

export { formatMessage };
