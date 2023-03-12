import { Validation } from './Validation'
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
  validation: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()

  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validation: validationStub
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validation } = makeSut()

    const mockedError = new Error('mocked_error')

    jest.spyOn(validation, 'validate').mockReturnValueOnce(mockedError)

    const validateResult = sut.validate({ field: 'any_value' })

    expect(validateResult).toEqual(mockedError)
  })
})
