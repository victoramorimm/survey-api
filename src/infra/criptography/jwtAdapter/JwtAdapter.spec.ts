import jwt from 'jsonwebtoken'
import { JwtAdapter } from './JwtAdapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  }
}))

describe('Jwt Adapter', () => {
  test('should call sign with correct value', async () => {
    const sut = new JwtAdapter('secret')

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_value')

    expect(signSpy).toHaveBeenCalledWith({
      id: 'any_value'
    }, 'secret')
  })

  test('should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret')

    const accessToken = await sut.encrypt('any_value')

    expect(accessToken).toBe('any_token')
  })
})
