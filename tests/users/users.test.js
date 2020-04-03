/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import mockery from 'mockery';
import nodemailerMock from 'nodemailer-mock';
import generateToken from '../../helpers/generateToken/generateToken';
import app from '../../index';
import {
  signupUser,
  signupUser2,
  invalidUser,
  existingUser,
  loginUser,
  invalidLoginUser,
  invalidLoginUserPassword,
  activatedUser,
  socialMediaUser,
  emailToCheck,
  wrongEmailToCheck,
  toBeDeactivated,
  superUser,
  feedbackUser
} from '../testingData/files.json';

import userController from '../../controllers/users';

const user = new userController();

let currentUserToken;

chai.use(chaiHttp);
chai.should();

before(async () => {
  mockery.enable({
    warnOnUnregistered: false
  });
});

const newUser = async user => {
  return await chai
    .request(app)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .send(user);
};

const loginAUser = async user => {
  return await chai
    .request(app)
    .post('/api/users/login')
    .set('Content-Type', 'application/json')
    .send(user);
};

mockery.registerMock('nodemailer', nodemailerMock);

afterEach(async () => {
  // Reset the mock back to the defaults after each test
  nodemailerMock.mock.reset();
});
after(async () => {
  // Remove our mocked nodemailer and disable mockery
  mockery.deregisterAll();
  mockery.disable();
});
describe('User', () => {
  it('Should create a user and return the status 201', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser);
    res.should.have.status(201);
    res.body.user.should.be.a('object');
    res.body.token.should.be.a('string');
    currentUserToken = res.body.token;
  }).timeout(10000);
  it("Should throw 400 request when all users's credentials are not provided ", async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(invalidUser);
    res.should.have.status(400);
    res.body.errors.should.be.a('array');
  });
  it('Should throw 409 request when the email address is already taken ', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(existingUser);
    res.should.have.status(409);
    res.body.error.should.be.a('string');
  });
  it('Should not login with an unverified account', async () => {
    const response = await newUser(signupUser2);
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    res.should.have.status(401);
  });
  it('Should login a user and return the status 200', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(activatedUser);
    res.should.have.status(200);
    res.body.user.should.be.a('object');
    res.body.token.should.be.a('string');
  });
  it('Should not login with wrong email address', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(invalidLoginUser);
    res.should.have.status(401);
    res.body.error.should.be.a('string');
  });
  it('Should not login with wrong password', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(invalidLoginUserPassword);
    res.should.have.status(401);
    res.body.error.should.be.a('string');
  });
  it('Should let the user signup via Social media platforms', async () => {
    const result = await user.loginViaSocialMedia(socialMediaUser);
    result[0].dataValues.should.be.a('object');
  });
});
describe('Check email', () => {
  it('Should not send an email to a user with a wrong email', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/send-email')
      .set('Content-Type', 'application/json')
      .send(wrongEmailToCheck);
    res.should.have.status(404);
    res.body.error.should.be.a('string');
  });
  it('should send an email using nodemailer-mock', async () => {
    // call a service that uses nodemailer
    const response = await chai
      .request(app)
      .post('/api/users/send-email')
      .set('Content-Type', 'application/json')
      .send(emailToCheck);
    const sentMail = nodemailerMock.mock.getSentMail();
  }).timeout(10000);
  it('Should not resend an email to a user with a wrong email', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/resend-email')
      .set('Content-Type', 'application/json')
      .send(wrongEmailToCheck);
    res.should.have.status(404);
    res.body.error.should.be.a('string');
  });
  it('should resend an email using nodemailer-mock', async () => {
    // call a service that uses nodemailer
    const response = await chai
      .request(app)
      .post('/api/users/resend-email')
      .set('Content-Type', 'application/json')
      .send(emailToCheck);
    const sentMail = nodemailerMock.mock.getSentMail();
  }).timeout(10000);
});
describe('Reset Password', () => {
  it('Should reset the password', async () => {
    const payload = {
      email: 'getaplotdev@gmail.com'
    };
    const tokenGenerate = generateToken(payload);
    const token = tokenGenerate.generate;
    const res = await chai
      .request(app)
      .put('/api/users/reset-password')
      .set('Content-Type', 'application/json')
      .send({ token, password: 'newPassword2020' });
    res.should.have.status(200);
    res.body.message.should.be.a('string');
  });
  it('Should not reset the password with an invalid token', async () => {
    const token = 'dkdkbkslskd';
    const res = await chai
      .request(app)
      .put('/api/users/reset-password')
      .set('Content-Type', 'application/json')
      .send({ token, password: 'newPassword2020' });
    res.should.have.status(403);
    res.body.error.should.be.a('string');
  });
});
describe('Activate user account', () => {
  it('should not activate user account with a wrong token', async () => {
    const token = 'wrongTokenString';
    const res = await chai
      .request(app)
      .put(`/api/users/verify?token=${token}`)
      .set('Content-Type', 'application/json');
    res.should.have.status(403);
  });
  it('should deactivate user account', async () => {
    const response = await newUser(toBeDeactivated);

    const {
      token,
      user: { id }
    } = response.body;

    const res = await chai
      .request(app)
      .put('/api/users/deactivate-user')
      .send({ id })
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
  });
  it('should not deactivate user account with a wrong ID', async () => {
    const response = await loginAUser(superUser);
    const wrongId = 800398500293802;

    const { token } = response.body;
    const res = await chai
      .request(app)
      .put('/api/users/deactivate-user')
      .send({ id: wrongId })
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(404);
  });
  it('should not allow user to login after being deactivated', async () => {
    const response = await loginAUser(toBeDeactivated);
    response.should.have.status(401);
    response.body.should.be.a('object');
    response.body.error.should.be.a('string');
    response.body.error.should.include(
      'Account deactivated, kindly contact the help center service via evently@gmail.com'
    );
  });
});
describe('Change current user password', () => {
  it('Should change the current user password', async () => {
    const changePwd = {
      oldPassword: 'newPassword2020',
      newPassword: 'jamanBoss2020'
    };

    const res = await chai
      .request(app)
      .put('/api/users/change-password')
      .set('Authorization', `Bearer ${currentUserToken}`)
      .send(changePwd);
    res.should.have.status(200);
  });
  it('Should not change the current user password with a wrong old password', async () => {
    const changePwd = {
      oldPassword: 'jaman2020',
      newPassword: 'jamanBoss2020'
    };

    const res = await chai
      .request(app)
      .put('/api/users/change-password')
      .set('Authorization', `Bearer ${currentUserToken}`)
      .send(changePwd);
    res.should.have.status(401);
  });
  it('Should update user location', async () => {
    const newLocation = { location: 'mbarara' };
    const loginUser = {
      password: 'emabush2015',
      email: 'geta@gmail.com'
    };
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    currentUserToken = res.body.token;

    const result = await chai
      .request(app)
      .patch('/api/users/location')
      .set({ Authorization: `Bearer ${currentUserToken}` })
      .send(newLocation);
    result.should.have.status(200);
    result.body.should.have.property('message').eql('Successfully updated');
  }).timeout(10000);
  it('Should user follow another user', async () => {
    const loginUser = {
      password: 'emabush2015',
      email: 'geta@gmail.com'
    };
    const userToFollow = 1;
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    currentUserToken = res.body.token;

    const result = await chai
      .request(app)
      .post(`/api/users/${userToFollow}/follow`)
      .set({ Authorization: 'Bearer ' + currentUserToken });
    result.should.have.status(200);
    result.body.should.have.property('follow').eql(true);
  });
  it('Should user only follow existing users', async () => {
    const loginUser = {
      password: 'emabush2015',
      email: 'geta@gmail.com'
    };
    const userToFollow = 10007;
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    currentUserToken = res.body.token;

    const result = await chai
      .request(app)
      .post(`/api/users/${userToFollow}/follow`)
      .set({ Authorization: 'Bearer ' + currentUserToken });
    result.should.have.status(404);
    result.body.should.have.property('error').eql('User does not exist');
  });
  it('Should user only follow a user once', async () => {
    const loginUser = {
      password: 'emabush2015',
      email: 'geta@gmail.com'
    };
    const userToFollow = 1;
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    currentUserToken = res.body.token;
    const result = await chai
      .request(app)
      .post(`/api/users/${userToFollow}/follow`)
      .set({ Authorization: 'Bearer ' + currentUserToken });
    result.should.have.status(409);
    result.body.should.have.property('error').eql('User already followed');
  });
  it('Should user unfollow a followed user.', async () => {
    const loginUser = {
      password: 'emabush2015',
      email: 'geta@gmail.com'
    };
    const userToFollow = 1;
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    currentUserToken = res.body.token;
    const result = await chai
      .request(app)
      .delete(`/api/users/${userToFollow}/unfollow`)
      .set({ Authorization: 'Bearer ' + currentUserToken });
    result.should.have.status(200);
    result.body.should.have.property('message').eql('User unfollowed');
  });
  it('Should user unfollow existing users.', async () => {
    const loginUser = {
      password: 'emabush2015',
      email: 'geta@gmail.com'
    };
    const userToFollow = 10002;
    const userToFollow2 = 1;
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    currentUserToken = res.body.token;
    await chai
      .request(app)
      .delete(`/api/users/${userToFollow2}/unfollow`)
      .set({ Authorization: 'Bearer ' + currentUserToken });
    const result = await chai
      .request(app)
      .delete(`/api/users/${userToFollow}/unfollow`)
      .set({ Authorization: 'Bearer ' + currentUserToken });
    result.should.have.status(404);
    result.body.should.have.property('error').eql('User does not exist');
  });
});
describe('Feedback', () => {
  let ownerToken;
  let token;
  let feedbackId;
  let id;
  it('Should allow user to create feedback', async () => {
    const response = await newUser(feedbackUser);

    id = response.body.user.id;
    ownerToken = response.body.token;
    const feedback = {
      subject: 'Awesome app',
      content: 'This is really freakin good',
      user: id
    };

    const res = await chai
      .request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(feedback);
    res.should.have.status(201);
    feedbackId = res.body.feedback.id;
  });
  it('Only Super user should view feedback', async () => {
    const res = await chai
      .request(app)
      .get('/api/feedback')
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(403);
  });
  it('Should allow user to view feedback', async () => {
    const response = await loginAUser(superUser);
    token = response.body.token;
    const res = await chai
      .request(app)
      .get('/api/feedback')
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
  });
  it('should get one feedback', async () => {
    const res = await chai
      .request(app)
      .get(`/api/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
  });
  it('Only feedback owners should update them ', async () => {
    const feedback = {
      subject: 'Awesome app',
      content: 'This is really freakin good'
    };
    const res = await chai
      .request(app)
      .put(`/api/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(feedback);
    res.should.have.status(403);
  });
  it('Should allow user to update their feedback ', async () => {
    const feedback = {
      subject: 'Awesome app',
      content: 'This is really freakin good'
    };
    const res = await chai
      .request(app)
      .put(`/api/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(feedback);
    res.should.have.status(200);
  });
});
