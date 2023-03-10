import { DbAddAccountUseCase } from '../../data/usecases/addAccount/DbAddAccountUseCase'
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/AccountMongoRepository'
import { LogMongoRepository } from '../../infra/db/mongodb/LogMongoRepository'
import { SignUpController } from '../../presentation/controllers/signup/SignUpController'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/LogControllerDecorator'
import { makeSignUpValidation } from './SignUpValidationFactory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccountUseCase(encrypter, addAccountRepository)
  const controller = new SignUpController(addAccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(controller, logMongoRepository)
}
