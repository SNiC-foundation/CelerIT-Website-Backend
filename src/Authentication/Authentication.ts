import express from 'express';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  switch (securityName) {
    case 'local': {
      if (!request.isAuthenticated() || request.user === undefined) {
        throw new Error('You are not logged in.');
      }

      // // If any roles are defined, check them
      // if (scopes !== undefined && scopes.length > 0) {
      //   const user = (await AppDataSource.getRepository(User)
      //     .findOne({ where: { id: (request.user as User).id }, relations: ['roles'] }))!;
      //
      //   // Compute if there is an intersection
      //   const intersect = user.roles.some((r) => scopes.find((s) => s === r.name) !== undefined);
      //   // If the intersection of the roles is non-empty, the user is authorized
      //   if (!intersect) {
      //     throw new ApiError(HTTPStatus.Unauthorized, 'You don\'t have permission to do this.');
      //   }
      // }
      return request.user;
    }
    default: throw new Error('Unknown security scheme');
  }
}
