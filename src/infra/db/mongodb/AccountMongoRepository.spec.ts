import env from '../../../main/config/env'
import { AccountMongoRepository } from './AccountMongoRepository'
import { MongoHelper } from './helper/MongoHelper'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('should return an account on success', async () => {
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
})
