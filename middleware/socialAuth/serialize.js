const socialMediaSerialize = (passport, user) => {
  passport.serializeUser((userSocialMedia, done) => {
    done(null, userSocialMedia.username);
  });
  passport.deserializeUser((username, done) => {
    user
      .findByPk(username)
      .then(userSocialMedia => {
        done(null, userSocialMedia);
      })
      .catch(err => done(err, false));
  });
};
export default socialMediaSerialize;
