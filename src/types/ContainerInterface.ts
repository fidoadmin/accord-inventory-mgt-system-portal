import { Key, ReactNode } from "react";

export interface ContainerInterface {
  Id: string;
  Type: string;
  NumberOfUnits: number;
  PackSizes: string;
  Size: string;
  ContainerId: string;
  ContainerName: string;
  Created: string;
  Modified: string | null;
}

export interface ContainerInterfaceForMaintenance {
  Id: string;
  Type: string;
  ClientName: string;
  ContainerId: string;
  NumberOfUnits: number;
  ChallanUnit: string;
  Size: string;
  CanEdit: string;
  SmallUnit: string;
  Description?: string;
  Created: string;
  Modified: string | null;
}
export interface PackSizeInterface {
  ContainerId: string;
  Packsize: string;
  SmallUnit: string;
}
export interface ContainerListInterface {
  categoryid: string;
  Id: string;
  Name: ReactNode;
  Type: string;
  PackSize: PackSizeInterface[];
  NumberOfUnits: number;
  Size: string;
}

export interface ContainerRequestInterface {
  Id: string;
  Type: string;
  NumberOfUnits: number;
  PackSizes?: string;
  Size: string;
  ContainerId: string;
}
export interface DeleteContainerDetailInterface {
  Id: string;
  AuthKey: string;
}

export interface ContainerMaintenanceDetailInterface {
  Id: string;
  Type: string;
  NumberOfUnits: number;
  PackSizes: string;
  Size: string;
  ContainerId: string;
  ContainerName: string;
  Created: string;
  Modified: string;
}

export interface AddOrUpdateContainerPayloadInterface {
  Type?: string;
  NumberOfUnits?: number | undefined;
  ClientId?: string;
  PackSizes?: string;
  Size: string;
  ChallanUnit?: string;
  Id?: string;
  CategoryId?: string;
  InventoryDescriptionId?: string;
  SmallUnit?: string;
}

export interface AddOrUpdateContainerResponseInterface {
  Id: string;
}
