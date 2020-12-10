export interface Authenticator {
  auth(email: string, password: string);
}
