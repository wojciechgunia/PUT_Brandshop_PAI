export interface IUser {
  login: string;
  email: string;
  role: string;
}

export class User {
  constructor(
    public login: string,
    public email: string,
    public role: string
  ) {}
}

export interface UserAdminis {
  uuid: string;
  login: string;
  email: string;
  role: string;
  islock: boolean;
  isenabled: boolean;
}

export interface GetUsersAdminResponse {
  users: UserAdminis[];
  totalCount: number;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  email: string;
  login: string;
  password: string;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface AuthResponse {
  timestamp: string;
  message: string;
  code: string;
}

export interface LoggedInResponse extends Omit<AuthResponse, 'message'> {
  access: boolean;
}

export interface RecoveryPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  uid: string;
}
