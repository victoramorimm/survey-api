import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed_value')
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('should call hash with correct values', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a valid hash on hash success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hashed_value')
  })

  test('should throw if hash throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return Promise.reject(new Error('mocked_error'))
    })

    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrow()
  })

  test('should call compare with correct values', async () => {
    const sut = makeSut()

    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('should return true when compare succeeds', async () => {
    const sut = makeSut()

    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBeTruthy()
  })

  test('should return false when compare fails', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return Promise.resolve(false)
    })

    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBeFalsy()
  })

  test('should throw if compare throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
      return Promise.reject(new Error('mocked_error'))
    })

    const promise = sut.compare('any_value', 'any_hash')

    await expect(promise).rejects.toThrow()
  })
})
