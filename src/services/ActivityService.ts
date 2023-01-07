import { In, Not, Repository } from 'typeorm';
import Activity, { ActivityParams } from '../entities/Activity';
import { getDataSource } from '../database/dataSource';
import { ApiError, HTTPStatus } from '../helpers/error';
import SubscribeActivityService from './SubscribeActivityService';
import Speaker from '../entities/Speaker';
import User from '../entities/User';
import UserService from './UserService';
import ProgramPartService from './ProgramPartService';
import SubscribeActivity from '../entities/SubscribeActivity';

export interface ActivityResponse {
  activity: Activity;
  nrOfSubscribers: number;
}

export default class ActivityService {
  repo: Repository<Activity>;

  constructor(repo?: Repository<Activity>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Activity);
  }

  /**
   * Get all Activities
   */
  public async getAllActivities(): Promise<ActivityResponse[]> {
    return (await this.repo.find({
      relations: {
        speakers: true,
        subscribe: {
          subscribers: true,
        },
      },
    })).map((act): ActivityResponse => ({
      activity: {
        ...act,
        // @ts-ignore
        subscribe: act.subscribe != null ? {
          ...act.subscribe,
          subscribers: [],
        } : null,
      },
      nrOfSubscribers: act.subscribe != null ? act.subscribe.subscribers.length : 0,
    }));
  }

  /**
   * Get one Activity
   * TODO: Add relations in findOne()
   */
  async getActivity(id: number): Promise<Activity> {
    const activity = await this.repo.findOne({ where: { id }, relations: ['speakers', 'subscribe', 'subscribe.subscribers'] });
    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Activity not found');
    }
    return activity;
  }

  /**
   * Create Activity
   */
  async createActivity(params: ActivityParams): Promise<Activity> {
    const activity = {
      ...params,
    } as any as Activity;
    let ac = await this.repo.save(activity);
    ac = await this.getActivity(activity.id);
    return ac;
  }

  /**
   * Update Activity
   */
  async updateActivity(id: number, params: ActivityParams): Promise<Activity> {
    const activity = await this.getActivity(id);
    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    const { subscribe, speakerIds, ...rest } = params;
    await this.repo.update(id, rest);
    if (speakerIds) {
      const speakerRepo = getDataSource().getRepository(Speaker);
      activity.speakers = await speakerRepo.find({ where: { id: In(speakerIds) } });
      await this.repo.save(activity);
    }

    if (activity.subscribe && subscribe) {
      await new SubscribeActivityService()
        .updateSubscribeActivity(activity.subscribe.id, subscribe);
    } else if (!activity.subscribe && subscribe) {
      await new SubscribeActivityService()
        .createSubscribeActivity({
          ...subscribe,
          activityId: activity.id,
        });
    } else if (activity.subscribe && !subscribe) {
      await new SubscribeActivityService().deleteSubscribeActivity(activity.subscribe.id);
    }

    return this.getActivity(id);
  }

  /**
   * Delete Activity
   * TODO: Add relations in findOne()
   */
  async deleteActivity(id: number): Promise<void> {
    const activity = await this.repo.findOne({ where: { id } });

    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Activity not found');
    }

    if (activity.subscribe != null) {
      await new SubscribeActivityService().deleteSubscribeActivity(activity.subscribe.id);
    }

    await this.repo.delete(activity.id);
  }

  async subscribeToActivity(id: number, user: User): Promise<void> {
    // Executed in a single transaction, as checking whether the subscription
    // is valid and actually subscribing should be a single atomic action
    await getDataSource().transaction(async (manager) => {
      const activity = await this.getActivity(id);

      const { subscribe } = activity;

      if (activity.subscribe == null || subscribe == null) throw new ApiError(HTTPStatus.BadRequest, 'Activity cannot be subscribed to');
      if (subscribe.subscriptionListOpenDate.getTime() > Date.now()) throw new ApiError(HTTPStatus.BadRequest, 'Subscription list is not yet open');
      if (subscribe.subscriptionListCloseDate.getTime() < Date.now()) throw new ApiError(HTTPStatus.BadRequest, 'Subscription list is already closed');
      if (subscribe.subscribers.length >= subscribe.maxParticipants) throw new ApiError(HTTPStatus.BadRequest, 'Activity has already reached max number of subscribers');
      if (subscribe.subscribers.some((u) => u.id === user.id)) throw new ApiError(HTTPStatus.BadRequest, 'You are already subscribed to this activity');

      // Subscribe to the activity
      activity.subscribe.subscribers.push(user);
      await manager.save<Activity>(activity);

      // Unsubscribe from all other activities that have the same program part
      const activitiesInSameProgramPart = await this.repo
        .find({ where: { programPartId: activity.programPartId, id: Not(activity.id) }, relations: ['subscribe', 'subscribe.subscribers'] });
      activitiesInSameProgramPart.forEach((act) => {
        if (act.subscribe) {
          // eslint-disable-next-line no-param-reassign
          act.subscribe.subscribers = act.subscribe.subscribers.filter((u) => u.id !== user.id);
        }
      });
      await manager.save<Activity>(activitiesInSameProgramPart);
    });
  }

  /**
   * Automatically sign up users to activities, if they are not subscribed to all tracks
   */
  async subscribeRemainingUsers() {
    const subscribeActivities = await new SubscribeActivityService()
      .getAllSubscribeActivities({ activity: true, programPart: true });
    if (subscribeActivities.some((a) => a.subscriptionListCloseDate.getTime() > Date.now())) {
      throw new ApiError(HTTPStatus.BadRequest, 'Not all subscription lists are closed');
    }

    const programParts = subscribeActivities
      .map((s) => s.activity.programPart)
      .filter((p, i, self) => i === self.findIndex((x) => x.id === p.id));

    const users = await new UserService().getAllUsers({ subscriptions: true });
    // Get all users who have not subscribed to 3 tracks.
    const filteredUsers = users.filter((u) => u.subscriptions.length < 3 && !!u.participantInfo);

    const subscribeActRepo = getDataSource().getRepository(SubscribeActivity);

    // eslint-disable-next-line no-restricted-syntax
    for (const user of filteredUsers) {
      // Get all program parts a user is indirectly not subscribed to, i.e. the user is not
      // subscribed to any activity that belongs to these program parts
      // eslint-disable-next-line no-await-in-loop
      const programPartsToSubscribeTo = await Promise.all(programParts
        .filter((p) => !user.subscriptions.some((s) => s.activity.programPart.id === p.id))
        .map((p) => new ProgramPartService()
          .getProgramPart(p.id, { subscribe: true, activity: true })));

      // eslint-disable-next-line no-restricted-syntax
      for (const programPart of programPartsToSubscribeTo) {
        // Get all activities that still have available slots
        const availableActivities = programPart.activities
          .filter((a) => a.subscribe
            && a.subscribe.subscribers.length < a.subscribe.maxParticipants);

        const chosenActivity = availableActivities[
          Math.floor(Math.random() * availableActivities.length)
        ];
        const subscribeAct = chosenActivity.subscribe!;

        subscribeAct.subscribers.push(user);
        // eslint-disable-next-line no-await-in-loop
        await subscribeActRepo.save(subscribeAct);
      }
    }
  }
}
