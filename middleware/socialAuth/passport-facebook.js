import FacebookTokenStrategy from 'passport-facebook';
import 'dotenv/config';

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, APP_URL } = process.env;

const fbStrategy = new FacebookTokenStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${APP_URL}/api/users/login/facebook/redirect`,
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
