export interface UserResponse {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  Created: string;
  Modified: string | null;
}
export interface UserDetailInterface {
  Id: string;
  // Name: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  Created: string;
  Modified: null;
}
export interface SalesUserInterface {
  Id: string;
  FullName: string;
  EmailAddress: string;
}

export interface UserGetInterface {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  StaffNumber: string;
  ClientName: string;
  RoleName: string;
  CompanyName: string;
  Created: string;
  Modified: null;
}

export interface UserUpdateInterface {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  StaffNumber: string;
  ClientName: string;
  RoleName: string;
  CompanyName: string;
}
export interface UserResponseInterface {
  id: string;
}

export interface UserPasswordInterface {
  Id: string;
  CurrentPassword: string;
  ChangePassword: string;
}

export interface DeleteUserInterface {
  Id: string;
  AuthKey: string;
}
export interface AddOrUpdateUserPayloadInterface {
  Id?: string;
  FirstName?: string;
  LastName?: string;
  Address?: string;
  EmailAddress?: string;
  MobileNumber?: string;
  LandlineNumber?: string;
  ClientName?: string;
  RoleName?: string;
  Password?: string;
  RePassword?: string;
  CompanyName?: string;
  DepartmentId?: string;
  CompanyId?: string;
  ClientId?: string;
  RoleId?: string;
}

export interface AddOrUpdateUserResponseInterface {
  error: any;
  id: string;
}
