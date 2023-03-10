import { AccountModel, AddAccount, AddAccountModel, HttpRequest } from './SignUpProtocols'
import { ServerError } from '../../errors'
import { SignUpController } from './SignUpController'
import { badRequest, ok, serverError } from '../../helpers/HttpHelper'
import { Validation } from '../login/LoginProtocols'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_mail@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccount: AddAccount
  validation: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validation = makeValidation()

  const sut = new SignUpController(addAccountStub, validation)

  return {
    sut,
    addAccount: addAccountStub,
    validation
  }
}

describe('SignUp Controller', () => {
  test('should call AddAccount with correct values', async () => {
    const { sut, addAccount } = makeSut()

    const addSpy = jest.spyOn(addAccount, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { addAccount, sut } = makeSut()

    jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('should call Validation with correct value', async () => {
    const { sut, validation } = makeSut()

    const validateSpy = jest.spyOn(validation, 'validate')

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('should return 400 if Validation returned an error', async () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
      return new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
