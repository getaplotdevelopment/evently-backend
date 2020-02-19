/* eslint-disable no-shadow */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

import { superUser } from '../testingData/files.json';

chai.use(chaiHttp);
chai.should();

let token;
let ticketCategoryId;
const wrongTicketCategoryId = 50;

describe('TicketCategory', () => {
  it('should create the TicketCategory', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(superUser);
    token = res.body.token;

    const createTicketCategory = {
      designation: 'VIP'
    };
    const response = await chai
      .request(app)
      .post('/api/ticket/category')
      .set('Authorization', `Bearer ${token}`)
      .send(createTicketCategory);
    response.should.have.status(201);
    response.body.should.be.a('object');
    ticketCategoryId = response.body.createdTicketCategory.id;
  }).timeout(10000);
  it('should not create a redundant ticket category', async () => {
    const createTicketCategory = {
      designation: 'VIP'
    };
    const res = await chai
      .request(app)
      .post('/api/ticket/category')
      .set('Authorization', `Bearer ${token}`)
      .send(createTicketCategory);
    res.should.have.status(400);
    res.body.should.be.a('object');
  });
  it('should update a TicketCategory', async () => {
    const updatedTicketCategory = {
      designation: 'VVIP'
    };
    const res = await chai
      .request(app)
      .put(`/api/ticket/category/${ticketCategoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTicketCategory);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should get one ticket category', async () => {
    const res = await chai
      .request(app)
      .get(`/api/ticket/category/${ticketCategoryId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should not get an unknown ticket category', async () => {
    const res = await chai
      .request(app)
      .get(`/api/ticket/category/${wrongTicketCategoryId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
  });
  it('should get all TicketCategory', async () => {
    const res = await chai
      .request(app)
      .get('/api/ticket/category')
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
});
