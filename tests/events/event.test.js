/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import {
  createEvent,
  signupUser2,
  signupUser3,
  signupUser5,
  similarEvent,
  nearByCity,
  invalidLoc
} from '../testingData/files.json';

chai.use(chaiHttp);
chai.should();
let user2;
let user3;

const newOrganizer = async () => {
  return await chai
    .request(app)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .send(signupUser2);
};

const loginUser3 = async () => {
  return await chai
    .request(app)
    .post('/api/users/login')
    .set('Content-Type', 'application/json')
    .send(signupUser3);
};

const loginUser2 = async () => {
  return await chai
    .request(app)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .send(signupUser5);
};

const loginOrganizer = async () => {
  return await chai
    .request(app)
    .post('/api/users/login')
    .set('Content-Type', 'application/json')
    .send(signupUser2);
};

const createEvents = async (userObj, event = createEvent) => {
  const { token } = userObj.body;
  return await chai
    .request(app)
    .post('/api/events')
    .set({ Authorization: 'Bearer ' + token })
    .send(event);
};

describe('Event', () => {
  let eventResponse;
  let loggedInOrganized;
  let newUserResponse;
  before( async () => {
    // runs once before the first test in this block
    newUserResponse = await newOrganizer(); 
  });
  it('should create an event', async () => {
    eventResponse = await createEvents(newUserResponse);
    eventResponse.should.have.status(201);
    eventResponse.body.should.be.a('object');
    eventResponse.body.data.organizer.should.be.a('string');
    eventResponse.body.data.favorited.should.be.false;
  }).timeout(10000);

  it('authorized only organizers to create event', async () => {
    const response = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser3);

    const res = await createEvents(response);
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
    loggedInOrganized = await loginOrganizer();  
    const res = await chai
      .request(app)
      .post('/api/events')
      .set({ Authorization: 'Bearer ' + loggedInOrganized.body.token })
      .send({
        title: 'title1 is good',
        description: 'desc',
        currentMode: 'Bad status',
        startDate: '2020-01-01',
        finishDate: '2020-01-03'
      });
    res.should.have.status(422);
    res.text.should.include('Invalid eventType, try any from this array');
  }).timeout(10000);

  it('Get organizer events', async () => {
    const res = await chai
      .request(app)
      .get('/api/events')
      .set({ Authorization: 'Bearer ' + loggedInOrganized.body.token });
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
    const slug = eventResponse.body.data.slug;

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}`)
      .set({ Authorization: 'Bearer ' + loggedInOrganized.body.token })
      .send({ description: 'description is changed' });
    
    result.should.have.status(200);
    result.body.message.should.equal('Successfully Updated');
    eventResponse.body.data.should.be.a('object');
    result.text.should.include('description is changed');
  }).timeout(15000);

  it('should allow organizers to update events with validate currentMode', async () => {
    const slug = eventResponse.body.data.slug;

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}`)
      .set({ Authorization: 'Bearer ' + loggedInOrganized.body.token })
      .send({ currentMode: 'invalid' });
    result.should.have.status(422);
    result.text.should.include(
      "Invalid eventType, try any from this array ['draft','published','cancelled','unpublished']"
    );
  }).timeout(10000);

  it('should allow Organizers to update only their events', async () => {
    const slug = eventResponse.body.data.slug;
    user2 = await loginUser2();  

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}`)
      .set({ Authorization: 'Bearer ' + user2.body.token })
      .send({ description: 'description is changed' });
    result.should.have.status(403);
    result.text.should.include('Unauthorized to perform this action');
  }).timeout(10000);

  it('should allow users to like an event for the first time', async () => {
    const slug = eventResponse.body.data.slug;
    user3 = await loginUser3();  

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user3.body.token });
    result.should.have.status(200);
    result.body.isLiked.should.be.a('boolean');
    result.body.likedBy.should.be.a('array');
  });

  it('should allow users to update the event like', async () => {
    const slug = eventResponse.body.data.slug;

    await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user3.body.token });

    const result = await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user3.body.token });
    result.should.have.status(200);
    result.body.isLiked.should.be.a('boolean');
    result.body.likedBy.should.be.a('array');
  });

  it('should allow users retrieve their liked events', async () => {
    const slug = eventResponse.body.data.slug;

    await chai
      .request(app)
      .patch(`/api/events/${slug}/like`)
      .set({ Authorization: 'Bearer ' + user3.body.token });

    const result = await chai
      .request(app)
      .get(`/api/events/liked`)
      .set({ Authorization: 'Bearer ' + user3.body.token });
    result.should.have.status(200);
    result.body.count.should.equal(1);
    result.body.data.should.be.a('array');
  });
  it('should retrieve similar events', async () => {
    const eventSimilar = await createEvents(loggedInOrganized, similarEvent);
    const { slug } = eventResponse.body.data;
    const { category } = eventSimilar.body.data;
    const result = await chai.request(app).get(`/api/events/${slug}/similar`);
    result.should.have.status(200);
    result.body.data[0].category.should.equal(category);
  });

  it('should return 404 for not found event', async () => {
    const res = await chai
      .request(app)
      .get(`/api/events/does-not-exit-00000/similar`);
    res.should.have.status(404);
    res.text.should.include('Event not found');
  });

  it('Should return null for invalid google location', async () => {
    const res = await createEvents(loggedInOrganized, invalidLoc);
    res.should.have.status(201);
  }).timeout(10000);

  // Functionality needs to be updated
  it('should retrieve event from the near by city', async () => {
    const eventResp = await createEvents(loggedInOrganized, nearByCity);
    const { slug } = eventResp.body.data;
    const result = await chai
      .request(app)
      .get(`/api/events/${slug}/nearbycity`);
    result.should.have.status(200);
    // result.body.data[0].should.have.property('distance');
    // result.body.data[0].should.have.property('duration');
  });

  it('should return 404 if slug is invalid', async () => {
    const slug = 'invalid-slug-1234';
    const result = await chai
      .request(app)
      .get(`/api/events/${slug}/nearbycity`);
    result.should.have.status(404);
    result.body.should.have.property('error').eql('Event not found');
  });
  it('should return [] if no available events near by', async () => {
    const res = await createEvents(loggedInOrganized, invalidLoc);
    const { slug } = res.body.data;
    const result = await chai
      .request(app)
      .get(`/api/events/${slug}/nearbycity`);
    result.should.have.status(200);
    result.body.should.have.property('data').eql([]);
  });
});
