import { Authentication, AuthenticationData } from '../../../domain/usecases/IAuthenticationUseCase'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/HttpHelper'
import { EmailValidator } from '../../protocols'
import { LoginController } from './LoginController'

const makeHttpRequest = () => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    auth (data: AuthenticationData): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

type SutTypes = {
  sut: LoginController
  emailValidator: EmailValidator
  authentication: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const authentication = makeAuthentication()

  return {
    sut: new LoginController(emailValidator, authentication),
    emailValidator,
    authentication
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()

    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle(makeHttpRequest())

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      return false
    })

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 500 if Email Validator throws', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error('mocked_error')
    })

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error('mocked_error')))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()

    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(makeHttpRequest())

    expect(authSpy).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authentication } = makeSut()

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
      return null
    })

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
      throw new Error('mocked_error')
    })

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error('mocked_error')))
  })

  test('should return 200 if valid credentials were provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
