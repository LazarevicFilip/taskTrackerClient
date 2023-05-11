export interface UserRegisterModel
{
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  projectIds?: number[];
}
