import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './RequiredFieldValidation'

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('any_field'))
  })
})
