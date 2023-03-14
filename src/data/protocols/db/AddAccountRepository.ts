import { AddAccountModel } from '../../domain/usecases/IAddAccountUseCase'
import { AccountModel } from '../../domain/models/AccountModel'

export interface AddAccountRepository {
  add (accountData: AddAccountModel): Promise<AccountModel>
}
