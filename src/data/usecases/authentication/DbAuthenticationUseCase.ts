import { Authentication, AuthenticationModel } from '../../../domain/usecases/IAuthenticationUseCase'
import { HashComparer } from '../../protocols/criptography/HashComparer'
import { TokenGenerator } from '../../protocols/criptography/TokenGenerator'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'

export class DbAuthenicationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (data: AuthenticationModel): Promise<string> {
    const { email, password } = data

    const account = await this.loadAccountByEmailRepository.load(email)

    if (account) {
      const isPasswordValid = await this.hashComparer.compare(password, account.password)

      if (isPasswordValid) {
        const token = await this.tokenGenerator.generate(account.id)

        return token
      }
    }

    return null
  }
}
