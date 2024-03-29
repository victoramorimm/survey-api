import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { EmailValidator } from '../../../../presentation/protocols'
import { Validation } from '../../../../presentation/protocols/Validation'
import { makeLoginValidation } from './LoginValidationFactory'

jest.mock('../../../../validation/validators/ValidationComposite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  test('should call ValidationComposite with all tests', () => {
    makeLoginValidation()

    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
