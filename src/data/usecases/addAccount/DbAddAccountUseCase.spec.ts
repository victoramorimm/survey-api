import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './DbAddAccountProtocols'
import { DbAddAccountUseCase } from './DbAddAccountUseCase'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('encrypted_password')
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({
        ...account,
        password: 'hashed_password',
        id: 'any_id'
      })
    }
  }

  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: AddAccount;
  encrypter: Encrypter
  addAccountRepository: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccountUseCase(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypter: encrypterStub,
    addAccountRepository: addAccountRepositoryStub
  }
}

const makeAddAccountModelData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

describe('Db Add Account UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypter } = makeSut()

    const encryptSpy = jest.spyOn(encrypter, 'encrypt')

    await sut.add(makeAddAccountModelData())

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypter } = makeSut()

    jest.spyOn(encrypter, 'encrypt').mockImplementationOnce(async () => {
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

    expect(account).toEqual({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      id: 'any_id'
    })
  })
})
