import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './DbAddAccountProtocols'
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

type SutTypes = {
  sut: AddAccount;
  hasher: Hasher
  addAccountRepository: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccountUseCase(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasher: hasherStub,
    addAccountRepository: addAccountRepositoryStub
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
})
