import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './RequiredFieldValidation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('should not return if validation succeeds', () => {
    const sut = makeSut()

    const result = sut.validate({
      any_field: 'any_value'
    })

    expect(result).toBeFalsy()
  })
})
