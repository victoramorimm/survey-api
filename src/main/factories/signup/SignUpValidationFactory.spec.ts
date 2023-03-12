import { CompareFieldsValidation } from '../../../presentation/helpers/validators/CompareFieldsValidation'
import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation'
import { Validation } from '../../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'
import { EmailValidator } from '../../../presentation/protocols'
import { makeSignUpValidation } from './SignUpValidationFactory'

jest.mock('../../../presentation/helpers/validators/ValidationComposite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('Sign Up Validation Factory', () => {
  test('should call ValidationComposite with all tests', () => {
    makeSignUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
