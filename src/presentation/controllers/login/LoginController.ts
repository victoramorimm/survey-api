import { Authentication } from '../../../domain/usecases/IAuthenticationUseCase'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/HttpHelper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      if (!body?.email) {
        return badRequest(new MissingParamError('email'))
      }

      if (!body?.password) {
        return badRequest(new MissingParamError('password'))
      }

      const { email, password } = body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authentication.auth({
        email,
        password
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
