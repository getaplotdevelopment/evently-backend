/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import mockery from 'mockery';
import nodemailerMock from 'nodemailer-mock';
import generateToken from '../../helpers/generateToken/generateToken';
import app from '../../index';
import {
  signupUser,
  invalidUser,
  existingUser,
  loginUser,
  invalidLoginUser,
  invalidLoginUserPassword,
  socialMediaUser,
  emailToCheck,
  wrongEmailToCheck
} from '../testingData/files.json';
import models from '../../models/index';
import userController from '../../controllers/users';

const { User } = models;
const user = new userController();

let currentUserToken;

chai.use(chaiHttp);
chai.should();

before(async () => {
  await User.destroy({ where: {}, truncate: true });
  mockery.enable({
    warnOnUnregistered: false
  });
});

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
    res.body.errors.body.should.be.a('array');
    res.body.errors.should.be.a('object');
  });
  it('Should login a user and return the status 200', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
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
    res.body.errors.body.should.be.a('array');
    res.body.errors.should.be.a('object');
  });
  it('Should not login with wrong password', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(invalidLoginUserPassword);
    res.should.have.status(401);
    res.body.errors.body.should.be.a('array');
    res.body.errors.should.be.a('object');
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
    res.body.errors.body.should.be.a('array');
    res.body.errors.should.be.a('object');
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
    res.should.have.status(401);
    res.body.errors.body.should.be.a('array');
    res.body.errors.should.be.a('object');
  });
});
describe('Activate user account', () => {
  it('should activate user account', async () => {
    const payload = {
      user: {
        email: 'getaplotdev@gmail.com',
        userName: 'user'
      }
    };
    const tokenGenerate = generateToken(payload);
    const token = tokenGenerate.generate;
    const res = await chai
      .request(app)
      .get(`/api/users/verify/${token}`)
      .set('Content-Type', 'application/json');
    // res.should.have.status(200);
    // res.body.message.should.be.a('string');
  });
  it('should not activate user account with a wrong token', async () => {
    const token = 'wrongTokenString';
    const res = await chai
      .request(app)
      .get(`/api/users/verify/${token}`)
      .set('Content-Type', 'application/json');
    res.should.have.status(500);
    res.body.errors.body.should.be.a('array');
  });
});
describe('Change current user passowrd', () => {
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
});
