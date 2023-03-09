import { Authentication, Controller, EmailValidator, HttpRequest, HttpResponse, Validation } from './LoginProtocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/HttpHelper'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const okOrError = this.validation.validate(httpRequest.body)

      if (okOrError instanceof Error) {
        return badRequest(okOrError)
      }

      const { email, password } = httpRequest.body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
