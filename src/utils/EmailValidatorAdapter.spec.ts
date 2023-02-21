import { EmailValidatorAdapter } from './EmailValidatorAdapter'

describe('Email Validator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    const result = sut.isValid('invalid_email')

    expect(result).toBeFalsy()
  })
})
