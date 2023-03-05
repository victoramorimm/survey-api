import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    class ControllerStub implements Controller {
      handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'any_name'
          }
        }

        return Promise.resolve(httpResponse)
      }
    }
    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const controllerSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(httpRequest)

    expect(controllerSpy).toHaveBeenCalledWith(httpRequest)
  })
})
