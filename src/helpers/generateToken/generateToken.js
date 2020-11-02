import jwt from 'jsonwebtoken';
import 'dotenv/config';

const token = payload => {
  const generate = jwt.sign(payload, process.env.jwtSecret, {
    expiresIn: '7d'
  });
  return {
    generate
  };
};

export default token;
