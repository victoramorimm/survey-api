import { AddAccountRepository } from '../../../data/protocols/AddAccountRepository'
import { AccountModel } from '../../../domain/models/AccountModel'
import { AddAccountModel } from '../../../domain/usecases/IAddAccountUseCase'
import { MongoHelper } from './helper/MongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountById = await accountCollection.findOne({ _id: result.insertedId })

    const { _id, ...accountWithoutId } = accountById

    const account = {
      ...accountWithoutId as Omit<AccountModel, 'id'>,
      id: _id.toHexString()
    }

    return account
  }
}
