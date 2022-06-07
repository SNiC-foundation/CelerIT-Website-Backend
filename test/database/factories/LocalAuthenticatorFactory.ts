import { DataSource, Repository } from 'typeorm';
import User from '../../../src/entities/User';
import Factory from './Factory';
import LocalAuthenticator, { LocalAuthenticatorParams } from '../../../src/entities/Authentication/LocalAuthenticator';
import { generateSalt, hashPassword } from '../../../src/Authentication/LocalStrategy';
import UserFactory from './UserFactory';

export default class LocalAuthenticatorFactory extends Factory<LocalAuthenticator> {
  private userRepo: Repository<User>;

  private userFactory: UserFactory;

  constructor(dataSource: DataSource) {
    super();
    this.userRepo = dataSource.getRepository(User);
    this.repo = dataSource.getRepository(LocalAuthenticator);
    this.userFactory = new UserFactory(dataSource);
  }

  private constructObject(): Promise<LocalAuthenticator> {
    return this.userFactory.createSingle().then((user) => {
      const salt = generateSalt();
      const localAuthParams: LocalAuthenticatorParams = {
        hash: hashPassword(user.name, salt),
        salt,
        user,
        verifiedEmail: true,
      };
      const localAuth = new LocalAuthenticator();
      localAuth.user = localAuthParams.user;
      localAuth.salt = localAuthParams.salt;
      localAuth.hash = localAuthParams.hash;
      localAuth.verifiedEmail = localAuthParams.verifiedEmail;

      return localAuth;
    });
  }

  async createSingle(): Promise<LocalAuthenticator> {
    const user = await this.constructObject();
    return this.repo.save(user);
  }

  async createMultiple(amount: number): Promise<LocalAuthenticator[]> {
    const promises: Promise<any>[] = [];
    const auths: LocalAuthenticator[] = [];

    for (let i = 0; i < amount; i += 1) {
      promises.push(this.constructObject().then((local) => auths.push(local)));
    }
    await Promise.all(promises);

    return this.repo.save(auths);
  }
}
