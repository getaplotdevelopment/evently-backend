/* eslint-disable no-shadow */
import chai from 'chai';
import chaitHttp from 'chai-http';
import app from '../../index';
import models from '../../models/index';

import { signupUser6 } from '../testingData/files.json';

chai.use(chaitHttp);
chai.should();

const { Roles } = models;
const roles = new Roles();

let token;
let roleId;
const wrongRoleId = 50;

// before(async () => {
//   await roles.destroy({ where: {}, truncate: true });
// });

describe('roles', () => {
  it('should create the roles', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser6);
    token = res.body.token;

    const createRoles = {
      designation: 'USERS'
    };
    const response = await chai
      .request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${token}`)
      .send(createRoles);
    response.should.have.status(201);
    response.body.should.be.a('object');
    roleId = response.body.createdRole.id;
  }).timeout(10000);
  it("should not create a with an existing role's designation", async () => {
    const createRole = {
      designation: 'USER'
    };
    const res = await chai
      .request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${token}`)
      .send(createRole);
    res.should.have.status(400);
    res.body.should.be.a('object');
  });
  it('should update a roles', async () => {
    const updatedRoles = {
      designation: 'ORGANIZER'
    };
    const res = await chai
      .request(app)
      .put(`/api/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedRoles);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should get one role', async () => {
    const res = await chai
      .request(app)
      .get(`/api/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
  it('should not get an unexisting role', async () => {
    const res = await chai
      .request(app)
      .get(`/api/roles/${wrongRoleId}`)
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
  });
  it('should get roles', async () => {
    const res = await chai
      .request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${token}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
  });
});
