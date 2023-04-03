import { AccountModel, AddAccount, AddAccountModel, HttpRequest } from './SignUpProtocols'
import { EmailInUseError, ServerError } from '../../errors'
import { SignUpController } from './SignUpController'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/HttpHelper'
import { Authentication, AuthenticationModel, Validation } from '../login/LoginProtocols'

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

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    auth (data: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccount: AddAccount
  validation: Validation
  authentication: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validation = makeValidation()
  const authentication = makeAuthentication()

  const sut = new SignUpController(addAccountStub, validation, authentication)

  return {
    sut,
    addAccount: addAccountStub,
    validation,
    authentication
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

    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  test('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccount } = makeSut()

    jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
      return Promise.resolve(null)
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({
      accessToken: 'any_token'
    }))
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

  test('should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()

    const authSpy = jest.spyOn(authentication, 'auth')

    const request = makeFakeRequest()

    await sut.handle(request)

    expect(authSpy).toHaveBeenCalledWith({
      email: 'valid_mail@mail.com',
      password: request.body.password
    })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
      throw new Error('mocked_error')
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error('mocked_error')))
  })
})
