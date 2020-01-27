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
      .post('/api/event')
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
      .post('/api/event')
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
      .post('/api/event')
      .send(createEvent);
    res.should.have.status(401);
    res.text.should.include('Token is required');
  });
  it("eventStatus should only be among ['draft', 'published', 'cancelled', 'unpublished']", async () => {
    const rex = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/event')
      .set({ Authorization: 'Bearer ' + rex.body.token })
      .send({
        title: 'title1 is good',
        description: 'desc',
        body: 'big booty',
        eventStatus: 'Bad status'
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
      .get('/api/event')
      .set({ Authorization: 'Bearer ' + rex.body.token });
    res.should.have.status(200);
    res.body.count.should.be.a('number');
  });
});
