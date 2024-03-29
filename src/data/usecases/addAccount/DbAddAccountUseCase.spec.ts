import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './DbAddAccountProtocols'
import { DbAddAccountUseCase } from './DbAddAccountUseCase'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('encrypted_password')
    }
  }

  return new HasherStub()
}

const makeFakeAccount = (account: AddAccountModel): AccountModel => ({
  ...account,
  password: 'hashed_password',
  id: 'any_id'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount(account))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return null
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {
  sut: AddAccount;
  hasher: Hasher
  addAccountRepository: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccountUseCase(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    sut,
    hasher: hasherStub,
    addAccountRepository: addAccountRepositoryStub,
    loadAccountByEmailRepository: loadAccountByEmailRepositoryStub
  }
}

const makeAddAccountModelData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

describe('Db Add Account UseCase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasher } = makeSut()

    const encryptSpy = jest.spyOn(hasher, 'hash')

    await sut.add(makeAddAccountModelData())

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw if Hasher throws', async () => {
    const { sut, hasher } = makeSut()

    jest.spyOn(hasher, 'hash').mockImplementationOnce(async () => {
      return Promise.reject(new Error('mocked_error'))
    })

    const promise = sut.add(makeAddAccountModelData())

    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut()

    const addSpy = jest.spyOn(addAccountRepository, 'add')

    await sut.add(makeAddAccountModelData())

    expect(addSpy).toHaveBeenCalledWith({
      ...makeAddAccountModelData(),
      password: 'encrypted_password'
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepository } = makeSut()

    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error('mocked_error'))
    })

    const promise = sut.add(makeAddAccountModelData())

    await expect(promise).rejects.toThrow()
  })

  test('should return an account model on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeAddAccountModelData())

    expect(account).toEqual(makeFakeAccount(makeAddAccountModelData()))
  })

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')

    await sut.add(makeAddAccountModelData())

    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('should return null if LoadAccountByEmailRepository returns an account model', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockImplementationOnce(async () => {
      return makeFakeAccount({
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'hashed_password'
      })
    })

    const result = await sut.add(makeAddAccountModelData())

    expect(result).toBeNull()
  })
})
