import { Router } from 'express'
import { adaptRoute } from '../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../factories/login/LoginFactory'
import { makeSignUpController } from '../factories/signup/signup'

export default (router: Router) => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
