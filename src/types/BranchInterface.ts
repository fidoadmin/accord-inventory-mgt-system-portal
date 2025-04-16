export interface BranchInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  IsEntryPoint: boolean;
  MobileNumber: string;
  LandlineNumber: string;
  Companyguid: string;
  ClientName: string;
  Created: string;
  Modified: string;
}
export interface DeleteBranchDetailInterface {
  Id: string;
  AuthKey: string;
}
export interface BranchRequestInterface {
  Id?: string;
  Name: string;
  Address?: string | null;
  Emailaddress: string;
  MobileNumber?: string | null;
  LandlineNumber: string;

  Companyguid: string;
}
export interface BranchDetailInterface {
  Id: string;
  Name: string;
  Address: string;
  Emailaddress: string;
  MobileNumber: string;
  LandlineNumber: string;

  Companyguid: string;
  Created: string;
  Modified: string;
  BranchId: string;
  BranchName: string;
}
export interface BranchGetDetailInterface {
  Id?: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  IsEntryPoint: boolean;
  Created: string;
  Modified: string;
}

export interface AddOrUpdateBranchPayloadInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  IsEntryPoint?: boolean;
  ClientId?: string;
}

export interface AddOrUpdateBranchResponseInterface {
  id: string;
}
