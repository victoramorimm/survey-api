import { Authentication, AuthenticationData, Validation } from './LoginProtocols'
import { InvalidParamError } from '../../errors'
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: LoginController
  emailValidator: EmailValidator
  authentication: Authentication
  validation: Validation
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const authentication = makeAuthentication()
  const validation = makeValidation()

  return {
    sut: new LoginController(emailValidator, authentication, validation),
    emailValidator,
    authentication,
    validation
  }
}

describe('Login Controller', () => {
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

  test('should call Validation with correct value', async () => {
    const { sut, validation } = makeSut()

    const validateSpy = jest.spyOn(validation, 'validate')

    await sut.handle(makeHttpRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('should return 400 if Validation returned an error', async () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
      return new Error()
    })

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
