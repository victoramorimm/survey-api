import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/HttpHelper'
import { EmailValidator } from '../../protocols'
import { LoginController } from './LoginController'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

type SutTypes = {
  sut: LoginController
  emailValidator: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()

  return {
    sut: new LoginController(emailValidator),
    emailValidator
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

    await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
