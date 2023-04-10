import { LoadAccountByEmailRepository } from '../authentication/DbAuthenticationProtocols'
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './DbAddAccountProtocols'

export class DbAddAccountUseCase implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(account.email)

    const hashedPassword = await this.hasher.hash(account.password)

    const accountModel = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })

    return accountModel
  }
}
