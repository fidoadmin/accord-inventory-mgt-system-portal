export interface RolePermission {
  AccesslabelName: string;
  AccessLabelType: string;
  CanCreate: string;
  CanDelete: string;
  CanRead: string;
  CanUpdate: string;
  Id: string;
  RoleName: string;
  ClientName: string;
  RoleId: string;
}

// export interface PermissionItem {
//   sn: number;
//   uri: string;
//   roles: RolePermission[];
// }

export interface AddOrUpdatePermissionPayloadInterface {
  Id: string;
  CanCreate: string;
  CanDelete: string;
  CanRead: string;
  CanUpdate: string;
}

export interface AddOrUpdatePermissionResponseInterface {
  id: string;
}
