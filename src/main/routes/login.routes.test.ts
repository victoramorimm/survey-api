import { Collection } from 'mongodb'
import request from 'supertest'
import { BcryptAdapter } from '../../infra/criptography/bcryptAdapter/BcryptAdapter'
import { MongoHelper } from '../../infra/db/mongodb/helper/MongoHelper'
import app from '../config/app'
import env from '../config/env'

let accountCollection: Collection

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await new BcryptAdapter(12).hash('123')

      await accountCollection.insertOne({
        name: 'Victor',
        email: 'victorteste@gmail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'victorteste@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'victorteste@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
