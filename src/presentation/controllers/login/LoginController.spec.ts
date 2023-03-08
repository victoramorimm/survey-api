import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/HttpHelper'
import { LoginController } from './LoginController'

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()

    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
