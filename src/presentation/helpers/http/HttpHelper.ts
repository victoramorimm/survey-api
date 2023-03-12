import { ServerError } from '../../errors'
import { UnauthorizedError } from '../../errors/UnauthorizedError'
import { HttpResponse } from '../../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (data: any) => ({
  statusCode: 200,
  body: data
})

export const unauthorized = () => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
