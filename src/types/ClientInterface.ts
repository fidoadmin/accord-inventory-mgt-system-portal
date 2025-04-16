export interface ClientDetailInterface {
  Id: string | undefined;
  Name?: string;
  Code?: string;
  Created?: string;
  Modified?: string;
}
export interface DeleteClientInterface {
  Id: string;
  AuthKey: string;
}

export interface ClientUpdateInterface {
  Id: string;
  Name: string;
  Code: string;
  Created: string;
  Modified: string;
}

export interface AddOrUpdateClientPayloadInterface {
  Id?: string;
  Name?: string;
}

export interface AddOrUpdateClientResponseInterface {
  id: string;
}
