import { DataSource, Repository } from 'typeorm';
import { expect } from 'chai';
import { getDataSource, initializeDataSource } from '../../../src/database/dataSource';
import TicketService from '../../../src/services/TicketService';
import TicketFactory from '../../database/factories/TicketFactory';
import Ticket from '../../../src/entities/Ticket';
import UserFactory from '../../database/factories/UserFactory';

describe('TicketService', () => {
  let dataSource: DataSource;
  let ctx: {
        service: TicketService,
        factory: TicketFactory,
        ticketRepo: Repository<Ticket>,
    };

  before(async () => {
    dataSource = await initializeDataSource();

    const service = new TicketService();
    const factory = new TicketFactory(dataSource);

    ctx = {
      service,
      factory,
      ticketRepo: getDataSource().getRepository(Ticket),
    };
  });

  after(async () => {
    await dataSource.destroy();
  });

  describe('getTicketIfValid function', () => {
    it('should return ticket if unclaimed and code is correct', async () => {
      const ticket = await ctx.factory.createSingle();
      const response = await ctx.service.getTicketIfValid(ticket.code);
      expect(response).to.deep.equal(ticket);
    });
    it('should return null if code is wrong', async () => {
      const code = 'wrong';
      expect(ctx.ticketRepo.findOne({ where: { code } })).to.eventually.be.null;

      const response = await ctx.service.getTicketIfValid('wrong');
      expect(response).to.be.null;
    });
    it('should return null if ticket is claimed and code is correct', async () => {
      const user = await (new UserFactory(dataSource)).createSingle();
      const ticket = await ctx.ticketRepo.findOneOrFail({ where: { user: { id: user.id } }, relations: ['user'] });
      const response = await ctx.service.getTicketIfValid(ticket.code);
      expect(response).to.be.null;
    });
  });
});
