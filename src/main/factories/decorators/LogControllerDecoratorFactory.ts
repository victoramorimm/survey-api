import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(controller, logMongoRepository)
}
