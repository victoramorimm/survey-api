import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './CompareFieldsValidation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Compare Fields Validation', () => {
  test('should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()

    const error = sut.validate({
      field: 'correct_value',
      fieldToCompare: 'incorrect_value'
    })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return if validation succeeds', () => {
    const sut = makeSut()

    const result = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })

    expect(result).toBeFalsy()
  })
})
