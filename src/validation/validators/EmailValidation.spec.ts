import { EmailValidation } from './EmailValidation'
import { EmailValidator } from '../protocols/EmailValidator'
import { InvalidParamError } from '../../presentation/errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidator: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidator: emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('should call email validator with correct email', () => {
    const { sut, emailValidator } = makeSut()

    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    sut.validate({
      email: 'any_email@mail.com'
    })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if email validator throws', () => {
    const { emailValidator, sut } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  test('should return an error if EmailValidator returned false', () => {
    const { emailValidator, sut } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      return false
    })

    const result = sut.validate({
      email: 'any_email@mail.com'
    })

    expect(result).toEqual(new InvalidParamError('email'))
  })
})
