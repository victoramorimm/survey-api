import { Router } from 'express'
import { adaptRoute } from '../adapters/express/expressRouteAdapter'
import { makeSignUpController } from '../factories/signup/signup'

export default (router: Router) => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
