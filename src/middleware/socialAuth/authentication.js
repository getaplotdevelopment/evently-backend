import passport from 'passport';
import facebookStrategy from './passport-facebook';
import googleStrategy from './passport-google';
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
  }
}
export default Authentication;
