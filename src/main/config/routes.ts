import { Express, Router } from 'express'
import fg from 'fast-glob'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  const routesFolder = path.resolve(__dirname, '..', 'routes')

  readdirSync(routesFolder).map(async (file) => {
    if (!file.includes('.test.')) {
      (await import(`${routesFolder}/${file}`)).default(router)
    }
  })
}
