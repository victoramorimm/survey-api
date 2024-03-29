import { Authentication, AuthenticationModel } from '../../../domain/usecases/IAuthenticationUseCase'
import { UpdateAccessTokenRepository, LoadAccountByEmailRepository, Encrypter, HashComparer } from './DbAuthenticationProtocols'

export class DbAuthenticationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (data: AuthenticationModel): Promise<string> {
    const { email, password } = data

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (account) {
      const isPasswordValid = await this.hashComparer.compare(password, account.password)

      if (isPasswordValid) {
        const token = await this.encrypter.encrypt(account.id)

        await this.updateAccessTokenRepository.updateAccessToken(token, account.id)

        return token
      }
    }

    return null
  }
}
