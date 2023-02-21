import { AddAccount } from '../../../domain/usecases/IAddAccountUseCase'
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

describe('Db Add Account UseCase', () => {
  test('should call Encrypter with correct password', () => {
    const { sut, encrypter } = makeSut()

    const encryptSpy = jest.spyOn(encrypter, 'encrypt')

    sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
