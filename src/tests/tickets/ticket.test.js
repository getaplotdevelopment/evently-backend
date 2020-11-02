/* eslint-disable no-shadow */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../app';

import { superUser, loginOrganizer } from '../testingData/files.json';

chai.use(chaiHttp);
chai.should();

let token;
let ticketId;
const slug = 'slug-123456';
const wrongSlug = 'slug-0987654321';
const wrongTicketId = 50000;

describe('Tickets', () => {
  it('should create the Ticket', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginOrganizer);
    token = res.body.token;

    const createTicket = {
      price: [{ vvip: 200, regular: 300, table: 800 }],
      category: [{ vvip: 1, regular: 1, table: 1 }]
    };
    const response = await chai
      .request(app)
      .post(`/api/ticket/${slug}`)
      .set('Authorization', `Bearer ${token}`)
      .send(createTicket);
    response.should.have.status(201);
    response.body.should.be.a('object');
    ticketId = 1;
  }).timeout(10000);
  it('should only create ticket with available category', async () => {
    const createTicket = {
      price: [{ vvip: 200, regular: 300, table: 800 }],
      category: [{ notExist: 1 }]
    };
    const res = await chai
      .request(app)
      .post(`/api/ticket/${slug}`)
      .set('Authorization', `Bearer ${token}`)
      .send(createTicket);
    res.should.have.status(404);
    res.body.should.be.a('object');
  });
  it('should update a ticket', async () => {
    const updatedTicketCategory = {
      status: 'booked'
    };
    const res = await chai
      .request(app)
      .put(`/api/ticket/${slug}/${ticketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTicketCategory);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should get one ticket', async () => {
    const res = await chai
      .request(app)
      .get(`/api/ticket/${slug}/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should not get a ticket with a wrong slug', async () => {
    const res = await chai
      .request(app)
      .get(`/api/ticket/${wrongSlug}/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
  });
  it('should not get an unknown ticket', async () => {
    const res = await chai
      .request(app)
      .get(`/api/ticket/category/${slug}/${wrongTicketId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
  });
  it('should get all tickets', async () => {
    const res = await chai
      .request(app)
      .get('/api/ticket')
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should get tickets by event', async () => {
    const res = await chai
      .request(app)
      .get(`/api/ticket/${slug}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
});
