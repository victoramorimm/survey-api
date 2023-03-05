import { DbAddAccountUseCase } from '../../data/usecases/addAccount/DbAddAccountUseCase'
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/AccountMongoRepository'
import { SignUpController } from '../../presentation/controllers/signup/SignUpController'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'
import { LogControllerDecorator } from '../decorators/LogControllerDecorator'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const emailValidator = new EmailValidatorAdapter()
  const addAccount = new DbAddAccountUseCase(encrypter, addAccountRepository)
  const controller = new SignUpController(emailValidator, addAccount)

  return new LogControllerDecorator(controller)
}
