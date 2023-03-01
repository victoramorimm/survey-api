import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helper/MongoHelper'
import app from '../config/app'

describe('Signup Routes', () => {
  test('should return an account on success', async () => {
    beforeAll(async () => {
      await MongoHelper.connect(global.__MONGO_URI__)
    })

    beforeEach(async () => {
      const accountCollection = await MongoHelper.getCollection('accounts')

      await accountCollection.deleteMany({})
    })

    afterAll(async () => {
      MongoHelper.disconnect()
    })

    await request(app)
      .post('/api/signup')
      .send({
        name: 'Victor',
        email: 'victorteste@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
