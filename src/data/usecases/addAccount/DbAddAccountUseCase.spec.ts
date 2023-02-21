import { AddAccount, AddAccountModel } from '../../../domain/usecases/IAddAccountUseCase'
import { Encrypter } from '../../protocols/Encrypter'
import { DbAddAccountUseCase } from './DbAddAccountUseCase'

type SutTypes = {
  sut: AddAccount;
  encrypter: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('encrypted_password')
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccountUseCase(encrypterStub)

  return {
    sut,
    encrypter: encrypterStub
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
})
