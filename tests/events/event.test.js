/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import models from '../../models/index';
import {
  createEvent,
  signupUser2,
  signupUser3,
  signupUser5
} from '../testingData/files.json';

chai.use(chaiHttp);
chai.should();
const { Event } = models;

// before(async () => {
//   await Event.destroy({ where: {}, truncate: true });
// });

describe('Event', () => {
  it('should create an event', async () => {
    const response = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + response.body.token })
      .send(createEvent);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.data.organizer.should.be.a('string');
    res.body.data.favorited.should.be.false;
  }).timeout(10000);

  it('authorized only organizers to create event', async () => {
    const response = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser3);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + response.body.token })
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
    const response = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + response.body.token })
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
    const response = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .get('/api/events')
      .set({ Authorization: 'Bearer ' + response.body.token });
    res.should.have.status(200);
    res.body.count.should.be.a('number');
  });

  it('Get all events', async () => {
    const res = await chai.request(app).get('/api/events/all');
    res.should.have.status(200);
    res.body.count.should.be.a('number');
    res.body.pages.should.equal(1);
    res.body.data.should.be.a('array');
  });

  it('Get all events ascendingly by startDate', async () => {
    const res = await chai
      .request(app)
      .get('/api/events/all')
      .query({ sort: 'startDate:asc' });
    res.should.have.status(200);
    res.body.count.should.be.a('number');
    res.body.pages.should.equal(1);
    res.body.data.should.be.a('array');
  });

  it('should allow organizers to update their events', async () => {
    const response = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + response.body.token })
      .send(createEvent);

    const slug = res.body.data.slug;

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}`)
      .set({ Authorization: 'Bearer ' + response.body.token })
      .send({ description: 'description is changed' });
    result.should.have.status(200);
    result.body.message.should.equal('Successfully Updated');
    res.body.data.should.be.a('object');
    result.text.should.include('description is changed');
  }).timeout(10000);

  it('should allow organizers to update events with validate currentMode', async () => {
    const response = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + response.body.token })
      .send(createEvent);

    const slug = res.body.data.slug
    
    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}`)
      .set({ Authorization: 'Bearer ' + response.body.token })
      .send({currentMode: "invalid"});    
    result.should.have.status(422);
    result.text.should.include("Invalid eventType, try any from this array ['draft','published','cancelled','unpublished']");
  }).timeout(10000);

  it('should allow Organizers to update only their events', async () => {
    const user2 = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser5);

    const user1 = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + user1.body.token })
      .send(createEvent);

    const slug = res.body.data.slug;

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}`)
      .set({ Authorization: 'Bearer ' + user2.body.token })
      .send({ description: 'description is changed' });
    result.should.have.status(403);
    result.text.should.include('Unauthorized to perform this action');
  }).timeout(10000);

  it('should allow users to like an event for the first time', async () => {
    const user2 = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser3);

    const user1 = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + user1.body.token })
      .send(createEvent);

    const slug = res.body.data.slug;

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user2.body.token });
    result.should.have.status(200);
    result.body.isLiked.should.be.a('boolean');
    result.body.likedBy.should.be.a('array');
  });

  it('should allow users to update the event like', async () => {
    const user2 = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser3);

    const user1 = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + user1.body.token })
      .send(createEvent);

    const slug = res.body.data.slug;

    await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user2.body.token });

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user2.body.token });
    result.should.have.status(200);
    result.body.isLiked.should.be.a('boolean');
    result.body.likedBy.should.be.a('array');
  });

  it('should allow users retrieve their liked events', async () => {
    const user2 = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser3);

    const user1 = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signupUser2);

    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + user1.body.token })
      .send(createEvent);

    const slug = res.body.data.slug;

    await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user2.body.token });

    const result = await chai
      .request(app)
      .get(`/api/events/liked`)
      .set({ Authorization: 'Bearer ' + user2.body.token });
    result.should.have.status(200);
    result.body.count.should.equal(1);
    result.body.data.should.be.a('array');
  });
});
