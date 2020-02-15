/* eslint-disable no-shadow */
import chai from 'chai';
import chaitHttp from 'chai-http';
import mock from 'mock-fs';
import app from '../../index';
import models from '../../models/index';

import { signupUser4 } from '../testingData/files.json';

chai.use(chaitHttp);
chai.should();

let token;
const fakeToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlck5hbWUiOm51bGwsImF2YXRhciI6Ii8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvNjU0NWMwNzRhMGUzYjBmNjRmODMzOGJjMGZkMTcyNmU_cz0yMDAmcj1wZyZkPW1tIiwiZW1haWwiOiJwcm9tb3RlckBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJpc09yZ2FuaXplciI6dHJ1ZSwiaXNBY3RpdmF0ZWQiOnRydWUsImlhdCI6MTU4MDk5MTQ2NywiZXhwIjoxNTgxMDc3ODY3fQ.B175KtpGkVMundhPk4VKApmQwx3IAqo8WHZzzD2qS7k';
const organizerId = 6;
let userId;
const { OrganizerProfile } = models;
const profile = new OrganizerProfile();

before(async () => {
  await profile.destroy({ where: {}, truncate: true });
});

describe('Profile', () => {
  it('should create the profile', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser4);
    token = res.body.token;
    userId = res.body.user.id;

    const createProfile = {
      accountName: 'BomayE',
      description: 'Bomaye Music',
      domain: 'music',
      location: 'Paris',
      preferences: ['music', 'preferences', 'dance'],
      accountType: 'Brand',
      social: ['youtube', 'facebook', 'linkedin'],
      organizer: userId
    };
    const response = await chai
      .request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(createProfile);
    response.should.have.status(201);
    response.body.should.be.a('object');
  }).timeout(10000);
  it('should update a profile', async () => {
    const updatedProfile = {
      accountName: 'BomayE',
      description: 'Bomaye Music',
      domain: 'music',
      location: 'Paris',
      preferences: ['music', 'preferences', 'dance'],
      accountType: 'Brand',
      social: ['youtube', 'facebook', 'linkedin'],
      organizer: userId
    };
    const res = await chai
      .request(app)
      .put('/api/profile')
      .set({ Authorization: `Bearer ${token}` })
      .send(updatedProfile);
    res.should.have.status(200);
    res.body.should.be.a('object');
  }).timeout(10000);
  it('should get a profile', async () => {
    const res = await chai
      .request(app)
      .get(`/api/profile/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should throw a 404 if the user does not have any profile yet', async () => {
    const res = await chai
      .request(app)
      .get(`/api/profile/${organizerId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(404);
  });
  it('should get the authenticated user profile', async () => {
    const response = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser4);
    const tokent = response.body.token;
    const res = await chai
      .request(app)
      .get('/api/profile/me')
      .set('Authorization', ` Bearer ${tokent}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });

  // FIXME
  // Test not stable need to be fixed
  // it('should get the authenticated user profile', async () => {
  //   const res = await chai
  //     .request(app)
  //     .get('/api/profile/me')
  //     .set('Authorization', `Bearer ${fakeToken}`);
  //   res.should.have.status(404);
  //   res.body.should.be.a('object');
  // });
});
