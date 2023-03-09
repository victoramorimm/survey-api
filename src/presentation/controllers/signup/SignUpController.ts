import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './SignUpProtocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/HttpHelper'
import { Validation } from '../login/LoginProtocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const okOrError = this.validation.validate(httpRequest.body)

      if (okOrError instanceof Error) {
        return badRequest(okOrError)
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
