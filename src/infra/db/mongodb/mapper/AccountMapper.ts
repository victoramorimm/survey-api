import { AccountModel } from '../../../../domain/models/AccountModel'

export class AccountMapper {
  static map = (account: any): AccountModel => {
    const { _id, ...accountWithoutId } = account

    const accountData = {
      ...accountWithoutId as Omit<AccountModel, 'id'>,
      id: _id.toHexString()
    }

    return accountData
  }
}
