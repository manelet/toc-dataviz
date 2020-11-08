const { isDev } = require('./lib/utils')

if (isDev) {
  require('dotenv').config()
}

const app = require('express')()
const cors = require('cors')

const { REDIS_PW } = process.env

const routes = require('./routes')
const createCache = require('./lib/cache')
const cache = createCache(!isDev ? { password: REDIS_PW } : {})

app.use(cors())
app.use((req, res, next) => {
  req.cache = cache
  return next()
})

app.get('/check', (req, res) => res.send({ status: 'OK' }))
app.use('/api', routes)

app.listen(process.env.PORT)

module.exports = app
