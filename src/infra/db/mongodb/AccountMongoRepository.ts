import { AddAccountRepository } from '../../../data/protocols/db/AddAccountRepository'
import { AccountModel } from '../../../domain/models/AccountModel'
import { AddAccountModel } from '../../../domain/usecases/IAddAccountUseCase'
import { MongoHelper } from './helper/MongoHelper'
import { AccountMapper } from './mapper/AccountMapper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountById = await accountCollection.findOne({ _id: result.insertedId })

    return AccountMapper.map(accountById)
  }
}
