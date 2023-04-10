import { DbAddAccountUseCase } from '../../../../data/usecases/addAccount/DbAddAccountUseCase'
import { AddAccount } from '../../../../domain/usecases/IAddAccountUseCase'
import { BcryptAdapter } from '../../../../infra/criptography/bcryptAdapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  return new DbAddAccountUseCase(hasher, addAccountRepository)
}
