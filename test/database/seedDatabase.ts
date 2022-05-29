import { initializeDataSource } from '../../src/database/dataSource';
import UserFactory from './factories/UserFactory';

initializeDataSource().then(async (dataSource) => {
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const userFactory = new UserFactory(dataSource);
  await userFactory.createSingle();
});
