import { Router } from 'express'
import { adaptRoute } from '../adapters/expressRouteAdapter'
import { makeSignUpController } from '../factories/signup'

export default (router: Router) => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
