import express from 'express'
import setupMiddlewares from './middlewares'

const app = express()

app.use(setupMiddlewares)

export default app
