import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();

const { User } = models;

const beforeFunc = async () => {
  await User.destroy();
};

export { beforeFunc };
