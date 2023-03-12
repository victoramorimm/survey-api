import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository'
import { AccountModel } from '../addAccount/DbAddAccountProtocols'
import { DbAuthenicationUseCase } from './DbAuthenticationUseCase'

const makeFakeAccount = (): AccountModel => ({
  email: 'any_email@mail.com',
  password: 'hashed_password',
  id: 'any_id',
  name: 'any_name'
})

describe('Db Authentication UseCase', () => {
  test('should LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return makeFakeAccount()
      }
    }

    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()

    const sut = new DbAuthenicationUseCase(loadAccountByEmailRepository)

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')

    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
