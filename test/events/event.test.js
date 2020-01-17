/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import {
  createEvent,
  signupUser2,
  signupUser3
} from '../testingData/files.json';

chai.use(chaiHttp);
chai.should();

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
  });

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
  });

  it('token is required', async () => {
    const res = await chai
      .request(app)
      .post('/api/event')
      .send(createEvent);
    res.should.have.status(401);
    res.text.should.include('Token is required');
  });
});
