import { Repository } from 'typeorm';
import Role, { RoleParams } from '../entities/Role';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

export default class RoleService {
  repo: Repository<Role>;

  constructor(repo?: Repository<Role>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Role);
  }

  /**
   * Get all Roles
   */
  public async getAllRoles(): Promise<Role[]> {
    return this.repo.find();
  }

  /**
   * Get one Role
   * TODO: Add relations in findOne()
   */
  async getRole(id: number): Promise<Role> {
    const role = await this.repo.findOne({ where: { id } });
    if (role == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Role not found');
    }
    return role;
  }

  /**
   * Create Role
   */
  createRole(params: RoleParams): Promise<Role> {
    const role = {
      ...params,
    } as any as Role;
    return this.repo.save(role);
  }

  /**
   * Update Role
   */
  async updateRole(id: number, params: Partial<RoleParams>): Promise<Role> {
    await this.repo.update(id, params);
    const role = await this.getRole(id);

    if (role == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return role;
  }

  /**
   * Delete Role
   * TODO: Add relations in findOne()
   */
  async deleteRole(id: number): Promise<void> {
    const role = await this.repo.findOne({ where: { id } });

    if (role == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Role not found');
    }

    await this.repo.delete(role.id);
  }
}
