export interface CompanyInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  PanNumber: string;
  Created: string;
  Modified: null;
  IsExternal: boolean;
  BranchName: string;
  ClientName: string;
  CompanyType: string;
  IsBlackList: boolean;
}

export interface AddOrUpdateCompanyRequest {
  Name: string;
  Address: string;
  Emailaddress: string;
  Phonenumber: string;
}

export interface DeleteCompanyRequest {
  id: string;
}
export interface DeleteCompanyInterface {
  Id: string;
  AuthKey: string;
}
export interface CompanyDetailInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  PanNumber: string;
  Created: string;
  Modified: null;
  IsExternal: boolean;
  IsBlackList: boolean;
  BranchName: string;
  ClientName: string;
  BranchId: string[];
  ProvinceId: string;
  DistrictId: string;
  ClientId: string;
  CompanyTypeId: string[];
  WardNumber?: number;
}

export interface CompanyTypeDetailInterface {
  Id: string;
  Name: string;
  Code: string;
  Created: string;
  Modified: null;
}

export interface AddOrUpdateCompanyPayloadInterface {
  Id: string | null;
  Name: string;
  EmailAddress: string;
  ClientId?: string;
  MobileNumber: string;
  LandlineNumber: string;
  PanNumber: string;
  BranchId: string[];
  DistrictId?: string;
  MunicipalityId?: string;
  ProvinceId?: string;
  WardNumber?: number;
  Address: string;
}

export interface AddOrUpdateCustomerPayloadInterface {
  Id: string | null;
  Name: string;
  Address: string;
  EmailAddress: string;
  ClientId?: string;
  MobileNumber: string;
  LandlineNumber: string;
  PanNumber: string;
}
export interface AddOrCompanyResponseInterface {
  id: string;
}
