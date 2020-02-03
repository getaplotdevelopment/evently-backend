/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import models from '../../models/index';
import {
  createEvent,
  signupUser2,
  signupUser3
} from '../testingData/files.json';

chai.use(chaiHttp);
chai.should();
const { Event } = models;

before(async () => {
  await Event.destroy({ where: {}, truncate: true });
});

describe('Event', () => {
  it('should create and event', async () => {
    const rex = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + rex.body.token })
      .send(createEvent);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.data.organizer.should.be.a('object');
    res.body.data.favorited.should.be.false;
  }).timeout(10000);

  it('authorized only organizers to create event', async () => {
    const rex = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser3);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + rex.body.token })
      .send(createEvent);
    res.should.have.status(403);
    res.text.should.include(
      "Un-authorized, User role can't perform this action."
    );
  }).timeout(10000);

  it('token is required', async () => {
    const res = await chai
      .request(app)
      .post('/api/events')
      .send(createEvent);
    res.should.have.status(401);
    res.text.should.include('Token is required');
  });
  it("currentMode should only be among ['draft', 'published', 'cancelled', 'unpublished']", async () => {
    const rex = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + rex.body.token })
      .send({
        title: 'title1 is good',
        description: 'desc',
        body: 'big hahaha',
        currentMode: 'Bad status'
      });
    res.should.have.status(422);
    res.text.should.include('Invalid eventType, try any from this array');
  }).timeout(10000);

  it('Get organizer events', async () => {
    const rex = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .get('/api/events')
      .set({ Authorization: 'Bearer ' + rex.body.token });
    res.should.have.status(200);
    res.body.count.should.be.a('number');
  });

  it('Get all events', async () => {
    const res = await chai
      .request(app)
      .get('/api/events/all')
    res.should.have.status(200);
    res.body.count.should.be.a('number');
    res.body.pages.should.equal(1);
    res.body.data.should.be.a('array');
  });

  it('Get all events ascendingly by startDate', async () => {
    const res = await chai
      .request(app)
      .get('/api/events/all')
      .query({ sort: 'startDate:asc' })
    res.should.have.status(200);
    res.body.count.should.be.a('number');
    res.body.pages.should.equal(1);
    res.body.data.should.be.a('array');
  });
});
