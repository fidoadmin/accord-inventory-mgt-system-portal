export interface AgentInterface {
  Id: string;
  Name: string;
  Emailaddress: string;
  Phonenumber: string;
  Address: string;
  Created: string;
  Modified: string | null;
}

export interface CreateUpdateAgentRequestInterface {
  Name: string;
  Emailaddress: string;
  Phonenumber: string;
  Address: string;
  Created?: string; // Optional for updates
  Modified?: string | null; // Optional for updates
}

export interface DeleteAgentResponseInterface {
  success: boolean;
  message?: string;
}
export interface DeleteAgentDetailInterface {
  Id: string;
  AuthKey: string;
}
export interface AgentDetailInterface {
  Id: string;
  Name: string;
  Address: string;
  Emailaddress: string;
  Phonenumber: string;
  // Companyguid: null;
  Created: string;
  Modified: string;
  // EntryPoint: false;
}

export interface AddOrUpdateAgentPayloadInterface {
  Id: string;
  Name: string;
  Address: string;
  Emailaddress: string;
  Phonenumber: string;
  // Companyguid: null;
  Created: string;
  Modified: string;
  // EntryPoint: false;
}

export interface AddOrUpdateAgentResponseInterface {
  id: string;
}
