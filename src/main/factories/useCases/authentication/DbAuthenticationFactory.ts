import { DbAuthenticationUseCase } from '../../../../data/usecases/authentication/DbAuthenticationUseCase'
import { Authentication } from '../../../../domain/usecases/IAuthenticationUseCase'
import { BcryptAdapter } from '../../../../infra/criptography/bcryptAdapter/BcryptAdapter'
import { JwtAdapter } from '../../../../infra/criptography/jwtAdapter/JwtAdapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'
import env from '../../../config/env'

export const makeDbAuthentication = (): Authentication => {
  const encrypter = new JwtAdapter(env.jwtSecret)
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  return new DbAuthenticationUseCase(accountRepository, hasher, encrypter, accountRepository)
}
