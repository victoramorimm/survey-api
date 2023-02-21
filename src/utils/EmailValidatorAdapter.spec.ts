import { EmailValidatorAdapter } from './EmailValidatorAdapter'
import validator from 'validator'
import { EmailValidator } from '../presentation/protocols'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

describe('Email Validator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const result = sut.isValid('invalid_email')

    expect(result).toBeFalsy()
  })

  test('should return true if validator returns true', () => {
    const sut = makeSut()

    const result = sut.isValid('valid_mail@mail.com')

    expect(result).toBeTruthy()
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('valid_mail@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('valid_mail@mail.com')
  })
})
