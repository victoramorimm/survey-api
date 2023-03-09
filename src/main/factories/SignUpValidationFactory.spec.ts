import { RequiredFieldValidation } from '../../presentation/helpers/validators/RequiredFieldValidation'
import { Validation } from '../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../presentation/helpers/validators/ValidationComposite'
import { makeSignUpValidation } from './SignUpValidationFactory'

jest.mock('../../presentation/helpers/validators/ValidationComposite')

describe('Sign Up Validation Factory', () => {
  test('should call ValidationComposite with all tests', () => {
    makeSignUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
