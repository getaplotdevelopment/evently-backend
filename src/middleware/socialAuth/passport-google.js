import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APP_URL,
  PRODUCTION_URL
} = process.env;
const url = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : APP_URL;

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${url}/api/users/login/google/redirect`,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    const userGoogle = {
      username: profile.displayName,
      isActivated: true
    };

    done(null, userGoogle);
  }
);

export default googleStrategy;
