export interface JwtPayload {
  userId: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}
