export interface Address {
  city: string;
  state: string;
  pin: string;
}

export interface UserContact {
  userid?: string;
  name: string;
  mobile: string;
  address: Address;
}

export interface Props {
  contacts: UserContact[];
  onEditSave: (contact: UserContact) => void;
  onDelete: (userid: string) => void;
}