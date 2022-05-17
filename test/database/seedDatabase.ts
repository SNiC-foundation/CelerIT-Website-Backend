import AppDataSource from '../../src/database/dataSource';
import UserFactory from './factories/UserFactory';
import ActivityFactory from './factories/ActivityFactory';

AppDataSource.initialize().then(async (dataSource) => {
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const userFactory = new UserFactory(dataSource);
  await userFactory.createSingle();

  const activityFactory = new ActivityFactory(dataSource);
  await activityFactory.createMultiple(20, true);
});
