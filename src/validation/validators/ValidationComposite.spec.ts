import { Validation } from '../../presentation/protocols'
import { ValidationComposite } from './ValidationComposite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: ValidationComposite;
  validations: Validation[]
}

const makeSut = (): SutTypes => {
  const firstValidation = makeValidation()
  const secondValidation = makeValidation()

  const sut = new ValidationComposite([firstValidation, secondValidation])

  return {
    sut,
    validations: [firstValidation, secondValidation]
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validations } = makeSut()

    const mockedError = new Error('mocked_error')

    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(mockedError)

    const validateResult = sut.validate({ field: 'any_value' })

    expect(validateResult).toEqual(mockedError)
  })

  test('should return the first error if more than one validation failed', () => {
    const { sut, validations } = makeSut()

    const mockedError = new Error('first_error')

    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(mockedError)
    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new Error('second_error'))

    const validateResult = sut.validate({ field: 'any_value' })

    expect(validateResult).toEqual(mockedError)
  })

  test('should not return if all validations succeeds', () => {
    const { sut } = makeSut()

    const validateResult = sut.validate({ field: 'any_value' })

    expect(validateResult).toBeFalsy()
  })
})
