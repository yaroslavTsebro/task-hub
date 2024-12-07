export interface IUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}
