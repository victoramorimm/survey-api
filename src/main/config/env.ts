export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/curso-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'q2pokgF´~1RFL'
}
