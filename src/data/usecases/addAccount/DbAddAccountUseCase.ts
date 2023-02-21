import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './DbAddAccountProtocols'

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
