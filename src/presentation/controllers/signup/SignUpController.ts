import { AddAccount, Controller, HttpRequest, HttpResponse } from './SignUpProtocols'
import { badRequest, ok, serverError } from '../../helpers/http/HttpHelper'
import { Validation } from '../login/LoginProtocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation

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

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
