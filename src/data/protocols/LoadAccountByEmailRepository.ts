import { AccountModel } from '../usecases/addAccount/DbAddAccountProtocols'

export interface LoadAccountByEmailRepository {
  load (email: string): Promise<AccountModel>
}
