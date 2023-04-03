import { AddAccount, Controller, HttpRequest, HttpResponse } from './SignUpProtocols'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/HttpHelper'
import { Authentication, Validation } from '../login/LoginProtocols'
import { EmailInUseError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const okOrError = this.validation.validate(httpRequest.body)

      if (okOrError instanceof Error) {
        return badRequest(okOrError)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({
        email: account.email,
        password
      })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
