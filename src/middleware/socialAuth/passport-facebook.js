import FacebookTokenStrategy from 'passport-facebook';
import 'dotenv/config';

const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  APP_URL,
  PRODUCTION_URL
} = process.env;
const url = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : APP_URL;

const fbStrategy = new FacebookTokenStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${url}/api/users/login/facebook/redirect`,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    const userFacebook = {
      email: profile._json.email,
      username: profile._json.name,
      isActivated: true
    };
    done(null, userFacebook);
  }
);

export default fbStrategy;
