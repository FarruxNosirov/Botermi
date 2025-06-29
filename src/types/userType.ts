export interface UserPosition {
  id: number;
  name: string;
}

export interface UserDataType {
  id: number;
  name: string;
  surname: string;
  phone: string;
  second_phone: string;
  vip: number;
  city: string;
  positions: UserPosition[];
}
