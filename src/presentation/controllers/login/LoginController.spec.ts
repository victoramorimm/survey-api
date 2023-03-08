import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/HttpHelper'
import { LoginController } from './LoginController'

type SutTypes = {
  sut: LoginController
}

const makeSut = (): SutTypes => ({
  sut: new LoginController()
})

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
