import { AccountModel } from '../../../domain/models/AccountModel'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/IAddAccountUseCase'
import { Encrypter } from '../../protocols/Encrypter'

export class DbAddAccountUseCase implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)

    return {
      ...account,
      id: 'any_id',
      password: hashedPassword
    }
  }
}
