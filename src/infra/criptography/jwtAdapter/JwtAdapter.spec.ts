import jwt from 'jsonwebtoken'
import { JwtAdapter } from './JwtAdapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  test('should call sign with correct value', async () => {
    const sut = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_value')

    expect(signSpy).toHaveBeenCalledWith({
      id: 'any_value'
    }, 'secret')
  })

  test('should return a token on sign success', async () => {
    const sut = makeSut()

    const accessToken = await sut.encrypt('any_value')

    expect(accessToken).toBe('any_token')
  })

  test('should throw if sign throws', async () => {
    const sut = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
