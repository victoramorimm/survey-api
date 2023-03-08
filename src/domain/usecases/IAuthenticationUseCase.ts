export type AuthenticationData = {
  email: string;
  password: string
}

export interface Authentication {
  auth (data: AuthenticationData): Promise<string>
}
