import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, Security,
} from 'tsoa';
import RoleService from '../services/RoleService';
import Role, { RoleParams } from '../entities/Role';

/**
 * TODO: Add paramater validation
 */

@Route('role')
@Tags('Role')
export class RoleController extends Controller {
  /**
   * getAllRoles() - retrieve all roles
   * TODO: Add filter options
   */
  @Get('')
  @Security('local')
  public async getAllRoles(): Promise<Role[]> {
    return new RoleService().getAllRoles();
  }

  /**
   * getRole() - get single role by id
   * @param id ID of role to retrieve
   */
  @Get('{id}')
  @Security('local')
  public async getRole(id: number): Promise<Role> {
    return new RoleService().getRole(id);
  }

  /**
   * createRole() - create role
   * @param params Parameters to create role with
   */
  @Post()
  @Security('local')
  public async createRole(@Body() params: RoleParams): Promise<Role> {
    return new RoleService().createRole(params);
  }

  /**
   * updateRole() - update role
   * @param id ID of role to update
   * @param params Update subset of parameter of role
   */
  @Put('{id}')
  @Security('local')
  public async updateRole(id: number, @Body() params: Partial<RoleParams>): Promise<Role> {
    return new RoleService().updateRole(id, params);
  }

  /**
   * Delete role
   * @param id ID of the role to delete
   */
  @Delete('{id}')
  @Security('local')
  public async deleteRole(id: number): Promise<void> {
    return new RoleService().deleteRole(id);
  }
}
