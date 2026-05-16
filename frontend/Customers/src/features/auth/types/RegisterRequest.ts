export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "CUSTOMER";
  address: {
    street: string;
    apartment: string;
    city: string;
  };
}
