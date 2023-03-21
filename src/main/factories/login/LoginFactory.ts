import { DbAuthenticationUseCase } from '../../../data/usecases/authentication/DbAuthenticationUseCase'
import { BcryptAdapter } from '../../../infra/criptography/bcryptAdapter/BcryptAdapter'
import { JwtAdapter } from '../../../infra/criptography/jwtAdapter/JwtAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { LoginController } from '../../../presentation/controllers/login/LoginController'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { makeLoginValidation } from './LoginValidationFactory'

export const makeLoginController = (): Controller => {
  const encrypter = new JwtAdapter(env.jwtSecret)
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAuthenticationUseCase(accountRepository, hasher, encrypter, accountRepository)
  const controller = new LoginController(addAccount, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(controller, logMongoRepository)
}
