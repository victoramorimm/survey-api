import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository'
import { AccountModel } from '../addAccount/DbAddAccountProtocols'
import { DbAuthenicationUseCase } from './DbAuthenticationUseCase'

const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {
  sut: DbAuthenicationUseCase;
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAuthenicationUseCase(loadAccountByEmailRepository)

  return {
    sut,
    loadAccountByEmailRepository
  }
}

const makeFakeAccount = (): AccountModel => ({
  email: 'any_email@mail.com',
  password: 'hashed_password',
  id: 'any_id',
  name: 'any_name'
})

const makeAuthenticationData = () => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Db Authentication UseCase', () => {
  test('should LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')

    await sut.auth(makeAuthenticationData())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
