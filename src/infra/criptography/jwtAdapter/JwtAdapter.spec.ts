import jwt from 'jsonwebtoken'
import { JwtAdapter } from './JwtAdapter'
describe('Jwt Adapter', () => {
  test('should call sign with correct value', async () => {
    const sut = new JwtAdapter('secret')

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_value')

    expect(signSpy).toHaveBeenCalledWith({
      id: 'any_value'
    }, 'secret')
  })
})
