import { Collection } from 'mongodb'
import env from '../../../main/config/env'
import { MongoHelper } from './helper/MongoHelper'
import { LogMongoRepository } from './LogMongoRepository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')

    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  test('should create an error log on success', async () => {
    const sut = makeSut()

    await sut.logError('any_error')

    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
