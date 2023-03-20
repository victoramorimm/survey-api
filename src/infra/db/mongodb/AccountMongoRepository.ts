import { AddAccountRepository } from '../../../data/protocols/db/AddAccountRepository'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/LoadAccountByEmailRepository'
import { AccountModel } from '../../../domain/models/AccountModel'
import { AddAccountModel } from '../../../domain/usecases/IAddAccountUseCase'
import { MongoHelper } from './helper/MongoHelper'
import { AccountMapper } from './mapper/AccountMapper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountById = await accountCollection.findOne({ _id: result.insertedId })

    return AccountMapper.map(accountById)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    if (!account) return null

    return AccountMapper.map(account)
  }
}
