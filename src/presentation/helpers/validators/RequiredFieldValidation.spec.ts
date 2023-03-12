import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './RequiredFieldValidation'

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('should not return if validation succeeds', () => {
    const sut = new RequiredFieldValidation('any_field')

    const result = sut.validate({
      any_field: 'any_value'
    })

    expect(result).toBeFalsy()
  })
})
