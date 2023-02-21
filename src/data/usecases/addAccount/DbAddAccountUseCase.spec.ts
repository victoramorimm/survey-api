import { DbAddAccountUseCase } from './DbAddAccountUseCase'

describe('Db Add Account UseCase', () => {
  test('should call Encrypter with correct password', () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return Promise.resolve('encrypted_password')
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccountUseCase(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
