import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './DbAddAccountProtocols'

export class DbAddAccountUseCase implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)

    const accountModel = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })

    return accountModel
  }
}
