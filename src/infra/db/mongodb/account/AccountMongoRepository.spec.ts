import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { AccountMongoRepository } from './AccountMongoRepository'
import { MongoHelper } from '../helper/MongoHelper'
import { AccountMapper } from '../mapper/AccountMapper'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('should return an account on add success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      id: expect.any(String)
    })
  })

  test('should return an account on loadByEmail success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await sut.loadByEmail(
      'any_email@mail.com'
    )

    expect(account).toBeTruthy()
    expect(account).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      id: expect.any(String)
    })
  })

  test('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail(
      'any_email@mail.com'
    )

    expect(account).toBeNull()
  })

  test('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()

    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const accountById = await accountCollection.findOne({ _id: result.insertedId })

    const account = AccountMapper.map(accountById)

    expect(account.accessToken).toBeFalsy()

    await sut.updateAccessToken(
      'any_token',
      account.id
    )

    const updatedAccountById = await accountCollection.findOne({ _id: result.insertedId })

    const updatedAccount = AccountMapper.map(updatedAccountById)

    expect(updatedAccount).toBeTruthy()
    expect(updatedAccount.accessToken).toBe('any_token')
  })
})
