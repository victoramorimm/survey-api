import { EmailValidatorAdapter } from './EmailValidatorAdapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('Email Validator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const result = sut.isValid('invalid_email')

    expect(result).toBeFalsy()
  })

  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()

    const result = sut.isValid('valid_mail@mail.com')

    expect(result).toBeTruthy()
  })

  test('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('valid_mail@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('valid_mail@mail.com')
  })
})
