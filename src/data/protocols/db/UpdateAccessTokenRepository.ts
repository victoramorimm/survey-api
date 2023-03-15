export interface UpdateAccessTokenRepository {
  update (accessToken: string, accountId: string): Promise<void>
}
