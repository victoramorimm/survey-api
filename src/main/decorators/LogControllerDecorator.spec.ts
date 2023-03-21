import { LogErrorRepository } from '../../data/protocols/db/log/LogErrorRepository'
import { AccountModel } from '../../domain/models/AccountModel'
import { ok, serverError } from '../../presentation/helpers/http/HttpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount))
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
    async logError (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_mail@mail.com',
  password: 'valid_password'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()

  fakeError.stack = 'any_stack'

  return serverError(fakeError)
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

    const httpRequest = makeFakeRequest()

    const controllerSpy = jest.spyOn(controller, 'handle')

    await sut.handle(httpRequest)

    expect(controllerSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount))
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controller, logErrorRepository } = makeSut()

    jest.spyOn(controller, 'handle').mockResolvedValueOnce(Promise.resolve(makeFakeServerError()))

    const logSpy = jest.spyOn(logErrorRepository, 'logError')

    await sut.handle(makeFakeRequest())

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
