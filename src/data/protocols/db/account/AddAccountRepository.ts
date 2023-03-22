import { AccountModel, AddAccountModel } from '../../../usecases/addAccount/DbAddAccountProtocols'

export interface AddAccountRepository {
  add (accountData: AddAccountModel): Promise<AccountModel>
}
