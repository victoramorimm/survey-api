import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/HttpHelper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    if (!body?.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!body?.password) {
      return badRequest(new MissingParamError('password'))
    }

    const { email } = body

    const isEmailValid = this.emailValidator.isValid(email)

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
