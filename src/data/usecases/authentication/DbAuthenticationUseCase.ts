import { Authentication, AuthenticationModel } from '../../../domain/usecases/IAuthenticationUseCase'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'

export class DbAuthenicationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (data: AuthenticationModel): Promise<string> {
    const { email } = data

    await this.loadAccountByEmailRepository.load(email)

    return ''
  }
}
