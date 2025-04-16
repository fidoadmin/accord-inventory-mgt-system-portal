export interface RoleDetailInterface {
  Id: string;
  Name: string;
  Code: string;
  ClientName: string;
  Created: string;
  Modified: string;
}

export interface AddOrUpdateRolePayloadInterface {
  Id?: string;
  Name?: string;
  ClientId?: string;
}

export interface AddOrUpdateRoleResponseInterface {
  id: string;
}

export interface DeleteRoleInterface {
  Id: string;
  AuthKey: string;
}
