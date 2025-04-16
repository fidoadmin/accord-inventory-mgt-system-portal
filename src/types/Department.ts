export interface DepartmentDetailInterface {
  Id: string;
  Name: string;
  ClientName: string;
  ParentName: string;
  ParentId: string;
  Created: string;
  Modified: string;
  HasChildren: boolean;
}

export interface AddOrUpdateDepartmentPayloadInterface {
  Id?: string;
  Name?: string;
  ParentId: string;
  ParentName?: string;
  ClientId?: string;
}

export interface AddOrUpdateDepartmentResponseInterface {
  id: string;
}

export interface DeleteDepartmentInterface {
  Id: string;
  AuthKey: string;
}
