import { redisClient } from '../../helpers/logout/redisClient';

const checkToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  const invalid = callback => {
    redisClient.lrange('token', 0, 999999999, (err, result) =>
      callback(result)
    );
  };
  invalid(result => {
    if (result.indexOf(token) > -1) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid token'
      });
    }
    next();
  });
};

export default checkToken;
