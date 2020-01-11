import passport from 'passport';
import facebookStrategy from './passport-facebook';
import googleStrategy from './passport-google';
import socialMediaSerialize from './serialize';
/**
 * Get user information from the strategy and then pass it to serialize class
 */
class Authentication {
  /**
   * Authentication constructor
   */
  constructor() {
    this.facebook = passport.use(facebookStrategy);
    this.google = passport.use(googleStrategy);
    this.serializeTwitteruser = socialMediaSerialize(passport, this.user);
  }
}
export default Authentication;
