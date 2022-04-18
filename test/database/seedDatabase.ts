import AppDataSource from '../../src/database/dataSource';
import UserFactory from './factories/UserFactory';

AppDataSource.initialize().then(async (dataSource) => {
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const userFactory = new UserFactory(dataSource);
  await userFactory.createSingleUser();
});
