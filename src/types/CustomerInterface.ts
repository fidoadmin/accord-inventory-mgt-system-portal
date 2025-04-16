export interface AddOrUpdateCustomerPayloadInterface {
  Id: string | null;
  Name: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  PanNumber: string;
  BranchId: string[];
  ClientId: string;
  CompanyTypeId: string[];
  IsBlackList: boolean;
}
