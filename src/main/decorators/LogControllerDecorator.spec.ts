import { LogErrorRepository } from '../../data/protocols/LogErrorRepository'
import { serverError } from '../../presentation/helpers/HttpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

const makeController = (): Controller => {
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

  return new ControllerStub()
}

type SutTypes = {
  sut: LogControllerDecorator;
  controller: Controller;
  logErrorRepository: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorStub)
  return {
    sut,
    controller: controllerStub,
    logErrorRepository: logErrorStub
  }
}
describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controller } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const controllerSpy = jest.spyOn(controller, 'handle')

    await sut.handle(httpRequest)

    expect(controllerSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name'
      }
    })
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controller, logErrorRepository } = makeSut()

    const fakeError = new Error()

    fakeError.stack = 'any_stack'

    const error = serverError(fakeError)

    jest.spyOn(controller, 'handle').mockResolvedValueOnce(Promise.resolve(error))

    const logSpy = jest.spyOn(logErrorRepository, 'log')

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})
