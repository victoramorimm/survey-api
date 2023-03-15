import { HashComparer } from '../../protocols/criptography/HashComparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'
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

const makeHashComparer = () => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hashToCompare: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

type SutTypes = {
  sut: DbAuthenicationUseCase;
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  hashComparer: HashComparer;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const hashComparer = makeHashComparer()
  const sut = new DbAuthenicationUseCase(loadAccountByEmailRepository, hashComparer)

  return {
    sut,
    loadAccountByEmailRepository,
    hashComparer
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
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')

    await sut.auth(makeAuthenticationData())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    jest.spyOn(loadAccountByEmailRepository, 'load').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeAuthenticationData())

    await expect(promise).rejects.toThrowError('any_error')
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    jest.spyOn(loadAccountByEmailRepository, 'load').mockResolvedValueOnce(null)

    const accessToken = await sut.auth(makeAuthenticationData())

    expect(accessToken).toBeNull()
  })

  test('should call HashComparer with correct password', async () => {
    const { sut, hashComparer } = makeSut()

    const compareSpy = jest.spyOn(hashComparer, 'compare')

    await sut.auth(makeAuthenticationData())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should return null if HashComparer returned false', async () => {
    const { sut, hashComparer } = makeSut()

    jest.spyOn(hashComparer, 'compare').mockResolvedValueOnce(false)

    const accessToken = await sut.auth(makeAuthenticationData())

    expect(accessToken).toBeNull()
  })
})
