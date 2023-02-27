import { AccountMongoRepository } from './AccountMongoRepository'
import { MongoHelper } from './helper/MongoHelper'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    const sut = new AccountMongoRepository()

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
