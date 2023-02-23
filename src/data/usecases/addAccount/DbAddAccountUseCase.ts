import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './DbAddAccountProtocols'

export class DbAddAccountUseCase implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)

    await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })

    return {
      ...account,
      id: 'any_id',
      password: hashedPassword
    }
  }
}
