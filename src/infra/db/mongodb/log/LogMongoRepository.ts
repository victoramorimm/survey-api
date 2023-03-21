import { LogErrorRepository } from '../../../../data/protocols/db/log/LogErrorRepository'
import { MongoHelper } from '../helper/MongoHelper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorsCollection = await MongoHelper.getCollection('errors')

    await errorsCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
