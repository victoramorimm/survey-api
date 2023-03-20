export interface UpdateAccessTokenRepository {
  updateAccessToken (accessToken: string, accountId: string): Promise<void>
}
