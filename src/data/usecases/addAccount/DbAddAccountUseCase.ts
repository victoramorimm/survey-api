import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from './DbAddAccountProtocols'

export class DbAddAccountUseCase implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const loadedAccount = await this.loadAccountByEmailRepository.loadByEmail(account.email)

    if (loadedAccount) {
      return null
    }

    const hashedPassword = await this.hasher.hash(account.password)

    const accountModel = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })

    return accountModel
  }
}
