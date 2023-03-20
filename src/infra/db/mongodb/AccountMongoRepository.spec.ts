import { Collection } from 'mongodb'
import env from '../../../main/config/env'
import { AccountMongoRepository } from './AccountMongoRepository'
import { MongoHelper } from './helper/MongoHelper'

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
})
