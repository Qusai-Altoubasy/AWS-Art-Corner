export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  address: Address;
}

export interface Address {
  street: string;
  apartment: string;
  city: string;
}
