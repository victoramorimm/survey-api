import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/HttpHelper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    if (!body?.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!body?.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }

    const { email } = body

    this.emailValidator.isValid(email)
  }
}
