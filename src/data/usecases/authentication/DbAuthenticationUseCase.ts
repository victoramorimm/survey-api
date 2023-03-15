import { Authentication, AuthenticationModel } from '../../../domain/usecases/IAuthenticationUseCase'
import { HashComparer } from '../../protocols/criptography/HashComparer'
import { TokenGenerator } from '../../protocols/criptography/TokenGenerator'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../protocols/db/UpdateAccessTokenRepository'

export class DbAuthenicationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (data: AuthenticationModel): Promise<string> {
    const { email, password } = data

    const account = await this.loadAccountByEmailRepository.load(email)

    if (account) {
      const isPasswordValid = await this.hashComparer.compare(password, account.password)

      if (isPasswordValid) {
        const token = await this.tokenGenerator.generate(account.id)

        await this.updateAccessTokenRepository.update(token, account.id)

        return token
      }
    }

    return null
  }
}
