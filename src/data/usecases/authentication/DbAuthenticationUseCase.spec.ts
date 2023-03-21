import { HashComparer, Encrypter, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AccountModel } from './DbAuthenticationProtocols'
import { DbAuthenticationUseCase } from './DbAuthenticationUseCase'

const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
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

const makeEncrypter = () => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (accessToken: string, accountId: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes = {
  sut: DbAuthenticationUseCase;
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  hashComparer: HashComparer;
  encrypter: Encrypter;
  updateAccessTokenRepository: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const hashComparer = makeHashComparer()
  const encrypter = makeEncrypter()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()

  const sut = new DbAuthenticationUseCase(loadAccountByEmailRepository, hashComparer, encrypter, updateAccessTokenRepository)

  return {
    sut,
    loadAccountByEmailRepository,
    hashComparer,
    encrypter,
    updateAccessTokenRepository
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

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')

    await sut.auth(makeAuthenticationData())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeAuthenticationData())

    await expect(promise).rejects.toThrowError('any_error')
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockResolvedValueOnce(null)

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

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparer } = makeSut()

    jest.spyOn(hashComparer, 'compare').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeAuthenticationData())

    await expect(promise).rejects.toThrowError('any_error')
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypter } = makeSut()

    const encryptSpy = jest.spyOn(encrypter, 'encrypt')

    await sut.auth(makeAuthenticationData())

    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypter } = makeSut()

    jest.spyOn(encrypter, 'encrypt').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeAuthenticationData())

    await expect(promise).rejects.toThrowError('any_error')
  })

  test('should return access token on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeAuthenticationData())

    expect(accessToken).toBe('any_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()

    const repositorySpy = jest.spyOn(updateAccessTokenRepository, 'updateAccessToken')

    await sut.auth(makeAuthenticationData())

    expect(repositorySpy).toHaveBeenCalledWith('any_token', 'any_id')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()

    jest.spyOn(updateAccessTokenRepository, 'updateAccessToken').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeAuthenticationData())

    await expect(promise).rejects.toThrowError('any_error')
  })
})
