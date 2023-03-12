import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './LoginProtocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/HttpHelper'

export class LoginController implements Controller {
  constructor (
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
