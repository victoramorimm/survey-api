import { Router } from 'express'
import { adaptRoute } from '../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../factories/controllers/login/LoginControllerFactory'
import { makeSignUpController } from '../factories/controllers/signup/SignUpControllerFactory'

export default (router: Router) => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
