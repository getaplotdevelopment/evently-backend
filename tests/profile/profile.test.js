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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqZWFuZGVkaWV1YW1AZ21haWwuY29tIiwidXNlck5hbWUiOiJqYW1hbiIsImF2YXRhciI6Ii8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvMjAyYTY3NjQ1NGVhYzAyNTM2NzVlODgwMzQ1YjI0YmY_cz0yMDAmcj1wZyZkPW1tIiwiaXNBZG1pbiI6ZmFsc2UsImlzT3JnYW5pemVyIjpmYWxzZSwiaXNBY3RpdmF0ZWQiOmZhbHNlLCJpYXQiOjE1ODA2NDY2MjgsImV4cCI6MTU4MDczMzAyOH0.l6ZJFMy8s5DSiL69fZgcIAYz-yJeDtz0aL7lbNv6NVI';
const organizerId = 5;
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
    const res = await chai
      .request(app)
      .get('/api/profile/me')
      .set('Authorization', ` Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should get the authenticated user profile', async () => {
    const res = await chai
      .request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${fakeToken}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
  });
});
