import { DbAddAccountUseCase } from '../../data/usecases/addAccount/DbAddAccountUseCase'
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/AccountMongoRepository'
import { SignUpController } from '../../presentation/controllers/signup/SignUpController'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const emailValidator = new EmailValidatorAdapter()
  const addAccount = new DbAddAccountUseCase(encrypter, addAccountRepository)

  return new SignUpController(emailValidator, addAccount)
}
