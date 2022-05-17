import { use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import chaiSwag from 'chai-swag';
import sinonChai from 'sinon-chai';

export default function setup() {
  process.env.NODE_ENV = 'test';
  process.env.HTTP_PORT = '3001';
  process.env.TYPEORM_CONNECTION = 'sqlite';
  process.env.TYPEORM_DATABASE = ':memory:';
  process.env.TYPEORM_SYNCHRONIZE = 'true';

  use(chaiAsPromised);
  use(chaiHttp);
  use(chaiSwag);
  use(sinonChai);
}
